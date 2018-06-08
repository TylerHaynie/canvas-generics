import { ElementBase } from '@canvas/elements/element-base';
import { Vector } from '@canvas/objects/vector';
import { Circle } from '@canvas/shapes/circle';

export class ElementCircle extends ElementBase {

    radius: number = 25;
    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context);

        let c = new Circle(context, position);
        c.radius = this.radius;
        c.color = this.activeColor;
        c.outline = this.activeOutline;
        c.shadow = this.activeShadow;

        this.baseElement = c;
    }
}
