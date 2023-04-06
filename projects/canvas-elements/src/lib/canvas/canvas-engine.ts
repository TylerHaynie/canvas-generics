import { ENGINE_EVENT_TYPE } from './engine/events/canvas-enums';
import { CanvasEvent } from './engine/events/canvas-event';
import { EngineEventData } from './engine/events/event-data';
import { KeyboardManager } from './engine/managers/keyboard-manager';
import { MouseManager } from './engine/managers/mouse-manager';
import { RenderManager } from './engine/managers/render-manager';
import { WindowManager } from './engine/managers/window-manager';
import { ArrayUtility } from './engine/utilities/array-utility';
import { ICanvasComponent } from './engine/interfaces/canvas-component';
import { ICanvasSystem } from "./engine/interfaces/canvas-system";
import { GamepadManager } from './engine/managers/gamepad-manager';

export class CanvasEngine {
    // canvas
    private _canvas: HTMLCanvasElement;
    public get canvasWidth() { return this._canvas.width; }
    public get canvasHeight() { return this._canvas.height; }

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

    // control
    private _pauseKey: string[] = ['Escape'];
    private _frameForwardKeys: string[] = ['>', '.'];
    private paused = false;
    private frameStep: boolean = false;

    // managers
    private _mouseManager: MouseManager;
    private _renderManager: RenderManager;
    private _keyboardManager: KeyboardManager;
    private _gamepadManager: GamepadManager;
    private _windowManager: WindowManager;

    // canvas components
    private _components: ICanvasComponent[] = [];
    private _systems: ICanvasSystem[] = [];

    // engine events
    private _engineEvent = new CanvasEvent<EngineEventData>();
    on(on: ENGINE_EVENT_TYPE, callback: (e: EngineEventData) => void) {
        this._engineEvent.subscribe(on, callback);
    }

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.setup();
    }

    public setup() {
        this.setupManagers();
        this.setupCanvas();
    }

    public registerComponents(components: ICanvasComponent[]) {
        this._components.push(...components);
    }

    public registerSystems(systems: ICanvasSystem[]) {
        // TODO: Check for existing system of same type
        this._systems.push(...systems);
    }

    public findComponent(componentName) {
        return ArrayUtility.findTypeInArray(componentName, this._components);
    }

    public findSystem(systemName) {
        return ArrayUtility.findTypeInArray(systemName, this._systems);
    }

    public async start() {
        this._windowManager.fit();
        this._windowManager.setCursorStyle('default');

        // register systems
        await this.fireSystemRegistration();
        this.canvasSystemStartup();

        // register components
        await this.fireComponentRegistration();
        this.canvasComponentStartup();

        // start render loop
        this.gameLoop();
    }

    private async fireSystemRegistration() {
        let event = new EngineEventData();
        event.eventType = ENGINE_EVENT_TYPE.REGISTER_SYSTEMS;
        event.engine = this;

        await this._engineEvent.fireEvent(event.eventType, event);
    }

    private async fireComponentRegistration() {
        let event = new EngineEventData();
        event.eventType = ENGINE_EVENT_TYPE.REGISTER_COMPONENTS;
        event.engine = this;

        await this._engineEvent.fireEvent(event.eventType, event);
    }

    private canvasSystemStartup() {
        for (const system of this._systems) {
            system.startup(this);
        }
    }

    private canvasComponentStartup() {
        for (const component of this._components) {
            component.startup(this);
        }
    }

    private setupManagers() {
        // window
        this._windowManager = new WindowManager(this._canvas);

        // mouse
        this._mouseManager = new MouseManager(this._canvas);

        // keyboard
        this._keyboardManager = new KeyboardManager(this._canvas);

        // gamepads
        this._gamepadManager = new GamepadManager();

        // rendering
        this._renderManager = new RenderManager(this._canvas);
    }

    private setupCanvas() {
        this._canvas.tabIndex = 1000;           // canvas needs a tabindex so we can listen for keyboard events
        this._canvas.style.outline = 'none';    // removing the focus outline
    }

    private gameLoop() {
        const currentTime = performance.now();
        this.loopDelta = currentTime - this.previousTime;
        this.previousTime = currentTime;

        // this.fpsTick += this.loopDelta;
        // if (this.fpsTick >= 1000) {
        //     this.fps = this.frameCount;
        //     this.fpsTick = 0;
        //     this.frameCount = 0;
        // }

        // systems always tick
        this._systems.forEach(component => {
            component.tick(this.loopDelta);
        });

        if (!this.paused || this.frameStep) {
            this.runTime += this.loopDelta;

            // tick components
            this._components.forEach(component => {
                component.tick(this.loopDelta);
            });

            // TODO: tick at 30, 60, 90, 120, 144, etc.
            this.render();

            this.frameStep = false;
        }

        // this.frameCount += 1;
        requestAnimationFrame(() => this.gameLoop());
    }

    private render(): void {
        performance.mark(this.drawStartMarker);

        this.renderManager.renderPolygons();

        performance.mark(this.drawEndMarker);
        performance.measure(this.drawMeasureName, this.drawStartMarker, this.drawEndMarker)
    }
}
