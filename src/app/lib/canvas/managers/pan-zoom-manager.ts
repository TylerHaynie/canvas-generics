import { MouseManager } from './mouse-manager';
import { Vector } from '../objects/vector';

export class PanZoomManager {

    // Public Properties
    public get isDirty() { return this.hasChanges; }

    public set scalingAllowed(v) { this.allowScaling = v; }
    public set minScale(v) { this.minimumScale = v; }
    public set maxScale(v) { this.maximumScale = v; }
    public set scaleStep(v) { this.canvasScaleStep = v; }
    public get scale() { return this.canvasScale; }

    public set panningAllowed(v) { this.allowPanning = v; }
    public set panSpeed(v) {
        if (v <= this.minimumPanSpeed) { this.panModifier = this.minimumPanSpeed; }
        else if (v > this.maximumPanSpeed) { this.panModifier = this.maximumPanSpeed; }
        else { this.panModifier = v; }
    }
    public get pannedAmount() { return this.totalPanning; }


    private context: CanvasRenderingContext2D;
    private mouseManager: MouseManager;
    private hasChanges: boolean = false;

    // canvas
    private canvasScaleStep: number = .10;
    private canvasScale: number = 1;

    // panning
    private minimumPanSpeed: number = 0;
    private maximumPanSpeed: number = 2;
    private allowPanning: boolean = true;
    private pannableModifier: number = 1;
    private panOffset: Vector;
    private isPanning = false;
    private panStartPosition: Vector;
    private totalPanning: Vector = <Vector>{ x: 0, y: 0 };
    private panModifier: number = 1;

    // scaling
    private allowScaling: boolean = true;
    private maximumScale: number = 0;
    private minimumScale: number = 0;

    // touch input
    private pinchMoveStart: number = 0;
    private pinchMoveEnd: number = 0;
    private isPinching: boolean = false;
    private pinchScale: number = 50;

    constructor(context: CanvasRenderingContext2D, mouseManager: MouseManager) {
        this.context = context;
        this.mouseManager = mouseManager;

        this.resetView();
        this.registerEvents();
    }

    zoomIn() {
        this.scaleUp(this.canvasScaleStep);
    }

    zoomOut() {
        this.scaleDown(this.canvasScaleStep);
    }

    update() {
        // has mouse changed at all
        // if (this.mouseManager.isDirty) {

        // was the mouse pressed?
        if (this.mouseManager.leftMouseState === 'down' && !this.isPanning) {
            this.panStart(this.mouseManager.mousePosition);
        }

        // did the mouse move?
        if (this.mouseManager.isMoving) {
            this.panChange(this.mouseManager.mousePosition);
        }

        // zooming?
        if (this.mouseManager.scrollDirection !== 'none') {
            switch (this.mouseManager.scrollDirection) {
                case 'up':
                    this.zoomIn();
                    break;
                case 'down':
                    this.zoomOut();
                    break;
            }
        }

        if (this.mouseManager.leftMouseState === 'up') {
            this.panStop();
        }
        // }
    }

    private registerEvents() {
        const cv = this.context.canvas;

        // touch events
        // cv.addEventListener('touchstart', (e) => {
        //     this.touchStart(e);
        // }, false);

        // cv.addEventListener('touchend', (e) => {
        //     this.vectorerStop();
        // }, false);

        // cv.addEventListener('touchmove', (e) => {
        //     this.touchMove(e);
        // }, false);

        // cv.addEventListener('touchcancel', (e) => {
        //     this.vectorerStop();
        // }, false);

    }

    //#region Touch Events

    // private touchStart(e: TouchEvent) {
    //     e.preventDefault();

    //     if (e.changedTouches.length === 1) {
    //         this.panStop(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    //     }
    // }

    // private touchMove(e: TouchEvent) {
    //     // single touch
    //     if (e.changedTouches.length === 1) {
    //         if ((e.changedTouches[0].clientX < 0 || e.changedTouches[0].clientY < 0) ||
    //             (e.changedTouches[0].clientX > this.context.canvas.width || e.changedTouches[0].clientY > this.context.canvas.height)) {
    //             this.vectorerStop();
    //         }
    //         else {
    //             this.vectorerMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    //         }
    //     }
    //     // gesture
    //     else if (e.touches.length > 1) {
    //         this.isPinching = true;
    //         let pinchGap = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY) / 100;

    //         if (this.pinchMoveStart === 0) {
    //             this.pinchMoveStart = pinchGap;
    //         }

    //         this.pinchMoveEnd = pinchGap;
    //     }
    // }

    // private touchEnd(e: TouchEvent) {
    //     if (e.changedTouches.length === 1) {
    //         this.vectorerStop();
    //     }
    // }

    //#endregion

    //#region Input logic

    private panStart(vector: Vector) {
        this.panStartPosition = new Vector(vector.x - this.panOffset.x, vector.y - this.panOffset.y);

        this.isPanning = true;
    }

    private panChange(vector: Vector) {
        // are we panning?
        if (this.isPanning && this.allowPanning) {
            // movement delta
            let dx = (this.mouseManager.mousePosition.x - this.panStartPosition.x) * this.panModifier;
            let dy = (this.mouseManager.mousePosition.y - this.panStartPosition.y) * this.panModifier;

            // update panstart
            this.panStartPosition.x = this.mouseManager.mousePosition.x;
            this.panStartPosition.y = this.mouseManager.mousePosition.y;

            // total pan amount
            this.totalPanning.x += dx;
            this.totalPanning.y += dy;

            this.hasChanges = true;
        }
    }

    private panStop() {
        if (this.isPinching && this.allowScaling) {
            let pinchDifference = (Math.max(this.pinchMoveStart, this.pinchMoveEnd) - Math.min(this.pinchMoveStart, this.pinchMoveEnd)) / this.pinchScale;

            if (this.pinchMoveEnd > this.pinchMoveStart) {
                // zooming in
                // this.canvasScale += pinchDifference;
                this.scaleUp(pinchDifference);
            }
            else if (this.pinchMoveEnd < this.pinchMoveStart) {
                // zooming Out
                // this.canvasScale -= pinchDifference;
                this.scaleDown(pinchDifference);
            }

            this.pinchMoveStart = 0;
            this.pinchMoveEnd = 0;
            this.hasChanges = true;

            this.isPinching = false;
        }

        this.isPanning = false;
    }

    //#endregion

    private scaleUp(amount: number) {
        let newScale: number = this.canvasScale + amount;

        if (this.maximumScale === 0) {
            this.canvasScale = newScale;
        }
        else {
            if (newScale > this.maximumScale) {
                this.canvasScale = this.maximumScale;
            }
            else {
                this.canvasScale = newScale;
            }
        }

        this.hasChanges = true;
    }

    private scaleDown(amount: number) {
        let newScale: number = this.canvasScale - amount;

        if (this.minimumScale === 0) {
            this.canvasScale = newScale;
        }
        else {
            if (newScale < this.minimumScale) {
                this.canvasScale = this.minimumScale;
            }
            else {
                this.canvasScale = newScale;
            }
        }

        this.hasChanges = true;
    }

    private resetView() {
        this.panOffset = <Vector>{ x: 0, y: 0 };
        this.totalPanning = <Vector>{ x: 0, y: 0 };

        this.canvasScale = 1;
        this.hasChanges = true;
    }
}
