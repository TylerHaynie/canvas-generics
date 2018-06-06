import { Vector } from '../objects/vector';
import { Color } from '../models/color';
import { LineStyle } from '../models/line-style';
import { Shadow } from '../models/shadow';

export class Circle {
    private context: CanvasRenderingContext2D;

    position: Vector;
    radius: number;

    color?: Color;
    outline?: LineStyle;
    shadow?: Shadow;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;

    }

    center(): Vector {
        if (this.position && this.radius) {
            return <Vector>{
                x: this.position.x - this.radius / 2,
                y: this.position.y - this.radius / 2
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
            this.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

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

}
