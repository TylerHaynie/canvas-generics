"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DrawBase {
    constructor(context, pos, drawCallback) {
        this.isDirty = true;
        this._context = context;
        this._position = pos;
        this._drawCallback = drawCallback;
    }
    get position() {
        return this._position;
    }
    set position(v) {
        this._position = v;
        this.isDirty = true;
    }
    draw() {
        if (this.isDirty) {
            this._drawCallback();
            this.isDirty = false;
        }
    }
}
exports.DrawBase = DrawBase;
//# sourceMappingURL=draw-base.js.map