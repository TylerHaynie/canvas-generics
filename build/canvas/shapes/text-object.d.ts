import { Vector2D } from 'canvas/objects/vector';
import { ShapeBase } from 'canvas/shapes/shape-base';
export declare enum ALIGNMENT {
    'START' = "start",
    'END' = "end",
    'LEFT' = "left",
    'RIGHT' = "right",
    'CENTER' = "center",
}
export declare enum BASELINE {
    'TOP' = "top",
    'HANGING' = "hanging",
    'MIDDLE' = "middle",
    'ALPHABETIC' = "alphabetic",
    'IDEOGRAPHIC' = "ideographic",
    'BOTTOM' = "bottom",
}
export declare enum DIRECTION {
    'LTR' = "ltr",
    'RTL' = "rtl",
    'INHERIT' = "inherit",
}
export declare enum FONT_STYLE {
    'NORMAL' = "normal",
    'ITALIC' = "italic",
    'OBLIQUE' = "oblique",
}
export declare enum FONT_VARIANT {
    'NORMAL' = "normal",
    'SMALL_CAPS' = "small-caps",
    'INITIAL' = "initial",
    'INHERIT' = "inherit",
}
export declare enum FONT_WEIGHT {
    'NORMAL' = "normal",
    'BOLD' = "bold",
    'BOLDER' = "bolder",
    'LIGHTER' = "lighter",
    'INITIAL' = "initial",
    'INHERIT' = "inherit",
    '*100' = "100",
    '*200' = "200",
    '*300' = "300",
    '*400' = "400",
    '*500' = "500",
    '*600' = "600",
    '*700' = "700",
    '*800' = "800",
    '*900' = "900",
}
export declare enum FONT_SIZE {
    'MEDIUM' = "medium",
    'XX_SMALL' = "xx-small",
    'X_SMALL' = "x-small",
    'SMALL' = "small",
    'LARGE' = "large",
    'X_LARGE' = "x-large",
    'XX_LARGE' = "xx-large",
    'SMALLER' = "smaller",
    'LARGER' = "larger",
    'LENGTH' = "length",
    'PERCENT' = "%",
    'INITIAL' = "initial",
    'INHERIT' = "inherit",
}
export declare enum LENGTH_UNIT {
    'EM' = "em",
    'EX' = "ex",
    'PERCENT' = "%",
    'PX' = "px",
    'CM' = "cm",
    'MM' = "mm",
    'IN' = "in",
    'PT' = "pt",
    'PC' = "pc",
}
export declare class FontSize {
    size: FONT_SIZE;
    length?: number;
    unit?: LENGTH_UNIT;
    readonly asString: string;
    constructor();
}
export declare class TextProperties {
    textAlign: ALIGNMENT;
    baseLine: BASELINE;
    direction: DIRECTION;
    constructor();
}
export declare class FontProperties {
    style: FONT_STYLE;
    variant: FONT_VARIANT;
    weight: FONT_WEIGHT;
    fontSize: FontSize;
    fontFamily: string[];
    readonly asString: string;
    constructor();
}
export declare class TextOptions {
    text: string;
    fontProperties: FontProperties;
    textProperties: TextProperties;
    maxWidth?: number;
    constructor(text?: string);
}
export declare class TextObject extends ShapeBase {
    textOptions: TextOptions;
    private _textOptions;
    readonly textWidth: number;
    constructor(context: CanvasRenderingContext2D, position: Vector2D, options?: TextOptions);
    private drawText();
}
