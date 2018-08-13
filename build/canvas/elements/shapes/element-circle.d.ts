import { ElementBase } from 'canvas/elements/element-base';
import { Vector2D } from 'canvas/objects/vector';
export declare class ElementCircle extends ElementBase {
    radius: number;
    constructor(context: CanvasRenderingContext2D, position: Vector2D);
}
