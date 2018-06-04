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
    private mousePosition: Vector;

    // pan-zoom
    private transformChanged: boolean = false;
    private PanZoomData: PanZoomData;

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
        this._mouseManager.subscribe((e) => {
            this.mouseChanged(e);
        });

        this._panZoomManager.subscribe((e) => {
            this.panZoomChanged(e);
        });
    }

    private mouseChanged(e: MouseData) {
        this.mousePosition = e.mousePosition;
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
                // draw grid
                if (this._enableGrid) {
                    this.helperUtility.drawGrid('rgba(24, 24, 24, .80)', 30);
                }
            }

            // apply any panning or zooming
            if (this.PanZoomData) {
                this._context.setTransform(
                    this.PanZoomData.scale, // scale x
                    0, // skew x
                    0, // skew y
                    this.PanZoomData.scale, // scale y
                    this.PanZoomData.pan.x, // pan x
                    this.PanZoomData.pan.y // pan y
                );
            }

            // do the draw callback
            this.drawCallback();

            if (this.enableGrid) {
                // draw grid
                if (!this._overlayAsBackground) {
                    this.helperUtility.drawGrid('rgba(24, 24, 24, .80)', 30);
                }
            }

            if (this._trackMouse && this.mousePosition) {
                this.helperUtility.trackMouse(this.mousePosition, 'rgba(255, 255, 255, .80)');
            }

            this.restoreContext();
            this.frameStep = false;
        }

        // update keyboard
        this._keyboardManager.update();

        // do it all again
        requestAnimationFrame(() => this.start());
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
