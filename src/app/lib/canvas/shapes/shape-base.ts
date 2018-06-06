import { Vector } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';

export class ShapeBase {
    private _context: CanvasRenderingContext2D;
    public get context(): CanvasRenderingContext2D {
        return this._context;
    }

    private _position: Vector;
    public set position(position: Vector) {
        this._position = new Vector(Math.fround(position.x), Math.fround(position.y));
    }
    public get position(): Vector {
        return this._position;
    }

    color?: Color;
    outline?: LineStyle;
    shadow?: Shadow;

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        this._context = context;
        this.position = position;
    }
}
