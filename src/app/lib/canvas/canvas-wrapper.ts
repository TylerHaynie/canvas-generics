import { MouseManager } from './managers/mouse/mouse-manager';
import { RandomUtility } from './utilities/random-utility';
import { ColorUtility } from './utilities/color-utility';
import { GraidentUtility } from './utilities/graident-utility';
import { ImageDataUtility } from './utilities/image-data-utility';
import { PatternUtility } from './utilities/pattern-utility';
import { KeyboardManager } from './managers/keyboard-manager';
import { WindowManager } from './managers/window-manager';
import { HelperUtility } from './utilities/helper-utility';
import { Vector } from './objects/vector';
import { PanZoomManager } from './managers/pan-zoom/pan-zoom-manager';
import { MouseData } from './managers/mouse/mouse-data';
import { PanZoomData } from './managers/pan-zoom/pan-zoom-data';
import { MouseEventType, PanZoomEventType } from './events/canvas-event-types';
import { QuadTree, Boundary, QuadVector } from '../quadtree/quad-tree';
import { Rectangle } from './shapes/rectangle';
import { Size } from './models/size';
import { Color } from './models/color';
import { LineStyle } from './models/line-style';

export class CanvasWrapper {

    // public properties
    public get drawingContext(): CanvasRenderingContext2D { return this._context; }

    public get mouseManager() { return this._mouseManager; }
    public get panZoomManager() { return this._panZoomManager; }
    public get keyboardManager() { return this._keyboardManager; }

    public set pauseKeys(v: string[]) { this._pauseKeys = v; }
    public set frameForwardKeys(v: string[]) { this.frameForwardKeys = v; }

    public set enableGrid(v) { this._enableGrid = v; }
    public set overlayAsBackground(v) { this._overlayAsBackground = v; }
    public set trackMouse(v) { this._trackMouse = v; }

    public get random() { return this.randomUtil; }
    public get color() { return this.colorUtil; }
    public get graident() { return this.graidentUtility; }
    public get imageData() { return this.imageDataUtility; }
    public get pattern() { return this.patternUtility; }
    public get helper() { return this.helperUtility; }

    public get bounds() { return this._context.canvas.getBoundingClientRect(); }
    public get width() { return this._context.canvas.width; }
    public get height() { return this._context.canvas.height; }

    // context
    private _context: CanvasRenderingContext2D;
    private drawCallback: () => void;

    // control
    private _pauseKeys: string[] = ['p', 'P'];
    private _frameForwardKeys: string[] = ['>', '.'];
    private paused = false;
    private frameStep: boolean = false;

    // visual
    private _overlayAsBackground: boolean = false;
    private _enableGrid: boolean = true;
    private _trackMouse: boolean = true;

    // utils
    private randomUtil: RandomUtility;
    private colorUtil: ColorUtility;
    private graidentUtility: GraidentUtility;
    private imageDataUtility: ImageDataUtility;
    private patternUtility: PatternUtility;
    private helperUtility: HelperUtility;

    // managers
    private _panZoomManager: PanZoomManager;
    private _mouseManager: MouseManager;
    private _keyboardManager: KeyboardManager;
    private _WindowManager: WindowManager;

    // mouse
    private translatedMouse: Vector;

    // pan-zoom
    private transformChanged: boolean = false;
    private PanZoomData: PanZoomData;
    private needsFlip: boolean = false;

    constructor(context: CanvasRenderingContext2D, drawCallback: () => void) {
        this._context = context;
        this.drawCallback = drawCallback;

        this.setupManagers();
        this.setupUtilities();
        this.registerEvents();
        this.setupCanvas();

        this._WindowManager.resize();
    }

    start() {
        this.draw();
    }

    saveContext() {
        this._context.save();
    }

    restoreContext() {
        this._context.restore();
    }

    private setupManagers() {
        // window
        this._WindowManager = new WindowManager(this._context);

        // mouse
        this._mouseManager = new MouseManager(this._context);

        // keyboard
        this._keyboardManager = new KeyboardManager(this._context);

        // pan-zoom
        this._panZoomManager = new PanZoomManager(this._context, this._mouseManager);
    }

    private setupUtilities() {
        this.randomUtil = new RandomUtility();
        this.colorUtil = new ColorUtility();
        this.graidentUtility = new GraidentUtility(this._context);
        this.imageDataUtility = new ImageDataUtility(this._context);
        this.patternUtility = new PatternUtility(this._context);
        this.helperUtility = new HelperUtility(this._context);
    }

    private registerEvents() {
        this._mouseManager.on(MouseEventType.MOVE, (e) => {
            this.mouseMoved(e);
        });

        this._mouseManager.on(MouseEventType.DOWN, (e) => {
            this.mouseDown(e);
        });

        this._mouseManager.on(MouseEventType.UP, (e) => {
            this.mouseUp(e);
        });

        this._mouseManager.on(MouseEventType.OUT, (e) => {
            this.mouseLeave(e);
        });

        this._panZoomManager.on(PanZoomEventType.ZOOM, (e) => {
            this.panZoomChanged(e);
        });

        this._panZoomManager.on(PanZoomEventType.PAN, (e) => {
            this.panZoomChanged(e);
        });

        this._panZoomManager.on(PanZoomEventType.RESET, (e) => {
            this.panZoomChanged(e);
        });
    }

    private mouseMoved(e: MouseData) {
        this.translatedMouse = e.translatedPosition ? e.translatedPosition : e.mousePosition;
    }

    private mouseDown(e: MouseData) {
        // check UI quad tree for down
    }

    private mouseUp(e: MouseData) {
        // check UI quad tree for up
    }

    private mouseLeave(e: MouseData) {
        // mouse is off canvas
    }

    private panZoomChanged(e: PanZoomData) {
        this.transformChanged = true;
        this.PanZoomData = e;
    }

    private setupCanvas() {
        this._context.canvas.tabIndex = 1000; // canvas needs a tabindex so we can listen for keyboard events
        this._context.canvas.style.outline = 'none'; // removing the focus outline

        // for better image quality
        this._context.mozImageSmoothingEnabled = false;  // firefox
        this._context.imageSmoothingEnabled = false; // everything else
    }

    private draw() {
        // check for key input
        this.checkKeys();

        if (!this.paused || this.frameStep) {
            this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            this.saveContext();

            // draw the grid first?
            if (this._overlayAsBackground) {
                this.drawGrid();
            }

            // apply any pan or zoon
            this.applyPanAndZoom();

            // do the draw callback
            this.drawCallback();

            this.trackMousePosition();

            // draw the grid last?
            if (!this._overlayAsBackground) {
                this.drawGrid();
            }

            this.restoreContext();

            this.frameStep = false;
        }

        // update keyboard
        this._keyboardManager.update();

        // do it all again
        requestAnimationFrame(() => this.start());
    }

    private applyPanAndZoom() {
        if (this.PanZoomData) {
            this._context.translate(this.PanZoomData.pan.x, this.PanZoomData.pan.y);
            this._context.scale(this.PanZoomData.scale, this.PanZoomData.scale);

            this.mouseManager.contextupdated(this.PanZoomData);
        }
    }

    private drawGrid() {
        // draw grid
        if (this._enableGrid) {
            this.helperUtility.drawGrid('rgba(30, 30, 30, .80)', 30);
        }
    }

    private trackMousePosition() {
        if (this._trackMouse && this.translatedMouse) {
            this.helperUtility.trackMouse(this.translatedMouse, 'rgba(255, 255, 255, .80)');
        }
    }

    private checkKeys() {
        let kbm = this._keyboardManager;

        if (kbm.isDirty) {
            if (kbm.hasKeyDown) {
                console.log(kbm.key);
                if (this._pauseKeys.includes(kbm.key)) {
                    this.paused = !this.paused;
                }

                if (this._frameForwardKeys.includes(kbm.key)) {
                    this.frameStep = !this.frameStep;
                }
            }
        }

    }

}
