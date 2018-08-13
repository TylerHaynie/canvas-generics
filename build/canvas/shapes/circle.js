"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_base_1 = require("canvas/shapes/shape-base");
class Circle extends shape_base_1.ShapeBase {
    constructor(context, position) {
        super(context, position, () => { this.drawCircle(); });
        this.radius = 10;
    }
    drawCircle() {
        this.context.save();
        this.context.beginPath();
        this.context.globalAlpha = 0;
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.fround(2 * Math.PI));
        if (this.shadow !== undefined) {
            this.context.shadowBlur = this.shadow.blur;
            this.context.shadowColor = this.shadow.shade;
            this.context.shadowOffsetX = this.shadow.offsetX;
            this.context.shadowOffsetY = this.shadow.offsetY;
        }
        if (this.color !== undefined) {
            this.context.globalAlpha = this.color.alpha;
            this.context.fillStyle = this.color.shade;
            this.context.fill();
        }
        if (this.outline !== undefined) {
            this.context.lineWidth = this.outline.width;
            this.context.globalAlpha = this.outline.alpha;
            this.context.strokeStyle = this.outline.shade;
            this.context.stroke();
        }
        this.context.restore();
    }
    pointWithinBounds(point) {
        let withinBounds = false;
        let circle1 = { radius: 1, x: point.x, y: point.y };
        let circle2 = { radius: this.radius, x: this.position.x, y: this.position.y };
        let dx = circle1.x - circle2.x;
        let dy = circle1.y - circle2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < circle1.radius + circle2.radius) {
            withinBounds = true;
        }
        return withinBounds;
    }
}
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map