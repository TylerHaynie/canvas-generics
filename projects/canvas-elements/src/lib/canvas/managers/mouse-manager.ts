import { MOUSE_EVENT_TYPE } from '../events/canvas-enums';
import { CanvasEvent } from '../events/canvas-event';
import { MouseData } from '../events/event-data';
import { Vector2D } from '../objects/vector';

export class MouseManager {
    public get mouseOnCanvas(): boolean { return this._mouseOnCanvas; }
    public get mousePosition(): Vector2D { return this._mousePosition; }

    private _context: CanvasRenderingContext2D;

    private _mousePosition: Vector2D;
    private _translatedPosition: Vector2D;
    private _mouseOnCanvas: boolean = false;
    private _scrollingDirection: string = 'none';
    private _primaryMousePosition: string = 'up';
    private _isMoving: boolean = false;

    private _currentEvent: MOUSE_EVENT_TYPE;
    private _mouseEvents = new CanvasEvent<MouseData>();
    on(on: MOUSE_EVENT_TYPE, callback: (e: MouseData) => void) {
        this._mouseEvents.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this.registerEvents();
    }

    private registerEvents() {
        const cv = this._context.canvas;

        // TODO: Once browser is updated to support
        // This removes mouse acceleration and give access to raw input.
        // this._context.canvas.requestPointerLock({
        //     unadjustedMovement: true
        // });

        // this forces you to use 'movementX' and 'movementY' instead of 'offsetX' and 'offsetY'
        // this._context.canvas.requestPointerLock();

        cv.onmousemove = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.MOVE;
            this.updateMousePosition(e.offsetX, e.offsetY);
            // this.updateMousePosition(this._mousePosition.x + e.movementX, this._mousePosition.y + e.movementY);
        };

        cv.onmousedown = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.DOWN;
            this.mouseDown(e.offsetX, e.offsetY);
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
