import { MOUSE_EVENT_TYPE } from '../events/canvas-enums';
import { CanvasEvent } from '../events/canvas-event';
import { MouseData } from '../events/event-data';
import { Vector2D } from '../objects/vector';

export class MouseManager {
    public get mouseOnCanvas(): boolean { return this._mouseOnCanvas; }
    public get mousePosition(): Vector2D { return this._mousePosition; }

    //#region private variables
    private _context: CanvasRenderingContext2D;

    // mouse
    private _mousePosition: Vector2D;
    private _translatedPosition: Vector2D;
    private _mouseOnCanvas: boolean = false;
    private _scrollingDirection: string = 'none';
    private _primaryMousePosition: string = 'up';
    private _isMoving: boolean = false;

    //#endregion

    // event
    private _currentEvent: MOUSE_EVENT_TYPE;
    private _mouseEvents = new CanvasEvent<MouseData>();
    on(on: MOUSE_EVENT_TYPE, callback: (e: MouseData) => void) {
        this._mouseEvents.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this.registerEvents();
    }

    // contextupdated(data: PanZoomData) {
    //     if (this._mouseOnCanvas) {
    //         let mx = (this.mousePosition.x - data.pan.x) / data.scale;
    //         let my = (this.mousePosition.y - data.pan.y) / data.scale;

    //         this.translatedPosition = new Vector2D(mx, my);
    //     }
    // }

    // TODO: update location based on camera position
    // ... updateOrigin(camPosX, camPosY) or something like that
    // ... or have a method in camera that will return mouse position based on camera location

    private registerEvents() {
        const cv = this._context.canvas;

        // mouse events
        cv.onmousemove = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.MOVE;
            this.updateMousePosition(e.clientX, e.clientY);
        };

        cv.onmousedown = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.DOWN;
            this.mouseDown(e.clientX, e.clientY);
        };

        cv.onmouseup = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.UP;
            this.mouseUp();
        };

        cv.onwheel = (e: WheelEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.WHEEL;
            if (e.deltaY > 0) {
                this.mouseScrollDown();
            }
            else {
                this.mouseScrollUp();
            }
        };

        cv.onmouseout = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.OUT;
            this.mouseLeave();
        };

        cv.onmouseleave = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.OUT;
            this.mouseLeave();
        };
    }

    private fireEvent() {
        let e = new MouseData();
        e.eventType = this._currentEvent;
        e.translatedPosition = this._translatedPosition;
        e.mousePosition = this._mousePosition;
        e.mouseOnCanvas = this._mouseOnCanvas;
        e.scrollDirection = this._scrollingDirection;
        e.primaryMouseState = this._primaryMousePosition;
        e.mouseMoving = this._isMoving;

        this._mouseEvents.fireEvent(e.eventType, e);
    }

    private mouseDown(x: number, y: number) {
        this._mouseOnCanvas = true;
        this._primaryMousePosition = 'down';
        this.setMousePosition(x, y);

        this.fireEvent();
    }

    private updateMousePosition(x: number, y: number) {
        this._isMoving = true;
        this.setMousePosition(x, y);
        this._mouseOnCanvas = true;

        this.fireEvent();
    }

    private mouseUp() {
        this._primaryMousePosition = 'up';
        this.fireEvent();
    }

    private mouseLeave() {
        this._mouseOnCanvas = false;
        this._mousePosition = undefined;

        this.fireEvent();
    }

    private mouseScrollUp() {
        this._mouseOnCanvas = true;
        this._scrollingDirection = 'up';

        this.fireEvent();
    }

    private mouseScrollDown() {
        this._mouseOnCanvas = true;
        this._scrollingDirection = 'down';

        this.fireEvent();
    }

    private setMousePosition(x: number, y: number): void {
        this._mousePosition ? this._mousePosition.set(x, y) : this._mousePosition = new Vector2D(x, y);
    }
}
