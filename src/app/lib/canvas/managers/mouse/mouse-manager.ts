import { CanvasEvent } from '../../events/canvas-event';
import { Vector } from '../../objects/vector';
import { MouseData } from './mouse-data';

export class MouseManager {

    //#region private variables
    private _context: CanvasRenderingContext2D;
    private hasChanges: boolean = false;

    // mouse
    private mousePositionVector: Vector;
    private mouseOnCanvas: boolean = false;
    private clickLocation: Vector;
    private scrollingDirection: string = 'none';

    // mouse flags
    private leftMousePosition: string = 'up';
    private isMoving: boolean = false;

    //#endregion

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this.registerEvents();
    }

    private mouseEvent = new CanvasEvent<MouseData>();
    subscribe(callback: (e: MouseData) => void){
        this.mouseEvent.subscribe(callback);
    }

    private fireEvent() {
        let e = new MouseData();
        e.mousePosition = this.mousePositionVector;
        e.clickPosition = this.clickLocation;
        e.mouseOnCanvas = this.mouseOnCanvas;
        e.scrollDirection = this.scrollingDirection;
        e.leftMouseState = this.leftMousePosition;
        e.mouseMoving = this.isMoving;

        this.mouseEvent.fireEvent(e);
        this.reset();
    }

    private registerEvents() {
        const cv = this._context.canvas;

        // mouse events
        cv.onmousemove = (e: MouseEvent) => {
            this.updateMousePosition(e.clientX, e.clientY);
        };

        cv.onmousedown = (e: MouseEvent) => {
            this.doMouseDown(e.clientX, e.clientY);
        };

        cv.onmouseup = (e: MouseEvent) => {
            this.mouseStop();
        };

        cv.onmousewheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                this.mouseScrollDown();
            }
            else {
                this.mouseScrollUp();
            }
        };

        cv.onmouseout = (e: MouseEvent) => {
            this.mouseStop();
        };

        cv.onmouseleave = (e: MouseEvent) => {
            this.mouseStop();
        };

    }

    private doMouseDown(x: number, y: number) {
        this.leftMousePosition = 'down';
        this.clickLocation = new Vector(x, y);

        this.fireEvent();
    }

    private updateMousePosition(x: number, y: number) {
        this.isMoving = true;
        this.mousePositionVector = new Vector(x, y);
        this.mouseOnCanvas = true;

        this.fireEvent();
    }

    private mouseStop() {
        this.isMoving = false;
        this.leftMousePosition = 'up';
        this.clickLocation = undefined;
        this.mouseOnCanvas = false;

        this.fireEvent();
    }

    private mouseScrollUp() {
        this.scrollingDirection = 'up';

        this.fireEvent();
    }

    private mouseScrollDown() {
        this.scrollingDirection = 'down';

        this.fireEvent();
    }

    private reset() {
        this.hasChanges = false;
        this.mousePositionVector = undefined;
        this.mouseOnCanvas = false;
        this.clickLocation = undefined;
        this.scrollingDirection = 'none';
        this.leftMousePosition = 'up';
        this.isMoving = false;
    }

}
