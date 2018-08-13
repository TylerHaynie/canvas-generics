"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
const canvas_event_types_1 = require("canvas/events/canvas-event-types");
const canvas_event_1 = require("canvas/events/canvas-event");
const event_data_1 = require("canvas/events/event-data");
class PanZoomManager {
    constructor(context, mouseManager) {
        this.canvasScaleStep = .10;
        this.canvasScale = 1;
        this.minimumPanSpeed = 0;
        this.maximumPanSpeed = 2;
        this.allowPanning = false;
        this.pannableModifier = 1;
        this.isPanning = false;
        this.totalPanning = new vector_1.Vector2D(0, 0);
        this.panModifier = 1;
        this.allowScaling = false;
        this.maximumScale = 0;
        this.minimumScale = 0;
        this.pinchMoveStart = 0;
        this.pinchMoveEnd = 0;
        this.isPinching = false;
        this.pinchScale = 50;
        this.panZoomEvent = new canvas_event_1.CanvasEvent();
        this.context = context;
        this.mouseManager = mouseManager;
        this.resetView();
        this.registerEvents();
    }
    set scalingAllowed(v) { this.allowScaling = v; }
    set minScale(v) { this.minimumScale = v; }
    set maxScale(v) { this.maximumScale = v; }
    set scaleStep(v) { this.canvasScaleStep = v; }
    set panningAllowed(v) { this.allowPanning = v; }
    set panSpeed(v) {
        if (v <= this.minimumPanSpeed) {
            this.panModifier = this.minimumPanSpeed;
        }
        else if (v > this.maximumPanSpeed) {
            this.panModifier = this.maximumPanSpeed;
        }
        else {
            this.panModifier = v;
        }
    }
    on(on, callback) {
        this.panZoomEvent.subscribe(on, callback);
    }
    zoomIn() {
        this.scaleUp(this.canvasScaleStep);
    }
    zoomOut() {
        this.scaleDown(this.canvasScaleStep);
    }
    registerEvents() {
        const cv = this.context.canvas;
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.DOWN, (e) => {
            this.mouseDown(e.mousePosition);
        });
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.MOVE, (e) => {
            this.mouseMove(e.mousePosition);
        });
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.WHEEL, (e) => {
            if (this.scalingAllowed) {
                switch (e.scrollDirection) {
                    case 'up':
                        this.zoomIn();
                        break;
                    case 'down':
                        this.zoomOut();
                        break;
                }
            }
        });
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.UP, (e) => {
            this.mouseStop();
        });
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.OUT, (e) => {
            this.mouseStop();
        });
    }
    fireEvent() {
        let data = new event_data_1.PanZoomData();
        data.eventType = this.eventType;
        data.scale = this.canvasScale;
        data.pan = this.totalPanning;
        data.mousePosition = this.mousePosition;
        this.panZoomEvent.fireEvent(this.eventType, data);
    }
    mouseDown(mousePosition) {
        if (!this.isPanning) {
            this.panStartPosition = new vector_1.Vector2D(mousePosition.x - this.panOffset.x, mousePosition.y - this.panOffset.y);
            this.isPanning = true;
        }
    }
    mouseMove(mousePosition) {
        this.mousePosition = mousePosition;
        this.pan(mousePosition);
    }
    mouseStop() {
        if (this.isPinching && this.allowScaling) {
            let pinchDifference = (Math.max(this.pinchMoveStart, this.pinchMoveEnd) - Math.min(this.pinchMoveStart, this.pinchMoveEnd)) / this.pinchScale;
            if (this.pinchMoveEnd > this.pinchMoveStart) {
                this.scaleUp(pinchDifference);
            }
            else if (this.pinchMoveEnd < this.pinchMoveStart) {
                this.scaleDown(pinchDifference);
            }
            this.pinchMoveStart = 0;
            this.pinchMoveEnd = 0;
            this.isPinching = false;
        }
        this.isPanning = false;
    }
    pan(mousePosition) {
        if (this.isPanning && this.allowPanning) {
            let dx = (mousePosition.x - this.panStartPosition.x) * this.panModifier;
            let dy = (mousePosition.y - this.panStartPosition.y) * this.panModifier;
            this.panStartPosition = new vector_1.Vector2D(mousePosition.x, mousePosition.y);
            this.totalPanning = new vector_1.Vector2D(this.totalPanning.x + dx, this.totalPanning.y + dy);
            this.eventType = canvas_event_types_1.PAN_ZOOM_EVENT_TYPE.PAN;
            this.fireEvent();
        }
    }
    scaleUp(amount) {
        let newScale = this.canvasScale + amount;
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
        this.eventType = canvas_event_types_1.PAN_ZOOM_EVENT_TYPE.ZOOM;
        this.fireEvent();
    }
    scaleDown(amount) {
        if (this.allowScaling) {
            let newScale = this.canvasScale - amount;
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
            this.eventType = canvas_event_types_1.PAN_ZOOM_EVENT_TYPE.ZOOM;
            this.fireEvent();
        }
    }
    resetView() {
        this.panOffset = new vector_1.Vector2D(0, 0);
        this.totalPanning = new vector_1.Vector2D(0, 0);
        this.canvasScale = 1;
        this.eventType = canvas_event_types_1.PAN_ZOOM_EVENT_TYPE.RESET;
        this.fireEvent();
    }
}
exports.PanZoomManager = PanZoomManager;
//# sourceMappingURL=pan-zoom-manager.js.map