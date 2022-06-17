import { MOUSE_EVENT_TYPE } from './events/canvas-enums';
import { MouseData } from './events/event-data';
import { KeyboardManager } from './managers/keyboard-manager';
import { MouseManager } from './managers/mouse-manager';
import { PanZoomManager } from './managers/pan-zoom-manager';
import { UIManager } from './managers/ui-manager';
import { WindowManager } from './managers/window-manager';
import { HelperUtility } from './utilities/helper-utility';

export class CanvasWrapper {
    public delta: number = 0;
    private lastRender: number = 0;
    private fps: number = 0;
    private timeSinceFpsTick = 0.0;

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
    public set enableGrid(v: boolean) { this._enableGrid = v; }
    public set gridAsBackground(v: boolean) { this._gridAsBackground = v; }
    public set trackMouse(v: boolean) { this._trackMouse = v; }

    // context
    private _context: CanvasRenderingContext2D;

    // control
    private _pauseKeys: string[] = ['p', 'P'];
    private _frameForwardKeys: string[] = ['>', '.'];
    private paused = false;
    private frameStep: boolean = false;

    // visual
    private _gridAsBackground: boolean = false;
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

    constructor(context: CanvasRenderingContext2D, drawCallback: () => void) {
        this._context = context;

        this.setupManagers();
        this.setupUtilities();
        this.registerEvents();
        this.setupCanvas();

        this._uiManager.addToMainBuffer(drawCallback);
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
        this._uiManager = new UIManager(this._mouseManager);

        // pan-zoom
        this._panZoomManager = new PanZoomManager(this._context, this._mouseManager);
    }

    private setupUtilities() {
        this.helperUtility = new HelperUtility(this._context);
    }

    private registerEvents() {
        this.registerMouseEvents();
        /// ... other events
    }

    // This is needed for the element base to set mouse state
    // This connects element base to mouse. probably needs to change.
    private registerMouseEvents() {
        this._mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e) => {
            this.currentMouseData = e;
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.DOWN, (e) => {
            this.currentMouseData = e;
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.UP, (e) => {
            this.currentMouseData = e;
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.OUT, (e) => {
            this.currentMouseData = e;
        });
    }

    private setupCanvas() {
        this._context.canvas.tabIndex = 1000; // canvas needs a tabindex so we can listen for keyboard events
        this._context.canvas.style.outline = 'none'; // removing the focus outline
        this._context.imageSmoothingEnabled = false;
    }

    private draw() {
        this.delta = performance.now() - this.lastRender;

        this.beginDebugStuff();
        this.checkKeys();

        if (!this.paused || this.frameStep) {
            this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            this.saveContext();

            // TODO: Apply camera positon

            // draw the grid first?
            if (this._gridAsBackground) { this.drawGrid(); }

            this._uiManager.drawMainBuffer(this._context);

            if (this._uiManager.uiEnabled) { this._uiManager.drawUiBuffer(); }
            if (this._uiManager.debugEnabled) { this._uiManager.drawDebugBuffer(); }

            this.trackMousePosition();

            // draw the grid last?
            if (!this._gridAsBackground) {
                this.drawGrid();
            }

            this.drawMouse();
            this.restoreContext();
            this.frameStep = false;
        }

        // update keyboard
        this._keyboardManager.update(); // TODO: Do we need this?
        this.endDebugStuff();

        this.lastRender = performance.now();
        // do it all again
        requestAnimationFrame(() => this.start());
    }

    private beginDebugStuff() {
        if (this._uiManager.debugEnabled) {
            this.timeSinceFpsTick = this.timeSinceFpsTick + this.delta;

            if (this.timeSinceFpsTick > 100) {
                this.fps = Math.floor(1000 / this.delta);
                this.timeSinceFpsTick = 0;
            }
        }
    }

    private endDebugStuff() {
        if (this._uiManager.debugEnabled) {
            this._context.fillStyle = 'yellow';
            this._context.font = '14px courier new';

            // frame render
            this._context.fillText('delta: ', 15, 15);
            this._context.fillText(this.delta.toString(), 75, 15);

            // // fps
            this._context.fillText('fps  : ', 15, 30);
            this._context.fillText(this.fps.toString(), 75, 30);
        }
    }

    private drawGrid(): void {
        // draw grid
        if (this._enableGrid) {
            this.helperUtility.getGrid('rgba(30, 30, 30, .80)', 30).draw(this._context);
        }
    }

    private trackMousePosition() {
        if (this._mouseManager.mouseOnCanvas) {
            if (this._trackMouse) {
                this.helperUtility.trackMouse(this._mouseManager.mousePosition, 'rgba(255, 255, 255, .80)').draw(this._context);
            }
        }
    }

    private drawMouse() {
        if (this._mouseManager.mouseOnCanvas) {
            this.helperUtility.drawMouse(this._mouseManager.mousePosition, this.currentMouseData.uiMouseState);
        }
    }

    private checkKeys() {
        if (this._keyboardManager.isDirty) {
            if (this._keyboardManager.hasKeyDown) {
                if (this._pauseKeys.includes(this._keyboardManager.key)) {
                    this.paused = !this.paused;
                }

                if (this._frameForwardKeys.includes(this._keyboardManager.key)) {
                    this.frameStep = !this.frameStep;
                }
            }
        }
    }
}
