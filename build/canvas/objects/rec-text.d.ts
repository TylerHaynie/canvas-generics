import { TextOptions } from 'canvas/shapes/text-object';
import { Vector2D } from 'canvas/objects/vector';
import { DrawBase } from 'canvas/shapes/drawBase';
import { LineStyle } from 'canvas/models/line-style';
import { Size } from 'canvas/models/size';
import { Color } from 'canvas/models/color';
export declare class RecTextElement {
    name: string;
    textObject: DrawBase;
    RectangleObject: DrawBase;
}
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
export declare class RecText {
    private context;
    constructor(context: CanvasRenderingContext2D);
    create(pos: Vector2D, size: Size, text: TextOptions | string, recTextOptions?: RecTextOptions): RecTextElement;
    private createText;
    private createRectangle;
}
