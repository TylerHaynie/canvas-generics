import { Vector2D } from 'canvas/objects/vector';
import { ShapeBase } from 'canvas/shapes/shape-base';
import { TextOptions } from 'canvas/shapes/text/models';
export declare class TextObject extends ShapeBase {
    textOptions: TextOptions;
    private _textOptions;
    readonly textWidth: number;
    constructor(context: CanvasRenderingContext2D, position: Vector2D, options?: TextOptions);
    private drawText;
}
