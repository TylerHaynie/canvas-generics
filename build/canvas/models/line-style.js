"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("canvas/models/color");
class LineStyle extends color_1.Color {
    constructor(shade, lineWidth) {
        super(shade);
        this.width = lineWidth || 1;
    }
}
exports.LineStyle = LineStyle;
//# sourceMappingURL=line-style.js.map