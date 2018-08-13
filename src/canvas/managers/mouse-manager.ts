import { PanZoomData, MouseData } from 'canvas/events/event-data';
import { Vector2D } from 'canvas/objects/vector';
import { MOUSE_EVENT_TYPE } from 'canvas/events/canvas-event-types';
import { CanvasEvent } from 'canvas/events/canvas-event';

export class MouseManager {

    public get mouseOnCanvas(): boolean { return this._mouseOnCanvas; }

    //#region private variables
    private _context: CanvasRenderingContext2D;
    private contextModified: boolean = false;
    private contextData: PanZoomData;

    // mouse
    private mousePosition: Vector2D;
    private translatedPosition: Vector2D;
    private _mouseOnCanvas: boolean = false;
    private scrollingDirection: string = 'none';
    private leftMousePosition: string = 'up';
    private isMoving: boolean = false;

    //#endregion

    // event
    private eventType: MOUSE_EVENT_TYPE;
    private mouseEvent = new CanvasEvent<MouseData>();
    on(on: MOUSE_EVENT_TYPE, callback: (e: MouseData) => void) {
        this.mouseEvent.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this.registerEvents();
    }

    contextupdated(data: PanZoomData) {
        if (this._mouseOnCanvas) {
            let mx = (this.mousePosition.x - data.pan.x) / data.scale;
            let my = (this.mousePosition.y - data.pan.y) / data.scale;

            this.translatedPosition = new Vector2D(mx, my);
        }
    }

    private fireEvent() {
        let e = new MouseData();
        e.eventType = this.eventType;
        e.translatedPosition = this.translatedPosition;
        e.mousePosition = this.mousePosition;
        e.mouseOnCanvas = this._mouseOnCanvas;
        e.scrollDirection = this.scrollingDirection;
        e.leftMouseState = this.leftMousePosition;
        e.mouseMoving = this.isMoving;

        this.mouseEvent.fireEvent(e.eventType, e);
    }

    private registerEvents() {
        const cv = this._context.canvas;

        // mouse events
        cv.onmousemove = (e: MouseEvent) => {
            this.eventType = MOUSE_EVENT_TYPE.MOVE;
            this.updateMousePosition(e.offsetX, e.offsetY);
        };

        cv.onmousedown = (e: MouseEvent) => {
            this.eventType = MOUSE_EVENT_TYPE.DOWN;
            this.doMouseDown(e.offsetX, e.offsetY);
        };

        cv.onmouseup = (e: MouseEvent) => {
            this.eventType = MOUSE_EVENT_TYPE.UP;
            this.mouseUp();
        };

        cv.onmousewheel = (e: WheelEvent) => {
            this.eventType = MOUSE_EVENT_TYPE.WHEEL;
            if (e.deltaY > 0) {
                this.mouseScrollDown();
            }
            else {
                this.mouseScrollUp();
            }
        };

        cv.onmouseout = (e: MouseEvent) => {
            this.eventType = MOUSE_EVENT_TYPE.OUT;
            this.mouseLeave();
        };

        cv.onmouseleave = (e: MouseEvent) => {
            this.eventType = MOUSE_EVENT_TYPE.OUT;
            this.mouseLeave();
        };

    }

    private doMouseDown(x: number, y: number) {
        this._mouseOnCanvas = true;
        this.leftMousePosition = 'down';
        this.mousePosition = new Vector2D(x, y);

        this.fireEvent();
    }

    private updateMousePosition(x: number, y: number) {
        this.isMoving = true;
        this.mousePosition = new Vector2D(x, y);
        this._mouseOnCanvas = true;

        this.fireEvent();
    }

    private mouseUp() {
        this.leftMousePosition = 'up';
        this.fireEvent();
    }

    private mouseLeave() {
        this._mouseOnCanvas = false;
        this.mousePosition = undefined;

        this.fireEvent();
    }

    private mouseScrollUp() {
        this._mouseOnCanvas = true;
        this.scrollingDirection = 'up';

        this.fireEvent();
    }

    private mouseScrollDown() {
        this._mouseOnCanvas = true;
        this.scrollingDirection = 'down';

        this.fireEvent();
    }
}
