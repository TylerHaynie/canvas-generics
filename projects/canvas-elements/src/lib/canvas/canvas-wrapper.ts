import { MOUSE_EVENT_TYPE } from './events/canvas-enums';
import { MouseData } from './events/event-data';
import { KeyboardManager } from './managers/keyboard-manager';
import { MouseManager } from './managers/mouse-manager';
import { PanZoomManager } from './managers/pan-zoom-manager';
import { RenderManager } from './managers/render-manager';
import { WindowManager } from './managers/window-manager';
import { IDrawable } from './models/interfaces/idrawable';
import { ITickable } from './models/interfaces/itickable';
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
    public get renderManager() { return this._renderManager; }

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
    private _renderManager: RenderManager;
    private _keyboardManager: KeyboardManager;
    private _WindowManager: WindowManager;

    // scene objects
    private _drawables: IDrawable[] = [];
    private _tickables: ITickable[] = [];

    // mouse
    private currentMouseData: MouseData;

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;

        this.setupManagers();
        this.setupUtilities();
        this.registerEvents();
        this.setupCanvas();

        // this means only 1 component can be drawn per canvas.
        // need to add an array to the canvas wrapper that can hold drawable objects.
        // this._renderManager.addToMainBuffer(drawCallback);
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

    addToTick(tickable: ITickable): void {
        this._tickables.push(tickable);
    }

    addToDraw(drawable: IDrawable): void {
        this._drawables.push(drawable);
    }

    private setupManagers() {
        // window
        this._WindowManager = new WindowManager(this._context);

        // mouse
        this._mouseManager = new MouseManager(this._context);

        // keyboard
        this._keyboardManager = new KeyboardManager(this._context);

        // UI and main drawing
        this._renderManager = new RenderManager(this._mouseManager);

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

            // this._renderManager.drawMainBuffer(this._context);
            this._tickables.forEach(tickable => {
                tickable.tick(this.delta);
            });

            this._drawables.forEach(drawable => {
                drawable.draw(this._context);
            });

            if (this._renderManager.uiEnabled) { this._renderManager.drawUiBuffer(); }
            if (this._renderManager.debugEnabled) { this._renderManager.drawDebugBuffer(); }

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
        requestAnimationFrame(() => this.draw());
    }

    private beginDebugStuff() {
        if (this._renderManager.debugEnabled) {
            this.timeSinceFpsTick = this.timeSinceFpsTick + this.delta;

            if (this.timeSinceFpsTick > 100) {
                this.fps = Math.floor(1000 / this.delta);
                this.timeSinceFpsTick = 0;
            }
        }
    }

    private endDebugStuff() {
        if (this._renderManager.debugEnabled) {
            this._context.fillStyle = 'yellow';
            this._context.font = '14px courier new';

            const rightSide = this._context.canvas.width;

            // delta
            this._context.fillText('delta: ', rightSide - 100, 15);
            this._context.fillText(this.delta.toFixed(2).toString(), rightSide - 45, 15);

            // fps
            this._context.fillText('fps  : ', rightSide - 100, 30);
            this._context.fillText(this.fps.toString(), rightSide - 45, 30);
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
