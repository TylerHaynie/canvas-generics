import { InteractiveElement } from '@canvas/user-interface/elements/interactive-element';
import { Vector } from '@canvas/objects/vector';
import { Circle } from '@canvas/shapes/circle';

export class CircularUIElement extends InteractiveElement {

    radius: number = 25;

    icon?: HTMLImageElement;
    text?: string;

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context, position);

        let c = new Circle(this.context, this.position);
        c.radius = this.radius;
        c.color = this.activeColor;
        c.outline = this.activeOutline;
        c.shadow = this.activeShadow;

        this.baseElement = c;
    }
}
