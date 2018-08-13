"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
const canvas_event_types_1 = require("canvas/events/canvas-event-types");
const color_1 = require("canvas/models/color");
const line_style_1 = require("canvas/models/line-style");
const shadow_1 = require("canvas/models/shadow");
const canvas_event_1 = require("canvas/events/canvas-event");
class ElementBase {
    constructor(context) {
        this._isDraggable = false;
        this._isResizable = false;
        this.childElements = [];
        this.hoverMenuEnabled = false;
        this._dragging = false;
        this.dragOffset = new vector_1.Vector2D(0, 0);
        this.canvasEvent = new canvas_event_1.CanvasEvent();
        this._context = context;
        this.previousEventType = canvas_event_types_1.UI_EVENT_TYPE.UP;
        this.activeColor = new color_1.Color();
        this.activeOutline = new line_style_1.LineStyle();
        this.activeShadow = new shadow_1.Shadow();
        this._defaultColor = new color_1.Color();
    }
    get baseElement() { return this._baseElement; }
    set baseElement(v) {
        this._baseElement = v;
        this.defaultColor = v.color;
        this.defaultOutline = v.outline;
        this.defaultShadow = v.shadow;
    }
    get isDraggable() { return this._isDraggable; }
    set isDraggable(v) { this._isDraggable = v; }
    get isResizable() { return this._isResizable; }
    set isResizable(v) { this._isResizable = v; }
    set defaultColor(v) {
        this._defaultColor = v;
        this.activeColor = v;
    }
    set defaultOutline(v) {
        this._defaultOutline = v;
        this.activeOutline = v;
    }
    set defaultShadow(v) {
        this._defaultShadow = v;
        this.activeShadow = v;
    }
    set isDragging(v) { this._dragging = v; }
    get isDragging() { return this._dragging; }
    on(on, callback) {
        this.canvasEvent.subscribe(on, callback);
    }
    fireEvent(e) {
        this.canvasEvent.fireEvent(this._eventType, e);
        this.previousEventType = this._eventType;
        this.childElements.forEach(childElement => {
            childElement.fireEvent(e);
        });
    }
    elementMouseDown(e) {
        this._eventType = canvas_event_types_1.UI_EVENT_TYPE.DOWN;
        e.uiMouseState = canvas_event_types_1.MOUSE_STATE.DEFAULT;
        if (this._isDraggable) {
            this.startDrag(e);
        }
        this.fireEvent(e);
    }
    elementMouseUp(e) {
        if (this.previousEventType === canvas_event_types_1.UI_EVENT_TYPE.DOWN) {
            this._eventType = canvas_event_types_1.UI_EVENT_TYPE.HOVER;
        }
        else {
            this._eventType = canvas_event_types_1.UI_EVENT_TYPE.UP;
        }
        this._dragging = false;
        e.uiMouseState = canvas_event_types_1.MOUSE_STATE.DEFAULT;
        this.fireEvent(e);
    }
    elementMouseHover(e) {
        if (this.previousEventType !== canvas_event_types_1.UI_EVENT_TYPE.DOWN) {
            this._eventType = canvas_event_types_1.UI_EVENT_TYPE.HOVER;
            this.hoverMenuEnabled = true;
        }
        this.fireEvent(e);
    }
    elementMouseMove(e) {
        this._eventType = canvas_event_types_1.UI_EVENT_TYPE.MOVE;
        if (this._dragging) {
            this.dragElement(e);
        }
        this.fireEvent(e);
    }
    elementMouseOut(e) {
        this._eventType = canvas_event_types_1.UI_EVENT_TYPE.OUT;
        this._dragging = false;
        e.uiMouseState = canvas_event_types_1.MOUSE_STATE.DEFAULT;
        this.hoverMenuEnabled = false;
        this.fireEvent(e);
    }
    setPosition(position) {
        this.baseElement.position = position;
    }
    getposition() {
        return this.baseElement.position;
    }
    draw() {
        this.styleElement();
        this._baseElement.draw();
        this.childElements.forEach(childElement => {
            childElement.draw();
        });
        if (this.hoverMenuEnabled) {
            if (this.resizeMenu) {
                this.resizeMenu.draw();
            }
        }
    }
    styleElement() {
        this.applyColors();
    }
    applyColors() {
        this.activeColor = this._defaultColor;
        this.activeOutline = this._defaultOutline;
        this.activeShadow = this._defaultShadow;
        switch (this._eventType) {
            case canvas_event_types_1.UI_EVENT_TYPE.DOWN:
                if (this.downColor) {
                    this.activeColor = this.downColor;
                }
                if (this.downOutline) {
                    this.activeOutline = this.downOutline;
                }
                if (this.downShadow) {
                    this.activeShadow = this.downShadow;
                }
                break;
            case canvas_event_types_1.UI_EVENT_TYPE.HOVER:
                if (this.hoverColor) {
                    this.activeColor = this.hoverColor;
                }
                if (this.hoverOutline) {
                    this.activeOutline = this.hoverOutline;
                }
                if (this.hoverShadow) {
                    this.activeShadow = this.hoverShadow;
                }
        }
        this._baseElement.color = this.activeColor;
        this._baseElement.outline = this.activeOutline;
        this._baseElement.shadow = this.activeShadow;
    }
    startDrag(e) {
        if (!this._dragging) {
            this._dragging = true;
        }
        e.uiMouseState = canvas_event_types_1.MOUSE_STATE.GRAB;
        let elementPosition = this.getposition();
        let dx = e.mousePosition.x - elementPosition.x;
        let dy = e.mousePosition.y - elementPosition.y;
        this.dragOffset = new vector_1.Vector2D(dx, dy);
    }
    dragElement(e) {
        e.uiMouseState = canvas_event_types_1.MOUSE_STATE.GRAB;
        let p = new vector_1.Vector2D(e.mousePosition.x - this.dragOffset.x, e.mousePosition.y - this.dragOffset.y);
        this.setPosition(p);
    }
}
exports.ElementBase = ElementBase;
//# sourceMappingURL=element-base.js.map