"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bounds_1 = require("canvas/objects/bounds");
const size_1 = require("canvas/models/size");
const color_1 = require("canvas/models/color");
const vector_1 = require("canvas/objects/vector");
const rectangle_1 = require("canvas/shapes/rectangle");
const element_base_1 = require("canvas/elements/element-base");
const canvas_event_types_1 = require("canvas/events/canvas-event-types");
class ResizeProperty {
    constructor(context, position, size) {
        this.context = context;
        this.position = position;
        this.size = size;
        this.buildMenu();
    }
    draw() {
        this.topLeftCorner.draw();
        this.topRightCorner.draw();
        this.bottomRightCorner.draw();
        this.bottomLeftCorner.draw();
        this.leftMidRect.draw();
        this.rightMidRect.draw();
        this.topMidRect.draw();
        this.bottomMidRect.draw();
    }
    buildMenu() {
        let pp = this.position;
        let ps = this.size;
        let b = new bounds_1.Bounds(pp, ps);
        let cornerSize = new size_1.Size(15, 15);
        let cornerColor = new color_1.Color('lime');
        let straightColor = new color_1.Color('yellow');
        let hoverColor = new color_1.Color('pink');
        hoverColor.alpha = 1;
        this.topLeftCorner = this.buildRect(this.context, b.topLeft, cornerSize, cornerColor);
        this.topLeftCorner.hoverColor = hoverColor;
        this.topLeftCorner.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.topLeftBottomRightCornerHover(e, this.topLeftCorner);
        });
        this.topRightCorner = this.buildRect(this.context, new vector_1.Vector2D(b.topRight.x - cornerSize.width, b.topRight.y), cornerSize, cornerColor);
        this.topRightCorner.hoverColor = hoverColor;
        this.topRightCorner.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.topRightBottomLeftCornerHover(e, this.topRightCorner);
        });
        this.bottomRightCorner = this.buildRect(this.context, new vector_1.Vector2D(b.bottomRight.x - cornerSize.width, b.bottomRight.y - cornerSize.height), cornerSize, cornerColor);
        this.bottomRightCorner.hoverColor = hoverColor;
        this.bottomRightCorner.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.topLeftBottomRightCornerHover(e, this.bottomRightCorner);
        });
        this.bottomLeftCorner = this.buildRect(this.context, new vector_1.Vector2D(b.bottomLeft.x, b.bottomLeft.y - cornerSize.height), cornerSize, cornerColor);
        this.bottomLeftCorner.hoverColor = hoverColor;
        this.bottomLeftCorner.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.topRightBottomLeftCornerHover(e, this.bottomLeftCorner);
        });
        this.leftMidRect = this.leftCenterRect(this.context, b, cornerSize, straightColor);
        this.leftMidRect.hoverColor = hoverColor;
        this.leftMidRect.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.verticalHovered(e, this.leftMidRect);
        });
        this.rightMidRect = this.rightCenterRect(this.context, b, cornerSize, straightColor);
        this.rightMidRect.hoverColor = hoverColor;
        this.rightMidRect.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.verticalHovered(e, this.rightMidRect);
        });
        this.topMidRect = this.topCenterRect(this.context, b, cornerSize, straightColor);
        this.topMidRect.hoverColor = hoverColor;
        this.topMidRect.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.horizontalHovered(e, this.topMidRect);
        });
        this.bottomMidRect = this.bottomCenterRect(this.context, b, cornerSize, straightColor);
        this.bottomMidRect.hoverColor = hoverColor;
        this.bottomMidRect.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
            this.horizontalHovered(e, this.bottomMidRect);
        });
    }
    mouseMove(e) {
        if (this.topLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topLeftCorner.elementMouseHover(e);
        }
        else {
            this.topLeftCorner.elementMouseOut(e);
        }
        if (this.topMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topMidRect.elementMouseHover(e);
        }
        else {
            this.topMidRect.elementMouseOut(e);
        }
        if (this.topRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topRightCorner.elementMouseHover(e);
        }
        else {
            this.topRightCorner.elementMouseOut(e);
        }
        if (this.rightMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.rightMidRect.elementMouseHover(e);
        }
        else {
            this.rightMidRect.elementMouseOut(e);
        }
        if (this.bottomRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomRightCorner.elementMouseHover(e);
        }
        else {
            this.bottomRightCorner.elementMouseOut(e);
        }
        if (this.bottomMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomMidRect.elementMouseHover(e);
        }
        else {
            this.bottomMidRect.elementMouseOut(e);
        }
        if (this.bottomLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomLeftCorner.elementMouseHover(e);
        }
        else {
            this.bottomLeftCorner.elementMouseOut(e);
        }
        if (this.leftMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.leftMidRect.elementMouseHover(e);
        }
        else {
            this.leftMidRect.elementMouseOut(e);
        }
    }
    mouseDown(e) {
        if (this.topLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topLeftCorner.elementMouseDown(e);
        }
        if (this.topMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topMidRect.elementMouseDown(e);
        }
        if (this.topRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topRightCorner.elementMouseDown(e);
        }
        if (this.rightMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.rightMidRect.elementMouseDown(e);
        }
        if (this.bottomRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomRightCorner.elementMouseDown(e);
        }
        if (this.bottomMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomMidRect.elementMouseDown(e);
        }
        if (this.bottomLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomLeftCorner.elementMouseDown(e);
        }
        if (this.leftMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.leftMidRect.elementMouseDown(e);
        }
    }
    buildRect(context, position, size, color) {
        let rect = new rectangle_1.Rectangle(context, position);
        rect.color = color;
        rect.size = size;
        rect.color.alpha = .35;
        let eb = new element_base_1.ElementBase(context);
        eb.baseElement = rect;
        return eb;
    }
    topCenterRect(context, bounds, cornerSize, color) {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new vector_1.Vector2D(bounds.topLeft.x + cornerSize.width, bounds.topLeft.y);
        let s = new size_1.Size(w, cornerSize.height);
        return this.buildRect(context, p, s, color);
    }
    bottomCenterRect(context, bounds, cornerSize, color) {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new vector_1.Vector2D(bounds.bottomLeft.x + cornerSize.width, bounds.bottomLeft.y - cornerSize.height);
        let s = new size_1.Size(w, cornerSize.height);
        return this.buildRect(context, p, s, color);
    }
    leftCenterRect(context, bounds, cornerSize, color) {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new vector_1.Vector2D(bounds.topLeft.x, bounds.topLeft.y + cornerSize.height);
        let s = new size_1.Size(cornerSize.width, h);
        return this.buildRect(context, p, s, color);
    }
    rightCenterRect(context, bounds, cornerSize, color) {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new vector_1.Vector2D(bounds.topRight.x - cornerSize.width, bounds.topRight.y + cornerSize.height);
        let s = new size_1.Size(cornerSize.width, h);
        return this.buildRect(context, p, s, color);
    }
    topLeftBottomRightCornerHover(e, element) {
    }
    topRightBottomLeftCornerHover(e, element) {
    }
    horizontalHovered(e, element) {
    }
    verticalHovered(e, element) {
    }
}
exports.ResizeProperty = ResizeProperty;
//# sourceMappingURL=resize-property.js.map