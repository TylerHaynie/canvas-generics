import { Vector2D } from 'canvas/objects/vector';
import { ShapeBase } from 'canvas/shapes/shape-base';

export class Circle extends ShapeBase {
    private _radius: number;
    public get radius(): number { return this._radius; }
    public set radius(v: number) {
        this._radius = v;
        this.isDirty = true;
    }

    constructor(context: CanvasRenderingContext2D, position: Vector2D) {
        super(context, position, () => { this.drawCircle(); });
        this._radius = 10;
    }

    private drawCircle() {
        this._context.save();
        this._context.beginPath();
        this._context.globalAlpha = 0;

        // create the circle
        this._context.arc(this.position.x, this.position.y, this._radius, 0, Math.fround(2 * Math.PI));

        // does it have a shadow
        if (this.shadow !== undefined) {
            this._context.shadowBlur = this.shadow.blur;
            this._context.shadowColor = this.shadow.shade;
            this._context.shadowOffsetX = this.shadow.offsetX;
            this._context.shadowOffsetY = this.shadow.offsetY;
        }

        // draw solid circle
        if (this.color !== undefined) {
            this._context.globalAlpha = this.color.alpha;
            this._context.fillStyle = this.color.shade;

            this._context.fill();
        }

        // does it have an outline
        if (this.outline !== undefined) {
            this._context.lineWidth = this.outline.width;
            this._context.globalAlpha = this.outline.alpha;
            this._context.strokeStyle = this.outline.shade;

            // outline the circle
            this._context.stroke();
        }

        this._context.restore();
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
