"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
const color_1 = require("canvas/models/color");
const drawBase_1 = require("canvas/shapes/drawBase");
class ShapeBase extends drawBase_1.DrawBase {
    constructor(context, position, drawCallback) {
        super(context, drawCallback);
        this._outline = undefined;
        this._shadow = undefined;
        this.color = new color_1.Color();
        this._position = position;
    }
    get position() { return this._position; }
    set position(position) {
        this._position = new vector_1.Vector2D(Math.fround(position.x), Math.fround(position.y));
    }
    get outline() { return this._outline; }
    set outline(v) { this._outline = v; }
    get shadow() { return this._shadow; }
    set shadow(v) { this._shadow = v; }
}
exports.ShapeBase = ShapeBase;
//# sourceMappingURL=shape-base.js.map