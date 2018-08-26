"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("canvas/models/color");
const draw_base_1 = require("canvas/shapes/draw-base");
class ShapeBase extends draw_base_1.DrawBase {
    constructor(context, position, drawCallback) {
        super(context, position, drawCallback);
        this._outline = undefined;
        this._shadow = undefined;
        this._color = new color_1.Color();
    }
    get outline() { return this._outline; }
    set outline(v) {
        this._outline = v;
        this.isDirty = true;
    }
    get shadow() { return this._shadow; }
    set shadow(v) {
        this._shadow = v;
        this.isDirty = true;
    }
    get color() { return this._color; }
    set color(v) {
        this._color = v;
        this.isDirty = true;
    }
}
exports.ShapeBase = ShapeBase;
//# sourceMappingURL=shape-base.js.map