import { MouseManager } from './mouse-manager';

export class PanZoomManager {
    private context: CanvasRenderingContext2D;
    private mouseManager: MouseManager;

    private hasChanges: boolean = false;
    public get isDirty() { return this.hasChanges; }

    // canvas
    private canvasScaleStep: number = .10;
    public set scaleStep(v) { this.canvasScaleStep = v; }
    private canvasScale: number = 1;
    public get scale() { return this.canvasScale; }

    // panning
    private allowPanning: boolean = true;
    private pannableModifier: number = 1;
    public set panningAllowed(v) { this.allowPanning = v; }
    private panOffsetX: number = 0;
    private panOffsetY: number = 0;
    private isPanning = false;
    private panStartX: number;
    private panStartY: number;
    private totalPanningX: number = 0;
    public get panX() { return this.totalPanningX; }
    private totalPanningY: number = 0;
    public get panY() { return this.totalPanningY; }
    private panModifier: number = 1;
    public set panSpeed(v) {
        if (v <= 0) { this.panModifier = 1; }
        else if (v > 2) { this.panModifier = 2; }
        else { this.panModifier = v; }
    }

    // scaling
    private allowScaling: boolean = true;
    public set scalingAllowed(v) { this.allowScaling = v; }
    private maximumScale: number = 0;
    public set maxScale(v) { this.maximumScale = v; }
    private minimumScale: number = 0;
    public set minScale(v) { this.minimumScale = v; }

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
            this.panStart(this.mouseManager.mouseX, this.mouseManager.mouseY);
        }

        // did the mouse move?
        if (this.mouseManager.isMoving) {
            this.panChange(this.mouseManager.mouseX, this.mouseManager.mouseY);
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

        // // mouse events
        // cv.onmousemove = (e) => {
        //     this.pointerMove(e.clientX, e.clientY);
        // };

        // cv.onmousedown = (e) => {
        //     this.pointerDown(e.clientX, e.clientY);
        // };

        // cv.onmouseup = (e) => {
        //     this.pointerStop();
        // };

        // cv.onmousewheel = (e) => {
        //     if (e.deltaY > 0) {
        //         this.zoomOut();
        //     }
        //     else {
        //         this.zoomIn();
        //     }
        // };

        // cv.onmouseout = (e) => {
        //     this.pointerStop();
        // };

        // cv.onmouseleave = (e) => {
        //     this.pointerStop();
        // };

        // touch events
        // cv.addEventListener('touchstart', (e) => {
        //     this.touchStart(e);
        // }, false);

        // cv.addEventListener('touchend', (e) => {
        //     this.pointerStop();
        // }, false);

        // cv.addEventListener('touchmove', (e) => {
        //     this.touchMove(e);
        // }, false);

        // cv.addEventListener('touchcancel', (e) => {
        //     this.pointerStop();
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
    //             this.pointerStop();
    //         }
    //         else {
    //             this.pointerMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
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
    //         this.pointerStop();
    //     }
    // }

    //#endregion

    //#region Input logic

    private panStart(x: number, y: number) {
        this.panStartX = x - this.panOffsetX;
        this.panStartY = y - this.panOffsetY;

        this.isPanning = true;
    }

    private panChange(x, y) {
        // are we panning?
        if (this.isPanning && this.allowPanning) {
            // movement delta
            let dx = (this.mouseManager.mouseX - this.panStartX) * this.panModifier;
            let dy = (this.mouseManager.mouseY - this.panStartY) * this.panModifier;

            // update panstart
            this.panStartX = this.mouseManager.mouseX;
            this.panStartY = this.mouseManager.mouseY;

            // total pan amount
            this.totalPanningX += dx;
            this.totalPanningY += dy;

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
        const canvasBounds = this.context.canvas.getBoundingClientRect();

        this.panOffsetX = canvasBounds.left;
        this.panOffsetY = canvasBounds.top;

        this.totalPanningX = 0;
        this.totalPanningY = 0;

        this.canvasScale = 1;
        this.hasChanges = true;
    }
}
