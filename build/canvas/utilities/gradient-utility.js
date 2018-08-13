"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GradientUtility {
    constructor(context) {
        this.context = context;
    }
    createLinearGradient(x1, y1, x2, y2) {
        return this.context.createLinearGradient(x1, y1, x2, y2);
    }
    createRadialGradient(x1, y1, r1, x2, y2, r2) {
        return this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }
}
exports.GradientUtility = GradientUtility;
//# sourceMappingURL=gradient-utility.js.map