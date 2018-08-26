import { Vector2D } from 'canvas/objects/vector';
import { Color } from 'canvas/models/color';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { DrawBase } from 'canvas/shapes/draw-base';
export declare class ShapeBase extends DrawBase {
    private _outline;
    outline: LineStyle;
    private _shadow;
    shadow: Shadow;
    _color: Color;
    color: Color;
    constructor(context: CanvasRenderingContext2D, position: Vector2D, drawCallback: () => void);
}
