import { HelperUtility } from '@canvas/utilities/helper-utility';
import { PanZoomManager } from '@canvas/managers/pan-zoom-manager';
import { MouseManager } from '@canvas/managers/mouse-manager';
import { KeyboardManager } from '@canvas/managers/keyboard-manager';
import { WindowManager } from '@canvas/managers/window-manager';
import { Vector } from '@canvas/objects/vector';
import { PanZoomData, MouseData } from '@canvas/events/event-data';
import { MOUSE_EVENT_TYPE, PAN_ZOOM_EVENT_TYPE, MOUSE_STATE } from '@canvas/events/canvas-event-types';
import { UIManager } from '@canvas/managers/ui-manager';

export class CanvasWrapper {
    private delta;
    private lastRender;
    private fps: number;


    // public properties
    public get drawingContext(): CanvasRenderingContext2D { return this._context; }
    public get mouseManager() { return this._mouseManager; }
    public get panZoomManager() { return this._panZoomManager; }
    public get keyboardManager() { return this._keyboardManager; }
    public get uiManager() { return this._uiManager; }

    public get bounds() { return this._context.canvas.getBoundingClientRect(); }
    public get width() { return this._context.canvas.width; }
    public get height() { return this._context.canvas.height; }

    public set pauseKeys(v: string[]) { this._pauseKeys = v; }
    public set frameForwardKeys(v: string[]) { this.frameForwardKeys = v; }
    public set enableGrid(v) { this._enableGrid = v; }
    public set overlayAsBackground(v) { this._overlayAsBackground = v; }
    public set trackMouse(v) { this._trackMouse = v; }

    // context
    private _context: CanvasRenderingContext2D;

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
    private helperUtility: HelperUtility;

    // managers
    private _panZoomManager: PanZoomManager;
    private _mouseManager: MouseManager;
    private _uiManager: UIManager;
    private _keyboardManager: KeyboardManager;
    private _WindowManager: WindowManager;

    // mouse
    private currentMouseData: MouseData;

    // pan-zoom
    private transformChanged: boolean = false;
    private PanZoomData: PanZoomData;
    private needsFlip: boolean = false;

    constructor(context: CanvasRenderingContext2D, drawCallback: () => void) {
        this._context = context;

        this.setupManagers();
        this.setupUtilities();
        this.registerEvents();
        this.setupCanvas();

        this.uiManager.addToMainBuffer(drawCallback);
        this._WindowManager.fit();
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

        // UI and main drawing
        this._uiManager = new UIManager(this._context, this._mouseManager);

        // pan-zoom
        this._panZoomManager = new PanZoomManager(this._context, this._mouseManager);
    }

    private setupUtilities() {
        this.helperUtility = new HelperUtility(this._context);
    }

    private registerEvents() {
        this._mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e) => {
            this.mouseMoved(e);
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.DOWN, (e) => {
            this.mouseDown(e);
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.UP, (e) => {
            this.mouseUp(e);
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.OUT, (e) => {
            this.mouseLeave(e);
        });

        this._panZoomManager.on(PAN_ZOOM_EVENT_TYPE.ZOOM, (e) => {
            this.panZoomChanged(e);
        });

        this._panZoomManager.on(PAN_ZOOM_EVENT_TYPE.PAN, (e) => {
            this.panZoomChanged(e);
        });

        this._panZoomManager.on(PAN_ZOOM_EVENT_TYPE.RESET, (e) => {
            this.panZoomChanged(e);
        });
    }

    private mouseMoved(e: MouseData) {
        this.currentMouseData = e;
    }

    private mouseDown(e: MouseData) {
        this.currentMouseData = e;
    }

    private mouseUp(e: MouseData) {
        this.currentMouseData = e;
    }

    private mouseLeave(e: MouseData) {
        this.currentMouseData = e;
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
        this.delta = performance.now() - this.lastRender;
        this.fps = Math.floor(1000 / this.delta);

        // check for key input
        this.checkKeys();

        if (!this.paused || this.frameStep) {
            this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            this.saveContext();

            // draw the grid first?
            if (this._overlayAsBackground) { this.drawGrid(); }

            // apply any pan or zoon
            this.applyPanAndZoom();

            this._uiManager.drawMainBuffer();

            if (this._uiManager.uiEnabled) { this._uiManager.drawUiBuffer(); }
            if (this._uiManager.debugEnabled) { this._uiManager.drawDebugBuffer(); }

            this.trackMousePosition();

            // draw the grid last?
            if (!this._overlayAsBackground) {
                this.drawGrid();
            }

            this.drawMouse();

            this.restoreContext();

            this.frameStep = false;
        }

        // update keyboard
        this._keyboardManager.update();

        this._context.fillStyle = 'yellow';
        this._context.font = '14px courier new';
        this._context.fillText(this.fps.toString(), 15, 15);

        this.lastRender = performance.now();
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
        if (this._mouseManager.mouseOnCanvas) {
            if (this.trackMouse) {
                this.helperUtility.trackMouse(this.currentMouseData.mousePosition, 'rgba(255, 255, 255, .80)');
            }
        }
    }

    private drawMouse() {
        if (this._mouseManager.mouseOnCanvas) {
            this.helperUtility.drawMouse(this.currentMouseData.mousePosition, this.currentMouseData.uiMouseState);
        }

    }

    private checkKeys() {
        let kbm = this._keyboardManager;

        if (kbm.isDirty) {
            if (kbm.hasKeyDown) {
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
