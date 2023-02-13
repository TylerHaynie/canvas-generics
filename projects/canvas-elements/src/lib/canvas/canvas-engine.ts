import { KEYBOARD_EVENT_TYPE, MOUSE_EVENT_TYPE } from './events/canvas-enums';
import { KeyboardData, MouseData } from './events/event-data';
import { KeyboardManager } from './managers/keyboard-manager';
import { MouseManager } from './managers/mouse-manager';
import { RenderManager } from './managers/render-manager';
import { WindowManager } from './managers/window-manager';
import { ICanvasComponent } from './models/interfaces/icanvas-component';
import { HelperUtility } from './utilities/helper-utility';

export class CanvasEngine {
    // game loop
    private loopDelta: number = 0;
    private previousTime: number = 0;
    private runTime: number = 0;
    private frameCount: number = 0;
    private fpsTick: number = 0;
    private renderTick: number = 0;

    // debug
    private fps: number = 0;
    private drawStartMarker = 'drawStart';
    private drawEndMarker = 'drawEnd';
    private drawMeasureName = 'drawMeasure';
    private debugCurrentKeyDown = '';

    // public properties
    public get mouseManager() { return this._mouseManager; }
    public get keyboardManager() { return this._keyboardManager; }
    public get renderManager() { return this._renderManager; }

    public get canvasWidth() { return this._context.canvas.width; }
    public get canvasHeight() { return this._context.canvas.height; }

    public set trackMouse(v: boolean) { this._trackMouse = v; }

    // context
    private _canvas: HTMLCanvasElement;
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
    private _mouseManager: MouseManager;
    private _renderManager: RenderManager;
    private _keyboardManager: KeyboardManager;
    private _windowManager: WindowManager;

    // canvas components
    private components: ICanvasComponent[] = [];

    // mouse
    private currentMouseData: MouseData;

    // TODO: probably needs to be a singleton or need to figure out a different way to register components.
    // constructor(context: CanvasRenderingContext2D, component: ICanvasComponent) {
        constructor(canvas: HTMLCanvasElement, component: ICanvasComponent) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this.setup();

        this.components.push(component);
    }

    public setup(){
        this.setupManagers();
        this.setupUtilities();
        this.registerEvents();
        this.setupCanvas();
        this._windowManager.fit();
        this._windowManager.setCursorStyle('none');
    }

    public start() {
        this.canvasComponentStartup();
        this.gameLoop();
    }

    private saveContext() {
        this._context.save();
    }

    private restoreContext() {
        this._context.restore();
    }

    private canvasComponentStartup() {
        for (const component of this.components) {
            component.startup();
        }
    }

    private setupManagers() {
        // window
        this._windowManager = new WindowManager(this._canvas);

        // mouse
        this._mouseManager = new MouseManager(this._canvas);

        // keyboard
        this._keyboardManager = new KeyboardManager(this._canvas);

        // rendering
        this._renderManager = new RenderManager();
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

        this.fpsTick += this.loopDelta;
        if (this.fpsTick >= 1000) {
            this.fps = this.frameCount;
            this.fpsTick = 0;
            this.frameCount = 0;
        }

        if (!this.paused || this.frameStep) {
            this.runTime += this.loopDelta;

            //TODO: render at target framerate, tick physics at much higher rate
            this.tickPhysics();

            // TODO: render at 30, 60, 90, 120, 144, etc. fps
            this.render();

            this.frameStep = false;
        }

        if (this.paused) {
            this.renderPauseMenu();
        }

        this.frameCount += 1;
        requestAnimationFrame(() => this.gameLoop());
    }

    private tickPhysics() {

    }

    private render(): void {
        performance.mark(this.drawStartMarker);

        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);

        this.saveContext();
        this.drawGrid();
        this.renderManager.renderPolygons(this._context);
        this.restoreContext();

        this.trackMousePosition();
        this.drawMouse();

        performance.mark(this.drawEndMarker);
        performance.measure(this.drawMeasureName, this.drawStartMarker, this.drawEndMarker)
        // this.drawDebug();
    }

    private renderPauseMenu(): void {
        this.saveContext();
        this._context.fillStyle = 'red';
        this._context.font = '25px courier new';
        this._context.fillText(`-- PAUSED --`, (this.canvasWidth / 2) - 95, 50);
        this.restoreContext();
    }

    private drawDebug() {
        var edgeOffset: number = 245;
        var valueOffset: number = edgeOffset / 1.9;
        var horzGap: number = 15;

        this._context.fillStyle = 'yellow';
        this._context.font = '14px courier new';

        const rightEdge = this._context.canvas.width;

        // background
        this.saveContext();
        this._context.fillStyle = 'black';
        this._context.globalAlpha = 0.75;
        this._context.fillRect(rightEdge - edgeOffset - horzGap, 0, 275, 200);
        this.restoreContext();

        // runtime
        let time = this.runTime / 1000;
        let timeLabel = time > 1 && time < 60 ? 's' : time > 60 && time < 3600 ? 'm' : time > 3600 ? 'h' : 'ms';
        time = time > 60 ? time / 60 : time;

        this._context.fillText(`runtime     : `, rightEdge - edgeOffset, horzGap);
        this._context.fillText(`${(time).toFixed(2).toString()}(${timeLabel})`, rightEdge - valueOffset, horzGap);

        // delta
        this._context.fillText(`frame delta : `, rightEdge - edgeOffset, horzGap * 2);
        this._context.fillText(`${this.loopDelta.toFixed(2).toString()}(ms)`, rightEdge - valueOffset, horzGap * 2);

        // fps
        this._context.fillText(`fps         : `, rightEdge - edgeOffset, horzGap * 3);
        this._context.fillText(`${this.fps.toFixed(2).toString()}`, rightEdge - valueOffset, horzGap * 3);


        // object count
        this._context.fillText('objects     : ', rightEdge - edgeOffset, horzGap * 4);
        this._context.fillText(`${this._renderManager.polygonCount.toString()}`, rightEdge - valueOffset, horzGap * 4);

        // draw calls
        this._context.fillText('draw calls  : ', rightEdge - edgeOffset, horzGap * 5);
        this._context.fillText(`${this._renderManager.drawCalls.toString()}`, rightEdge - valueOffset, horzGap * 5);

        // draw rate
        let drawMeasure = performance.getEntriesByType("measure").find(f => f.name == this.drawMeasureName);
        this._context.fillText('draw time   : ', rightEdge - edgeOffset, horzGap * 6);
        this._context.fillText(`${drawMeasure ? drawMeasure.duration.toFixed(2) : ''}(ms)`, rightEdge - valueOffset, horzGap * 6);

        // mouse
        this._context.fillText('mouse       : ', rightEdge - edgeOffset, horzGap * 7);
        var mouseText: string = this._mouseManager.mousePosition ? `x: ${this.currentMouseData.mousePosition.x} y: ${this.currentMouseData.mousePosition.y}` : `unavailable`
        this._context.fillText(mouseText, rightEdge - valueOffset, horzGap * 7);

        // screen
        this._context.fillText('canvas size : ', rightEdge - edgeOffset, horzGap * 8);
        this._context.fillText(`w: ${this._context.canvas.width} h: ${this._context.canvas.height}`, rightEdge - valueOffset, horzGap * 8);

        // keydown
        this._context.fillText('keydown     : ', rightEdge - edgeOffset, horzGap * 9);
        this._context.fillText(`${this.debugCurrentKeyDown}`, rightEdge - valueOffset, horzGap * 9);

        performance.clearMarks();
        performance.clearMeasures();
    }

    private drawGrid(): void {
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
        this._windowManager.setCursorStyle(this.paused ? 'default' : 'none');
        this._keyboardManager.allowPropagation(this.paused);
    }
}
