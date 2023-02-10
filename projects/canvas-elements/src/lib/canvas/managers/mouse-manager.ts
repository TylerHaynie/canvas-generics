import { MOUSE_EVENT_TYPE } from '../events/canvas-enums';
import { CanvasEvent } from '../events/canvas-event';
import { MouseData } from '../events/event-data';
import { Vertex } from '../objects/vertex';

export class MouseManager {
    public get mouseOnCanvas(): boolean { return this._mouseOnCanvas; }
    public get mousePosition(): Vertex { return this._mousePosition; }

    private element: HTMLElement;

    private _mousePosition: Vertex;
    private _translatedPosition: Vertex;
    private _mouseOnCanvas: boolean = false;
    private _scrollingDirection: string = 'none';
    private _primaryMousePosition: string = 'up';
    private _isMoving: boolean = false;

    private _currentEvent: MOUSE_EVENT_TYPE;
    private _mouseEvents = new CanvasEvent<MouseData>();
    on(on: MOUSE_EVENT_TYPE, callback: (e: MouseData) => void) {
        this._mouseEvents.subscribe(on, callback);
    }

    constructor(e: HTMLElement) {
        this.element = e;
        this.registerEvents();
    }

    private registerEvents() {
        // TODO: Once browser is updated to support
        // This removes mouse acceleration and give access to raw input.
        // this._context.canvas.requestPointerLock({
        //     unadjustedMovement: true
        // });

        // this forces you to use 'movementX' and 'movementY' instead of 'offsetX' and 'offsetY'
        // this._context.canvas.requestPointerLock();
        // https://mdn.github.io/dom-examples/pointer-lock/

        this.element.onmousemove = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.MOVE;
            this.updateMousePosition(e.offsetX, e.offsetY);
            // this.updateMousePosition(this._mousePosition.x + e.movementX, this._mousePosition.y + e.movementY);
        };

        this.element.onmousedown = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.DOWN;
            this.mouseDown(e.offsetX, e.offsetY);
        };

        this.element.onmouseup = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.UP;
            this.mouseUp();
        };

        this.element.onwheel = (e: WheelEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.WHEEL;
            if (e.deltaY > 0)
                this.mouseScrollDown();
            else
                this.mouseScrollUp();
        };

        this.element.onmouseout = (e: MouseEvent) => {
            this._currentEvent = MOUSE_EVENT_TYPE.OUT;
            this.mouseLeave();
        };

        this.element.onmouseleave = (e: MouseEvent) => {
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
        this._mousePosition ? this._mousePosition.set(x, y, 0) : this._mousePosition = new Vertex(x, y, 0);
    }
}
