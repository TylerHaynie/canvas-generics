import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Rectangle } from '@canvas/shapes/rectangle';
import { InteractiveElement } from '@canvas/user-interface/element/interactive-element';

export class RectangularUIElement extends InteractiveElement {

    _cornerRadius: number = 0;
    public set cornerRadius(v: number) {
        (<Rectangle>this.baseElement).cornerRadius = v;
    }
    size: Size = new Size(50, 50);

    icon?: HTMLImageElement;
    text?: string;

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context, position);

        let r = new Rectangle(this.context, this.position);
        r.size = this.size;
        r.cornerRadius = this._cornerRadius;

        this.baseElement = r;
    }
}
