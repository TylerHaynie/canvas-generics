import { Vector2D } from 'canvas/objects/vector';
import { Color } from 'canvas/models/color';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { DrawBase } from 'canvas/shapes/drawBase';
export declare class ShapeBase extends DrawBase {
    private _position;
    position: Vector2D;
    private _outline;
    outline: LineStyle;
    private _shadow;
    shadow: Shadow;
    color: Color;
    constructor(context: CanvasRenderingContext2D, position: Vector2D, drawCallback: () => void);
}
//# sourceMappingURL=shape-base.d.ts.map