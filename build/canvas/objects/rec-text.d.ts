import { Rectangle } from 'canvas/shapes/rectangle';
import { Vector2D } from 'canvas/objects/vector';
import { LineStyle } from 'canvas/models/line-style';
import { Size } from 'canvas/models/size';
import { Color } from 'canvas/models/color';
import { TextObject } from 'canvas/shapes/text/text-object';
import { TextOptions } from 'canvas/shapes/text/models';
import { DrawBase } from 'canvas/shapes/draw-base';
export declare class RecTextOptions {
    textColor: Color;
    recStyle: {
        startColor: string;
        endColor: string;
        alpha: number;
        outline: LineStyle;
    };
    paddingLeft: number;
    paddingRight: number;
    upperCaseFirstLetter: boolean;
    splitOnUpperCaseLetter: boolean;
    constructor();
    changeStyle(startColor: string, endColor: string, alpha?: number, outline?: LineStyle): void;
}
export declare class RecText extends DrawBase {
    readonly id: string;
    _id: string;
    _text: TextOptions | string;
    text: TextOptions | string;
    _size: Size;
    size: Size;
    _options: RecTextOptions;
    options: RecTextOptions;
    readonly rectangle: Rectangle;
    private _rectangle;
    readonly textObject: TextObject;
    private _textObject;
    constructor(context: CanvasRenderingContext2D, pos: Vector2D, size: Size, text: TextOptions | string, uid?: string, options?: RecTextOptions);
    draw(): void;
    private update;
    private createText;
    private createRectangle;
}
