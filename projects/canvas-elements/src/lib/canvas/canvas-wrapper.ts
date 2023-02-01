import { KEYBOARD_EVENT_TYPE, MOUSE_EVENT_TYPE } from './events/canvas-enums';
import { KeyboardData, MouseData } from './events/event-data';
import { KeyboardManager } from './managers/keyboard-manager';
import { MouseManager } from './managers/mouse-manager';
import { PanZoomManager } from './managers/pan-zoom-manager';
import { RenderManager } from './managers/render-manager';
import { WindowManager } from './managers/window-manager';
import { IDrawable } from './models/interfaces/idrawable';
import { ITickable } from './models/interfaces/itickable';
import { IUpdateable } from './models/interfaces/iupdateable';
import { Size } from './models/size';
import { RecText } from './objects/rec-text';
import { Vector2D } from './objects/vector';
import { HelperUtility } from './utilities/helper-utility';

export class CanvasWrapper {
    // game loop
    public loopDelta: number = 0;
    private previousTime: number = 0;
    private totalTime: number = 0;

    // debug
    private fps: number = 0;
    private drawCalls: number = 0;
    private drawStartMarker = 'drawStart';
    private drawEndMarker = 'drawEnd';
    private drawMeasureName = 'drawMeasure';
    private debugCurrentKeyDown = '';

    // public properties
    public get drawingContext(): CanvasRenderingContext2D { return this._context; }
    public get mouseManager() { return this._mouseManager; }
    public get panZoomManager() { return this._panZoomManager; }
    public get keyboardManager() { return this._keyboardManager; }
    public get renderManager() { return this._renderManager; }

    public get width() { return this._context.canvas.width; }
    public get height() { return this._context.canvas.height; }

    // public set pauseKeys(v: string) { this._pauseKey = v; }
    public set frameForwardKeys(v: string[]) { this.frameForwardKeys = v; }
    public set enableGrid(v: boolean) { this._enableGrid = v; }
    public set gridAsBackground(v: boolean) { this._gridAsBackground = v; }
    public set trackMouse(v: boolean) { this._trackMouse = v; }

    // context
    private _context: CanvasRenderingContext2D;

    // control
    private _pauseKey: string[] = ['Escape'];
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

    // mouse
    private currentMouseData: MouseData;

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;

        this.setupManagers();
        this.setupUtilities();
        this.registerEvents();
        this.setupCanvas();

        this._WindowManager.fit();
    }

    start() {
        this._WindowManager.setCursorStyle('none');
        this.gameLoop();
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

        // drawing
        this._renderManager = new RenderManager(this._mouseManager);

        // TODO: replace with camera
        // pan-zoom
        this._panZoomManager = new PanZoomManager(this._context, this._mouseManager);
    }

    private setupUtilities() {
        this.helperUtility = new HelperUtility(this._context);
    }

    private registerEvents() {
        this.registerMouseEvents();
        this.registerKeyboardEvents();
    }

    // This is needed for the element base to set mouse state
    // This connects element base to mouse. probably needs to change.
    private registerMouseEvents() {
        this._mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e: MouseData) => {
            this.currentMouseData = e;
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.DOWN, (e: MouseData) => {
            this.currentMouseData = e;
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.UP, (e: MouseData) => {
            this.currentMouseData = e;
        });

        this._mouseManager.on(MOUSE_EVENT_TYPE.OUT, (e: MouseData) => {
            this.currentMouseData = e;
        });
    }

    private registerKeyboardEvents() {
        this._keyboardManager.on(KEYBOARD_EVENT_TYPE.KEY_DOWN, (e: KeyboardData) => {
            this.handleKeyDown(e);
        });

        this._keyboardManager.on(KEYBOARD_EVENT_TYPE.KEY_UP, (e: KeyboardData) => {
            this.handleKeyUp(e);
        });
    }

    private setupCanvas() {
        this._context.canvas.tabIndex = 1000; // canvas needs a tabindex so we can listen for keyboard events
        this._context.canvas.style.outline = 'none'; // removing the focus outline
        this._context.imageSmoothingEnabled = false;
    }

    private gameLoop() {
        const currentTime = performance.now();
        this.loopDelta = currentTime - this.previousTime;
        this.previousTime = currentTime;

        this.trackDebug();

        if (!this.paused || this.frameStep) {
            this.totalTime += this.loopDelta;

            // this.tickphysics();
            this.render();
            this.frameStep = false;
        }

        if (this.paused) {
            this.renderPauseMenu();
        }

        // do it all again
        requestAnimationFrame(() => this.gameLoop());
    }

    private render(): void {
        performance.mark(this.drawStartMarker);

        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);

        this.drawCalls = 0;
        this.saveContext();
        this.renderManager.drawUiBuffer();
        this.restoreContext();

        this.trackMousePosition();
        this.drawMouse();

        performance.mark(this.drawEndMarker);
        performance.measure(this.drawMeasureName, this.drawStartMarker, this.drawEndMarker)
        this.drawDebug();
    }

    private trackDebug() {
        // if (this._renderManager.debugEnabled) {
        //     this.timeSinceFpsTick = this.timeSinceFpsTick + this.frameTime;

        //     if (this.timeSinceFpsTick > 100) {
        //         this.fps = Math.floor(1000 / this.frameTime);
        //         this.timeSinceFpsTick = 0;
        //     }
        // }
    }

    private renderPauseMenu(): void {
        this.saveContext();
        this._context.fillStyle = 'red';
        this._context.font = '25px courier new';
        this._context.fillText(`-- PAUSED --`, (this.width / 2) - 95, 50);
        this.restoreContext();
    }

    private drawDebug() {
        if (!this._renderManager.debugEnabled) return;

        var edgeOffset: number = 245;
        var valueOffset: number = edgeOffset / 1.9;
        var horzGap: number = 15;

        this._context.fillStyle = 'yellow';
        this._context.font = '14px courier new';

        const rightEdge = this._context.canvas.width;

        // runtime
        let time = this.totalTime / 1000;
        let timerLabel = time > 1 && time < 60 ? 's' : time > 60 && time < 3600 ? 'm' : time > 3600 ? 'h' : 'ms';
        time = time > 60 ? time / 60 : time;

        this._context.fillText(`time (${timerLabel})   : `, rightEdge - edgeOffset, horzGap);
        this._context.fillText(`${(time).toFixed(2).toString()}`, rightEdge - valueOffset, horzGap);

        // delta
        this._context.fillText('delta      : ', rightEdge - edgeOffset, horzGap * 2);
        this._context.fillText(`${this.loopDelta.toFixed(2).toString()}`, rightEdge - valueOffset, horzGap * 2);

        // draw calls
        this._context.fillText('draw calls : ', rightEdge - edgeOffset, horzGap * 3);
        this._context.fillText(`${this.drawCalls.toString()}`, rightEdge - valueOffset, horzGap * 3);

        // draw rate
        let drawMeasure = performance.getEntriesByType("measure").find(f => f.name == this.drawMeasureName);
        this._context.fillText('draw time  : ', rightEdge - edgeOffset, horzGap * 4);
        this._context.fillText(`${drawMeasure ? drawMeasure.duration.toFixed(2) : ''}`, rightEdge - valueOffset, horzGap * 4);

        // mouse
        this._context.fillText('mouse      : ', rightEdge - edgeOffset, horzGap * 5);
        var mouseText: string = this._mouseManager.mousePosition ? `x: ${this.currentMouseData.mousePosition.x} y: ${this.currentMouseData.mousePosition.y}` : `unavailable`
        this._context.fillText(mouseText, rightEdge - valueOffset, horzGap * 5);

        // screen
        this._context.fillText('canvas size: ', rightEdge - edgeOffset, horzGap * 6);
        this._context.fillText(`w: ${this._context.canvas.width} h: ${this._context.canvas.height}`, rightEdge - valueOffset, horzGap * 6);

        // keydown
        this._context.fillText('keydown    : ', rightEdge - edgeOffset, horzGap * 7);
        this._context.fillText(`'${this.debugCurrentKeyDown}'`, rightEdge - valueOffset, horzGap * 7);

        performance.clearMarks();
        performance.clearMeasures();
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

    private handleKeyDown(kData: KeyboardData) {
        if (this._pauseKey.includes(kData.latestKeyDown)) this.togglePause();
        if (this._frameForwardKeys.includes(kData.latestKeyDown)) this.frameStep = !this.frameStep;

        this.debugCurrentKeyDown = kData.keyQueue.join(',');
    }

    private handleKeyUp(kData: KeyboardData) {
        this.debugCurrentKeyDown = kData.keyQueue.join(',');
    }

    private togglePause(): void {
        this.paused = !this.paused;
        this._WindowManager.setCursorStyle(this.paused ? 'default' : 'none');
        this._keyboardManager.allowPropagation(this.paused);
    }
}
