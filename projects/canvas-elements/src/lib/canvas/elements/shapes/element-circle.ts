import { Vertex } from '../../objects/vertex';
import { Circle } from '../../shapes/circle';
import { ElementBase } from '../element-base';

export class ElementCircle extends ElementBase {
    radius: number = 25;
    constructor(position: Vertex) {
        super();

        let c = new Circle(position);
        c.radius = this.radius;
        c.color = this.defaultColor;
        c.outline = this.defaultOutline;
        c.shadow = this.defaultShadow;

        this.shape = c;
    }
}