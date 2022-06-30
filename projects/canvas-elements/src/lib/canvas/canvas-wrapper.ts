import { MOUSE_EVENT_TYPE } from './events/canvas-enums';
import { MouseData } from './events/event-data';
import { KeyboardManager } from './managers/keyboard-manager';
import { MouseManager } from './managers/mouse-manager';
import { PanZoomManager } from './managers/pan-zoom-manager';
import { RenderManager } from './managers/render-manager';
import { WindowManager } from './managers/window-manager';
import { IDrawable } from './models/interfaces/idrawable';
import { ITickable } from './models/interfaces/itickable';
import { IUpdateable } from './models/interfaces/iupdateable';
import { HelperUtility } from './utilities/helper-utility';

export class CanvasWrapper {
    // game loop
    public loopDelta: number = 0;
    private previousTime: number = 0;
    private tickTimer: number = 0;
    private tickRate: number = 0.1;
    private totalTime: number = 0;

    // debug
    private fps: number = 0;
    private drawCalls: number = 0;
    private tickStartMarker = 'tickStart';
    private tickEndMarker = 'tickEnd';
    private tickMeasureName = 'tickMeasure';
    private drawStartMarker = 'drawStart';
    private drawEndMarker = 'drawEnd';
    private drawMeasureName = 'drawMeasure';

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
    private _updateables: IUpdateable[] = [];

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
        this.gameLoop();
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

    removeFromTick(tickable: ITickable): void {
        var index = this._tickables.indexOf(tickable);
        if (index) {
            this._tickables.splice(index, 1);
        }
    }

    addToUpdate(updateable: IUpdateable): void {
        this._updateables.push(updateable);
    }

    addToDraw(drawable: IDrawable): void {
        this._drawables.push(drawable);
    }

    removeFromDraw(drawable: IDrawable): void {
        var index = this._drawables.indexOf(drawable);
        if (index) {
            this._drawables.splice(index, 1);
        }
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

    private gameLoop() {
        const currentTime = performance.now();
        this.loopDelta = currentTime - this.previousTime;
        this.previousTime = currentTime;
        this.tickTimer += this.loopDelta;

        this.trackDebug();
        this.readInput();

        if (!this.paused || this.frameStep) {
            while (this.tickTimer >= this.tickRate) {
                this.tickPhysics();
                this.tickTimer -= this.tickRate;
                this.totalTime += this.tickRate;
            }

            this.updateScene();
            this.render();
            this.frameStep = false;
        }

        // update keyboard
        this._keyboardManager.update(); // TODO: Do we need this?

        // do it all again
        requestAnimationFrame(() => this.gameLoop());
    }

    private readInput(): void {
        this.checkKeys();
    }

    private tickPhysics(): void {
        performance.mark(this.tickStartMarker);
        this._tickables.forEach(tickable => {
            tickable.tick(this.tickRate);
        });
        performance.mark(this.tickEndMarker);
        performance.measure(this.tickMeasureName, this.tickStartMarker, this.tickEndMarker);
    }

    private updateScene(): void {
        this._updateables.forEach(updateable => {
            updateable.update(this.loopDelta);
        });
    }

    private render(): void {
        performance.mark(this.drawStartMarker);
        // TODO: create camera
        // TODO: apply camera positon

        // draw the grid first?
        // if (this._gridAsBackground) { this.drawGrid(); }

        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
        this.saveContext();

        this.drawCalls = 0;

        this._drawables.forEach(drawable => {
            // TODO: combine paths and draw once
            drawable.draw(this._context);
            this.drawCalls += 1;
        });

        this.trackMousePosition();

        // draw the grid last?
        // if (!this._gridAsBackground) {
        //     this.drawGrid();
        // }

        this.drawMouse();

        performance.mark(this.drawEndMarker);
        performance.measure(this.drawMeasureName, this.drawStartMarker, this.drawEndMarker)
        this.drawDebug();
        this.restoreContext();
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

    private drawDebug() {
        if (this._renderManager.debugEnabled) {
            var edgeOffset: number = 245;
            var valueOffset: number = edgeOffset / 1.9;
            var horzGap: number = 15;

            this._context.fillStyle = 'yellow';
            this._context.font = '14px courier new';

            const rightEdge = this._context.canvas.width;

            // runtime
            this._context.fillText('run time   : ', rightEdge - edgeOffset, horzGap);
            this._context.fillText(`${(this.totalTime / 1000).toFixed(2).toString()}`, rightEdge - valueOffset, horzGap);

            // tick timer
            this._context.fillText('tick timer : ', rightEdge - edgeOffset, horzGap * 2);
            this._context.fillText(`${(this.tickTimer / 1000).toFixed(2).toString()}`, rightEdge - valueOffset, horzGap * 2);

            // delta
            this._context.fillText('delta      : ', rightEdge - edgeOffset, horzGap * 3);
            this._context.fillText(`${this.loopDelta.toFixed(2).toString()}`, rightEdge - valueOffset, horzGap * 3);

            // drawables
            this._context.fillText('drawables  : ', rightEdge - edgeOffset, horzGap * 4);
            this._context.fillText(`${this._drawables.length.toString()}`, rightEdge - valueOffset, horzGap * 4);

            // draw calls
            this._context.fillText('draw calls : ', rightEdge - edgeOffset, horzGap * 5);
            this._context.fillText(`${this.drawCalls.toString()}`, rightEdge - valueOffset, horzGap * 5);

            // fps
            // this._context.fillText('fps        : ', rightEdge - edgeOffset, horzGap * 4);
            // this._context.fillText(this.fps.toString(), rightEdge - valueOffset, horzGap * 4);

            // mouse
            this._context.fillText('mouse      : ', rightEdge - edgeOffset, horzGap * 6);
            var mouseText: string = this._mouseManager.mousePosition ? `x: ${this.currentMouseData.mousePosition.x} y: ${this.currentMouseData.mousePosition.y}` : `unavailable`
            this._context.fillText(mouseText, rightEdge - valueOffset, horzGap * 6);

            // screen
            this._context.fillText('size       : ', rightEdge - edgeOffset, horzGap * 7);
            this._context.fillText(`w: ${this._context.canvas.width} h: ${this._context.canvas.height}`, rightEdge - valueOffset, horzGap * 7);

            // tick rate
            let tickMeasure = performance.getEntriesByType("measure").find(f => f.name == this.tickMeasureName);
            this._context.fillText('all ticks  : ', rightEdge - edgeOffset, horzGap * 8);
            this._context.fillText(`${tickMeasure ? tickMeasure.duration.toFixed(2) : ''}`, rightEdge - valueOffset, horzGap * 8);

            // draw rate
            let drawMeasure = performance.getEntriesByType("measure").find(f => f.name == this.drawMeasureName);
            this._context.fillText('all draws  : ', rightEdge - edgeOffset, horzGap * 9);
            this._context.fillText(`${drawMeasure ? drawMeasure.duration.toFixed(2) : ''}`, rightEdge - valueOffset, horzGap * 9);

            // // lag
            // this._context.fillText('lag        : ', rightEdge - edgeOffset, horzGap * 9);
            // this._context.fillText(`${this.lag.toFixed(2)}`, rightEdge - valueOffset, horzGap * 9);


            performance.clearMarks();
            performance.clearMeasures();
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
