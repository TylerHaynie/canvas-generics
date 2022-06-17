import { Vector2D } from '../../objects/vector';
import { Circle } from '../../shapes/circle';
import { ElementBase } from '../element-base';

export class ElementCircle extends ElementBase {
    radius: number = 25;
    constructor(position: Vector2D) {
        super();

        let c = new Circle(position);
        c.radius = this.radius;
        c.color = this.defaultColor;
        c.outline = this.defaultOutline;
        c.shadow = this.defaultShadow;

        this.shape = c;
    }
}