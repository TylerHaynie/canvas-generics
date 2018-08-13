"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
class Bounds {
    get x() { return this._x; }
    get y() { return this._y; }
    get width() { return this._width; }
    get height() { return this._height; }
    constructor(v, size) {
        this._x = v.x;
        this._y = v.y;
        this._width = size.width;
        this._height = size.height;
    }
    get topLeft() {
        return new vector_1.Vector2D(this._x, this._y);
    }
    get topRight() {
        return new vector_1.Vector2D(this._x + this._width, this._y);
    }
    get bottomLeft() {
        return new vector_1.Vector2D(this._x, this._y + this._height);
    }
    get bottomRight() {
        return new vector_1.Vector2D(this._x + this._width, this._y + this._height);
    }
    get topLength() {
        return Math.max(this.topLeft.x, this.topRight.x) - Math.max(this.topLeft.x, this.topRight.x);
    }
    get bottomLength() {
        return Math.max(this.bottomLeft.x, this.bottomRight.x) - Math.max(this.bottomLeft.x, this.bottomRight.x);
    }
    get left_height() {
        return Math.max(this.topLeft.y, this.bottomLeft.y) - Math.max(this.topLeft.y, this.bottomLeft.y);
    }
    get right_height() {
        return Math.max(this.topRight.y, this.bottomRight.y) - Math.max(this.topRight.y, this.bottomRight.y);
    }
}
exports.Bounds = Bounds;
//# sourceMappingURL=bounds.js.map