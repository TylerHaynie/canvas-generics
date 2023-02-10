import { IDrawable } from '../models/interfaces/idrawable';
import { Vertex } from '../objects/vertex';
import { ShapeBase } from './shape-base';

export class Circle extends ShapeBase implements IDrawable {
    private _radius: number;
    public get radius(): number { return this._radius; }
    public set radius(v: number) {
        this._radius = v;
    }

    constructor(position: Vertex) {
        super(position);
        this._radius = 10;
    }

    async draw(context: CanvasRenderingContext2D, ) {
        context.save();
        context.beginPath();
        context.globalAlpha = 0;

        // create the circle
        context.arc(this.position.x, this.position.y, this._radius, 0, Math.fround(2 * Math.PI));

        // does it have a shadow
        if (this.shadow !== undefined) {
            context.shadowBlur = this.shadow.blur;
            context.shadowColor = this.shadow.shade;
            context.shadowOffsetX = this.shadow.offsetX;
            context.shadowOffsetY = this.shadow.offsetY;
        }

        // draw solid circle
        if (this.color !== undefined) {
            context.globalAlpha = this.color.alpha;
            context.fillStyle = this.color.shade;

            context.fill();
        }

        // does it have an outline
        if (this.outline !== undefined) {
            context.lineWidth = this.outline.width;
            context.globalAlpha = this.outline.alpha;
            context.strokeStyle = this.outline.shade;

            // outline the circle
            context.stroke();
        }

        context.restore();
    }

    pointWithinBounds(point: Vertex) {
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
