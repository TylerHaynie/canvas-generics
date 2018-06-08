import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Rectangle } from '@canvas/shapes/rectangle';
import { ElementBase } from '@canvas/elements/element-base';

export class ElementRect extends ElementBase {

    _cornerRadius: number = 0;
    public set cornerRadius(v: number) { (<Rectangle>this.baseElement).cornerRadius = v; }
    public set size(v: Size) { (<Rectangle>this.baseElement).size = v; }
    public get size(): Size { return (<Rectangle>this.baseElement).size; }

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context);

        let r = new Rectangle(context, position);
        r.size = new Size(50, 50);
        r.cornerRadius = this._cornerRadius;

        this.baseElement = r;
    }
}
