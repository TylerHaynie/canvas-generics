import { MouseManager } from '../mouse/mouse-manager';
import { Vector } from '../../objects/vector';
import { PanZoomData } from './pan-zoom-data';
import { CanvasEvent } from '../../events/canvas-event';
import { MouseData } from '../mouse/mouse-data';
import { MouseEventType } from '../mouse/event-types';

export class PanZoomManager {

    //#region Public Properties
    public set scalingAllowed(v) { this.allowScaling = v; }
    public set minScale(v) { this.minimumScale = v; }
    public set maxScale(v) { this.maximumScale = v; }
    public set scaleStep(v) { this.canvasScaleStep = v; }
    public set panningAllowed(v) { this.allowPanning = v; }
    public set panSpeed(v) {
        if (v <= this.minimumPanSpeed) { this.panModifier = this.minimumPanSpeed; }
        else if (v > this.maximumPanSpeed) { this.panModifier = this.maximumPanSpeed; }
        else { this.panModifier = v; }
    }

    //#endregion

    //#region Private Properties

    private context: CanvasRenderingContext2D;
    private mouseManager: MouseManager;

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
    private totalPanning: Vector = new Vector(0, 0);
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

    //#endregion

    //#region events

    private panZoomEvent = new CanvasEvent<PanZoomData>();
    subscribe(callback: (e: PanZoomData) => void) {
        this.panZoomEvent.subscribe(callback);
    }

    //#endregion

    constructor(context: CanvasRenderingContext2D, mouseManager: MouseManager) {
        this.context = context;
        this.mouseManager = mouseManager;

        this.mouseManager.subscribe((e) => {
            this.mouseEvent(e);
        });

        this.resetView();
        this.registerEvents();
    }

    private mouseEvent(e: MouseData) {
        switch (e.eventType) {
            case MouseEventType.DOWN:
                if (!this.isPanning) {
                    this.mouseDown(e.mousePosition);
                }
                break;
            case MouseEventType.MOVE:
                this.mouseMove(e.mousePosition);
                break;
            case MouseEventType.WHEEL:
                switch (e.scrollDirection) {
                    case 'up':
                        this.zoomIn();
                        break;
                    case 'down':
                        this.zoomOut();
                        break;
                }
                break;
            case MouseEventType.UP:
                this.mouseStop();
                break;
        }
    }

    zoomIn() {
        this.scaleUp(this.canvasScaleStep);
    }

    zoomOut() {
        this.scaleDown(this.canvasScaleStep);
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

    private fireEvent() {
        let data = new PanZoomData();
        data.scale = this.canvasScale;
        data.pan = this.totalPanning;
        this.panZoomEvent.fireEvent(data);
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

    private mouseDown(mousePosition: Vector) {
        this.panStartPosition = new Vector(mousePosition.x - this.panOffset.x, mousePosition.y - this.panOffset.y);

        this.isPanning = true;
        console.log('pan Start');
    }

    private mouseMove(mousePosition: Vector) {
        this.pan(mousePosition);
    }

    private mouseStop() {
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

            this.isPinching = false;
        }

        this.isPanning = false;
    }

    //#endregion

    private pan(mousePosition: Vector) {
        // are we panning?
        if (this.isPanning && this.allowPanning) {
            // movement delta
            let dx = (mousePosition.x - this.panStartPosition.x) * this.panModifier;
            let dy = (mousePosition.y - this.panStartPosition.y) * this.panModifier;

            // update panstart
            this.panStartPosition.x = mousePosition.x;
            this.panStartPosition.y = mousePosition.y;

            // total pan amount
            this.totalPanning.x += dx;
            this.totalPanning.y += dy;

            console.log('pan changed');
            this.fireEvent();
        }
    }

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

        console.log('Scale Up');
        this.fireEvent();
    }

    private scaleDown(amount: number) {
        if (this.allowScaling) {
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

            console.log('Scale Down');
            this.fireEvent();
        }
    }

    private resetView() {
        this.panOffset = <Vector>{ x: 0, y: 0 };
        this.totalPanning = <Vector>{ x: 0, y: 0 };

        this.canvasScale = 1;
        this.fireEvent();
    }
}
