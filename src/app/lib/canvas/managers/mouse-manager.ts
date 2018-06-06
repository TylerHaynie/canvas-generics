import { PanZoomData, MouseData } from '@canvas/events/event-data';
import { Vector } from '@canvas/objects/vector';
import { MouseEventType } from '@canvas/events/canvas-event-types';
import { CanvasEvent } from '@canvas/events/canvas-event';

export class MouseManager {

    //#region private variables
    private _context: CanvasRenderingContext2D;
    private contextModified: boolean = false;
    private contextData: PanZoomData;

    // mouse
    private mousePosition: Vector;
    private translatedPosition: Vector;
    private mouseOnCanvas: boolean = false;
    private scrollingDirection: string = 'none';
    private leftMousePosition: string = 'up';
    private isMoving: boolean = false;

    //#endregion

    // event
    private eventType: MouseEventType;
    private mouseEvent = new CanvasEvent<MouseData>();
    on(on: MouseEventType, callback: (e: MouseData) => void) {
        this.mouseEvent.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this.registerEvents();
    }

    contextupdated(data: PanZoomData) {
        if (this.mouseOnCanvas) {
            let mx = (this.mousePosition.x - data.pan.x) / data.scale;
            let my = (this.mousePosition.y - data.pan.y) / data.scale;

            this.translatedPosition = new Vector(mx, my);
        }
    }

    private fireEvent() {
        let e = new MouseData();
        e.eventType = this.eventType;
        e.translatedPosition = this.translatedPosition;
        e.mousePosition = this.mousePosition;
        e.mouseOnCanvas = this.mouseOnCanvas;
        e.scrollDirection = this.scrollingDirection;
        e.leftMouseState = this.leftMousePosition;
        e.mouseMoving = this.isMoving;

        this.mouseEvent.fireEvent(e.eventType, e);
    }

    private registerEvents() {
        const cv = this._context.canvas;

        // mouse events
        cv.onmousemove = (e: MouseEvent) => {
            this.eventType = MouseEventType.MOVE;
            this.updateMousePosition(e.clientX, e.clientY);
        };

        cv.onmousedown = (e: MouseEvent) => {
            this.eventType = MouseEventType.DOWN;
            this.doMouseDown(e.clientX, e.clientY);
        };

        cv.onmouseup = (e: MouseEvent) => {
            this.eventType = MouseEventType.UP;
            this.mouseUp();
        };

        cv.onmousewheel = (e: WheelEvent) => {
            this.eventType = MouseEventType.WHEEL;
            if (e.deltaY > 0) {
                this.mouseScrollDown();
            }
            else {
                this.mouseScrollUp();
            }
        };

        cv.onmouseout = (e: MouseEvent) => {
            this.eventType = MouseEventType.OUT;
            this.mouseLeave();
        };

        cv.onmouseleave = (e: MouseEvent) => {
            this.eventType = MouseEventType.OUT;
            this.mouseLeave();
        };

    }

    private doMouseDown(x: number, y: number) {
        this.mouseOnCanvas = true;
        this.leftMousePosition = 'down';
        this.mousePosition = new Vector(x, y);

        this.fireEvent();
    }

    private updateMousePosition(x: number, y: number) {
        this.isMoving = true;
        this.mousePosition = new Vector(x, y);
        this.mouseOnCanvas = true;

        this.fireEvent();
    }

    private mouseUp() {
        this.leftMousePosition = 'up';
        this.fireEvent();
    }

    private mouseLeave() {
        this.mouseOnCanvas = false;
        this.mousePosition = undefined;

        this.fireEvent();
    }

    private mouseScrollUp() {
        this.mouseOnCanvas = true;
        this.scrollingDirection = 'up';

        this.fireEvent();
    }

    private mouseScrollDown() {
        this.mouseOnCanvas = true;
        this.scrollingDirection = 'down';

        this.fireEvent();
    }
}
