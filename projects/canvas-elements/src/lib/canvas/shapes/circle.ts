import { Vector2D } from '../objects/vector';
import { ShapeBase } from './shape-base';

export class Circle extends ShapeBase {
    private _radius: number;
    public get radius(): number { return this._radius; }
    public set radius(v: number) {
        this._radius = v;
    }

    constructor(context: CanvasRenderingContext2D, position: Vector2D) {
        super(context, position);
        this._radius = 10;
    }

    public draw() {
        super.context.save();
        super.context.beginPath();
        super.context.globalAlpha = 0;

        // create the circle
        super.context.arc(this.position.x, this.position.y, this._radius, 0, Math.fround(2 * Math.PI));

        // does it have a shadow
        if (this.shadow !== undefined) {
            super.context.shadowBlur = this.shadow.blur;
            super.context.shadowColor = this.shadow.shade;
            super.context.shadowOffsetX = this.shadow.offsetX;
            super.context.shadowOffsetY = this.shadow.offsetY;
        }

        // draw solid circle
        if (this.color !== undefined) {
            super.context.globalAlpha = this.color.alpha;
            super.context.fillStyle = this.color.shade;

            super.context.fill();
        }

        // does it have an outline
        if (this.outline !== undefined) {
            super.context.lineWidth = this.outline.width;
            super.context.globalAlpha = this.outline.alpha;
            super.context.strokeStyle = this.outline.shade;

            // outline the circle
            super.context.stroke();
        }

        super.context.restore();
    }

    pointWithinBounds(point: Vector2D) {
        let withinBounds: boolean = false;

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
