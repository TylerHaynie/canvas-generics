import { Vector2D } from 'canvas/objects/vector';
import { Size } from 'canvas/models/size';
import { ElementBase } from 'canvas/elements/element-base';
export declare class ElementRect extends ElementBase {
    private allowResize;
    endGap: number;
    size: Size;
    constructor(context: CanvasRenderingContext2D, position: Vector2D);
    private setupBaseElement(context, position);
    private elementMoved(e);
    buildMenus(): void;
}
