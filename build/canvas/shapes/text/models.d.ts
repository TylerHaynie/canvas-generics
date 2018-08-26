import { FONT_SIZE, LENGTH_UNIT } from 'canvas/enums';
import { ALIGNMENT, BASELINE, DIRECTION, FONT_STYLE, FONT_VARIANT, FONT_WEIGHT } from 'canvas/enums';
export declare class FontSize {
    size: FONT_SIZE;
    length?: number;
    unit?: LENGTH_UNIT;
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
