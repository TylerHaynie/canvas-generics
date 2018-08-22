"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_data_1 = require("canvas/events/event-data");
const vector_1 = require("canvas/objects/vector");
const canvas_enums_1 = require("canvas/events/canvas-enums");
const canvas_event_1 = require("canvas/events/canvas-event");
class MouseManager {
    constructor(context) {
        this.contextModified = false;
        this._mouseOnCanvas = false;
        this.scrollingDirection = 'none';
        this.leftMousePosition = 'up';
        this.isMoving = false;
        this.mouseEvent = new canvas_event_1.CanvasEvent();
        this._context = context;
        this.registerEvents();
    }
    get mouseOnCanvas() { return this._mouseOnCanvas; }
    on(on, callback) {
        this.mouseEvent.subscribe(on, callback);
    }
    contextupdated(data) {
        if (this._mouseOnCanvas) {
            let mx = (this.mousePosition.x - data.pan.x) / data.scale;
            let my = (this.mousePosition.y - data.pan.y) / data.scale;
            this.translatedPosition = new vector_1.Vector2D(mx, my);
        }
    }
    fireEvent() {
        let e = new event_data_1.MouseData();
        e.eventType = this.eventType;
        e.translatedPosition = this.translatedPosition;
        e.mousePosition = this.mousePosition;
        e.mouseOnCanvas = this._mouseOnCanvas;
        e.scrollDirection = this.scrollingDirection;
        e.leftMouseState = this.leftMousePosition;
        e.mouseMoving = this.isMoving;
        this.mouseEvent.fireEvent(e.eventType, e);
    }
    registerEvents() {
        const cv = this._context.canvas;
        cv.onmousemove = (e) => {
            this.eventType = canvas_enums_1.MOUSE_EVENT_TYPE.MOVE;
            this.updateMousePosition(e.offsetX, e.offsetY);
        };
        cv.onmousedown = (e) => {
            this.eventType = canvas_enums_1.MOUSE_EVENT_TYPE.DOWN;
            this.doMouseDown(e.offsetX, e.offsetY);
        };
        cv.onmouseup = (e) => {
            this.eventType = canvas_enums_1.MOUSE_EVENT_TYPE.UP;
            this.mouseUp();
        };
        cv.onmousewheel = (e) => {
            this.eventType = canvas_enums_1.MOUSE_EVENT_TYPE.WHEEL;
            if (e.deltaY > 0) {
                this.mouseScrollDown();
            }
            else {
                this.mouseScrollUp();
            }
        };
        cv.onmouseout = (e) => {
            this.eventType = canvas_enums_1.MOUSE_EVENT_TYPE.OUT;
            this.mouseLeave();
        };
        cv.onmouseleave = (e) => {
            this.eventType = canvas_enums_1.MOUSE_EVENT_TYPE.OUT;
            this.mouseLeave();
        };
    }
    doMouseDown(x, y) {
        this._mouseOnCanvas = true;
        this.leftMousePosition = 'down';
        this.mousePosition = new vector_1.Vector2D(x, y);
        this.fireEvent();
    }
    updateMousePosition(x, y) {
        this.isMoving = true;
        this.mousePosition = new vector_1.Vector2D(x, y);
        this._mouseOnCanvas = true;
        this.fireEvent();
    }
    mouseUp() {
        this.leftMousePosition = 'up';
        this.fireEvent();
    }
    mouseLeave() {
        this._mouseOnCanvas = false;
        this.mousePosition = undefined;
        this.fireEvent();
    }
    mouseScrollUp() {
        this._mouseOnCanvas = true;
        this.scrollingDirection = 'up';
        this.fireEvent();
    }
    mouseScrollDown() {
        this._mouseOnCanvas = true;
        this.scrollingDirection = 'down';
        this.fireEvent();
    }
}
exports.MouseManager = MouseManager;
//# sourceMappingURL=mouse-manager.js.map