"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_base_1 = require("canvas/elements/element-base");
const circle_1 = require("canvas/shapes/circle");
class ElementCircle extends element_base_1.ElementBase {
    constructor(context, position) {
        super(context);
        this.radius = 25;
        let c = new circle_1.Circle(context, position);
        c.radius = this.radius;
        c.color = this.defaultColor;
        c.outline = this.defaultOutline;
        c.shadow = this.defaultShadow;
        this.baseElement = c;
    }
}
exports.ElementCircle = ElementCircle;
//# sourceMappingURL=element-circle.js.map