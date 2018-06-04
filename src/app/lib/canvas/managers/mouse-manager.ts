import { Vector } from '../objects/vector';
export class MouseManager {

    //#region Public Properties

    public get isDirty() { return this.hasChanges; }
    public get mousePosition(): Vector { return this.mousePositionVector; }
    public get clickPosition(): Vector { return this.clickLocation; }
    public get mouseOffCanvas() { return this.mouseOff; }
    public get scrollDirection() { return this.scrollingDirection; }
    public get leftMouseState() { return this.leftMousePosition; }
    public get mouseMoving() { return this.isMoving; }

    //#endregion

    //#region private variables
    private _context: CanvasRenderingContext2D;
    private hasChanges: boolean = false;

    // mouse
    private mousePositionVector: Vector;
    private mouseOff: boolean = true;
    private clickLocation: Vector;
    private scrollingDirection: string = 'none';

    // mouse flags
    private leftMousePosition: string = 'up';
    isMoving: boolean = false;

    //#endregion

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this.registerEvents();
    }

    update() {
        if (this.hasChanges) {
            this.hasChanges = false;
            this.reset();
        }
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

        this.hasChanges = true;
    }

    private updateMousePosition(x: number, y: number) {
        this.isMoving = true;
        this.mousePositionVector = new Vector(x, y);
        this.mouseOff = false;

        this.hasChanges = true;
    }

    private mouseStop() {
        this.isMoving = false;
        this.leftMousePosition = 'up';
        this.clickLocation = undefined;
        this.mouseOff = true;

        this.hasChanges = true;
    }

    private mouseScrollUp() {
        this.scrollingDirection = 'up';

        this.hasChanges = true;
    }

    private mouseScrollDown() {
        this.scrollingDirection = 'down';

        this.hasChanges = true;
    }

    private reset() {
        this.scrollingDirection = 'none';
    }

}
