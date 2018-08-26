"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_base_1 = require("canvas/shapes/shape-base");
class Circle extends shape_base_1.ShapeBase {
    get radius() { return this._radius; }
    set radius(v) {
        this._radius = v;
        this.isDirty = true;
    }
    constructor(context, position) {
        super(context, position, () => { this.drawCircle(); });
        this._radius = 10;
    }
    drawCircle() {
        this._context.save();
        this._context.beginPath();
        this._context.globalAlpha = 0;
        this._context.arc(this.position.x, this.position.y, this._radius, 0, Math.fround(2 * Math.PI));
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
            this._context.lineWidth = this.outline.width;
            this._context.globalAlpha = this.outline.alpha;
            this._context.strokeStyle = this.outline.shade;
            this._context.stroke();
        }
        this._context.restore();
    }
    pointWithinBounds(point) {
        let withinBounds = false;
        let circle1 = { radius: 1, x: point.x, y: point.y };
        let circle2 = { radius: this._radius, x: this.position.x, y: this.position.y };
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