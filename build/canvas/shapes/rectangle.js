"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
const size_1 = require("canvas/models/size");
const shape_base_1 = require("canvas/shapes/shape-base");
class Corner {
    get controlPoint() { return this._controlPoint; }
    set controlPoint(v) { this._controlPoint = v; }
    get endingPoint() { return this._endingPoint; }
    set endingPoint(v) { this._endingPoint = v; }
    constructor(_controlPoint, _endingPoint) {
        this._controlPoint = _controlPoint;
        this._endingPoint = _endingPoint;
    }
}
exports.Corner = Corner;
class Rectangle extends shape_base_1.ShapeBase {
    constructor(context, position) {
        super(context, position, () => { this.drawRectangle(); });
        this._size = new size_1.Size(50, 50);
        this._roundedCorners = false;
        this._endGap = 0;
    }
    get size() { return this._size; }
    set size(v) {
        this._size = v;
        this.isDirty = true;
    }
    set roundedCorners(v) {
        this._roundedCorners = v;
        this.isDirty = true;
    }
    get endGap() { return this._endGap; }
    set endGap(v) {
        let limit = new vector_1.Vector2D(this.size.width / 2, this.size.height / 2);
        if (v > limit.x || v > limit.y) {
            this._endGap = Math.min(limit.x, limit.y);
        }
        else if (v < 0) {
            this._endGap = 0;
        }
        else {
            this._endGap = v;
        }
        this.isDirty = true;
    }
    get center() {
        return new vector_1.Vector2D(Math.fround(this.position.x + this._size.width / 2), Math.fround(this.position.y + this._size.height / 2));
    }
    get topLeft() {
        return this.position;
    }
    get topRight() {
        return new vector_1.Vector2D(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y));
    }
    get bottomRight() {
        return new vector_1.Vector2D(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y + this._size.height));
    }
    get bottomLeft() {
        return new vector_1.Vector2D(Math.fround(this.position.x), Math.fround(this.position.y + this._size.height));
    }
    get topLine() {
        return {
            p1: new vector_1.Vector2D(this.position.x + this._endGap, this.position.y),
            p2: new vector_1.Vector2D(this.position.x + this.size.width - this._endGap, this.position.y)
        };
    }
    get topRightCorner() {
        let cp = new vector_1.Vector2D(this.position.x + this.size.width, this.position.y);
        let ep = new vector_1.Vector2D(this.position.x + this.size.width, this.position.y + this._endGap);
        return new Corner(cp, ep);
    }
    get rightLine() {
        return {
            p1: new vector_1.Vector2D(this.position.x + this.size.width, this.position.y + this._endGap),
            p2: new vector_1.Vector2D(this.position.x + this.size.width, this.position.y + this.size.height - this._endGap)
        };
    }
    get bottomRightCorner() {
        let cp = new vector_1.Vector2D(this.position.x + this._size.width, this.position.y + this._size.height);
        let ep = new vector_1.Vector2D(this.position.x + this._size.width - this._endGap, this.position.y + this._size.height);
        return new Corner(cp, ep);
    }
    get bottomLine() {
        return {
            p1: new vector_1.Vector2D(this.position.x + this.size.width - this._endGap, this.position.y + this.size.height),
            p2: new vector_1.Vector2D(this.position.x + this._endGap, this.position.y + this.size.height)
        };
    }
    get bottomLeftCorner() {
        let cp = new vector_1.Vector2D(this.position.x, this.position.y + this.size.height);
        let ep = new vector_1.Vector2D(this.position.x, this.position.y + this.size.height - this._endGap);
        return new Corner(cp, ep);
    }
    get leftLine() {
        return {
            p1: new vector_1.Vector2D(this.position.x, this.position.y + this.size.height - this._endGap),
            p2: new vector_1.Vector2D(this.position.x, this.position.y + this._endGap)
        };
    }
    get topLeftCorner() {
        let cp = new vector_1.Vector2D(this.position.x, this.position.y);
        let ep = new vector_1.Vector2D(this.position.x + this._endGap, this.position.y);
        return new Corner(cp, ep);
    }
    drawRectangle() {
        this._context.save();
        if (this._endGap > 0) {
            this.drawComplexRectangle();
        }
        else {
            this.drawBasicRectangle();
        }
        if (this.shadow !== undefined) {
            this._context.shadowBlur = this.shadow.blur;
            this._context.shadowColor = this.shadow.shade;
            this._context.shadowOffsetX = this.shadow.offsetX;
            this._context.shadowOffsetY = this.shadow.offsetY;
        }
        if (this.color !== undefined) {
            this._context.globalAlpha = this.color.alpha;
            this._context.fillStyle = this.color.shade;
            this._context.fill();
        }
        if (this.outline !== undefined) {
            this._context.shadowColor = '';
            this._context.shadowBlur = 0;
            this._context.shadowOffsetX = 0;
            this._context.shadowOffsetY = 0;
            this._context.lineWidth = this.outline.width;
            this._context.globalAlpha = this.outline.alpha;
            this._context.strokeStyle = this.outline.shade;
            this._context.stroke();
        }
        this._context.restore();
    }
    drawBasicRectangle() {
        this._context.beginPath();
        this._context.moveTo(this.position.x, this.position.y);
        this._context.lineTo(this.position.x + this._size.width, this.position.y);
        this._context.lineTo(this.position.x + this._size.width, this.position.y + this._size.height);
        this._context.lineTo(this.position.x, this.position.y + this._size.height);
        this._context.lineTo(this.position.x, this.position.y);
        this._context.closePath();
    }
    drawComplexRectangle() {
        this._context.beginPath();
        let topLine = this.topLine;
        let rightLine = this.rightLine;
        let bottomLine = this.bottomLine;
        let leftLine = this.leftLine;
        let trCorner = this.topRightCorner;
        let brCorner = this.bottomRightCorner;
        let blCorner = this.bottomLeftCorner;
        let tlCorner = this.topLeftCorner;
        this._context.moveTo(topLine.p1.x, topLine.p1.y);
        this._context.lineTo(topLine.p2.x, topLine.p2.y);
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(trCorner.controlPoint.x, trCorner.controlPoint.y, trCorner.endingPoint.x, trCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(trCorner.controlPoint.x - this._endGap, trCorner.controlPoint.y);
            this._context.lineTo(trCorner.endingPoint.x, trCorner.endingPoint.y);
        }
        this._context.lineTo(rightLine.p1.x, rightLine.p1.y);
        this._context.lineTo(rightLine.p2.x, rightLine.p2.y);
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(brCorner.controlPoint.x, brCorner.controlPoint.y, brCorner.endingPoint.x, brCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(brCorner.controlPoint.x - this._endGap, brCorner.controlPoint.y);
            this._context.lineTo(brCorner.endingPoint.x, brCorner.endingPoint.y);
        }
        this._context.lineTo(bottomLine.p1.x, bottomLine.p1.y);
        this._context.lineTo(bottomLine.p2.x, bottomLine.p2.y);
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(blCorner.controlPoint.x, blCorner.controlPoint.y, blCorner.endingPoint.x, blCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(blCorner.controlPoint.x + this._endGap, blCorner.controlPoint.y);
            this._context.lineTo(blCorner.endingPoint.x, blCorner.endingPoint.y);
        }
        this._context.lineTo(leftLine.p1.x, leftLine.p1.y);
        this._context.lineTo(leftLine.p2.x, leftLine.p2.y);
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(tlCorner.controlPoint.x, tlCorner.controlPoint.y, tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(tlCorner.controlPoint.x + this._endGap, tlCorner.controlPoint.y);
            this._context.lineTo(tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }
        this._context.closePath();
    }
    pointWithinBounds(v) {
        let topLeft = this.topLeft;
        let bottomRight = this.bottomRight;
        if (v.x >= topLeft.x && v.x <= bottomRight.x) {
            if (v.y >= topLeft.y && v.y <= bottomRight.y) {
                return true;
            }
        }
        return false;
    }
    lineIntersects(other) {
        let segments = [];
        let screenBounds = this._context.canvas.getBoundingClientRect();
        let screenTop = {
            p1: new vector_1.Vector2D(screenBounds.left, screenBounds.top),
            p2: new vector_1.Vector2D(screenBounds.right, screenBounds.top)
        };
        let screenRight = {
            p1: new vector_1.Vector2D(screenBounds.right, screenBounds.top),
            p2: new vector_1.Vector2D(screenBounds.right, screenBounds.bottom)
        };
        let screenBottom = {
            p1: new vector_1.Vector2D(screenBounds.right, screenBounds.bottom),
            p2: new vector_1.Vector2D(screenBounds.left, screenBounds.bottom)
        };
        let screenLeft = {
            p1: new vector_1.Vector2D(screenBounds.left, screenBounds.bottom),
            p2: new vector_1.Vector2D(screenBounds.left, screenBounds.top)
        };
        segments.push(screenTop);
        segments.push(screenRight);
        segments.push(screenBottom);
        segments.push(screenLeft);
        segments.push(this.topLine);
        segments.push(this.rightLine);
        segments.push(this.bottomLine);
        segments.push(this.leftLine);
        let closestIntersect = null;
        for (let i = 0; i < segments.length; i++) {
            let intersect = this.getIntersection(other, segments[i]);
            if (!intersect) {
                continue;
            }
            if (!closestIntersect || intersect.param < closestIntersect.param) {
                closestIntersect = intersect;
            }
        }
        return closestIntersect ? closestIntersect.intersection : undefined;
    }
    getIntersection(ray, segment) {
        let r_px = ray.p1.x;
        let r_py = ray.p1.y;
        let r_dx = ray.p2.x - ray.p1.x;
        let r_dy = ray.p2.y - ray.p1.y;
        let s_px = segment.p1.x;
        let s_py = segment.p1.y;
        let s_dx = segment.p2.x - segment.p1.x;
        let s_dy = segment.p2.y - segment.p1.y;
        let r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        let s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag) {
            return null;
        }
        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;
        if (T1 < 0) {
            return null;
        }
        if (T2 < 0 || T2 > 1) {
            return null;
        }
        return {
            intersection: new vector_1.Vector2D(r_px + r_dx * T1, r_py + r_dy * T1),
            param: T1
        };
    }
}
exports.Rectangle = Rectangle;
//# sourceMappingURL=rectangle.js.map