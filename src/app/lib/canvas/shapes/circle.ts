import { Vector } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { ShapeBase } from '@canvas/shapes/shape-base';

export class Circle extends ShapeBase {
    radius: number;

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context, position);

        this.radius = 10;
    }

    center(): Vector {
        if (this.position && this.radius) {
            return <Vector>{
                x: Math.fround(this.position.x - this.radius / 2),
                y: Math.fround(this.position.y - this.radius / 2)
            };
        }

        return;
    }

    draw() {
        if (this.context) {
            this.context.save();
            this.context.beginPath();
            this.context.globalAlpha = 0;

            // create the circle
            this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.fround(2 * Math.PI));

            // does it have a shadow
            if (this.shadow) {
                this.context.shadowBlur = this.shadow.shadowBlur;
                this.context.shadowColor = this.shadow.shadowColor;
                this.context.shadowOffsetX = this.shadow.offsetX;
                this.context.shadowOffsetY = this.shadow.offsetY;
            }

            // draw solid circle
            if (this.color) {
                this.context.globalAlpha = this.color.alpha;
                this.context.fillStyle = this.color.shade;

                this.context.fill();
            }

            // does it have an outline
            if (this.outline) {
                this.context.lineWidth = this.outline.lineWidth;
                this.context.globalAlpha = this.outline.alpha;
                this.context.strokeStyle = this.outline.shade;

                // outline the circle
                this.context.stroke();
            }

            this.context.restore();
        }
    }

    pointWithinBounds(point: Vector) {
        let withinBounds: boolean = false;

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
