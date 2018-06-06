import { Vector } from '../objects/vector';
import { Size } from '../models/size';
import { Color } from '../models/color';
import { LineStyle } from '../models/line-style';
import { Shadow } from '../models/shadow';

export class Rectangle {
    private context: CanvasRenderingContext2D;

    position: Vector;
    size: Size;

    color?: Color;
    outline?: LineStyle;
    shadow?: Shadow;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    draw() {
        if (this.context) {
            if (this.position && this.size) {
                this.context.save();

                // does it have a shadow
                if (this.shadow) {
                    this.context.shadowBlur = this.shadow.shadowBlur;
                    this.context.shadowColor = this.shadow.shadowColor;
                    this.context.shadowOffsetX = this.shadow.offsetX;
                    this.context.shadowOffsetY = this.shadow.offsetY;
                }

                // draw the solid this
                if (this.color) {
                    this.context.globalAlpha = this.color.alpha;
                    this.context.fillStyle = this.color.shade;
                    this.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
                }

                // draw the outline
                if (this.outline) {
                    this.context.lineWidth = this.outline.lineWidth;
                    this.context.globalAlpha = this.outline.alpha;
                    this.context.strokeStyle = this.outline.shade;
                    this.context.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
                }

                this.context.restore();
            }
            else {
                console.warn('You are trying to draw a rectangle without one or all of the following properties: {position, size}');
            }
        }
    }

    center(): Vector {
        return <Vector>{
            x: this.position.x - this.size.width / 2,
            y: this.position.y - this.size.height / 2
        };
    }

    bounds() {
        // let tl: Vector = this.position;
        // let tr: Vector = <Vector>{ x: this.position.x - this.size.width, y: this.position.y };
        // let bl: Vector = <Vector>{ x: this.position.x, y: this.position.y - this.size.height };
        // let br: Vector = <Vector>{ x: this.position.x - this.size.width, y: this.position.y - this.size.height };

        // return {
        //     topLeft: tl,
        //     topRight: tr,
        //     bottomLeft: bl,
        //     bottomRight: br
        // };
    }


}
