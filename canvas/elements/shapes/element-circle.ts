import { ElementBase } from 'canvas/elements/element-base';
import { Circle } from 'canvas/shapes/circle';
import { Vector2D } from 'canvas/objects/vector';

export class ElementCircle extends ElementBase {

    radius: number = 25;
    constructor(context: CanvasRenderingContext2D, position: Vector2D) {
        super(context);

        let c = new Circle(context, position);
        c.radius = this.radius;
        c.color = this.defaultColor;
        c.outline = this.defaultOutline;
        c.shadow = this.defaultShadow;

        this.baseElement = c;
    }
}
