"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DrawBase {
    constructor(context, drawCallback) {
        this.context = context;
        this._drawCallback = drawCallback;
    }
    draw() {
        this._drawCallback();
    }
}
exports.DrawBase = DrawBase;
//# sourceMappingURL=drawBase.js.map