import { Vector2D } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';

export class ShapeBase {
    private _context: CanvasRenderingContext2D;
    private _position: Vector2D;
    public get position(): Vector2D { return this._position; }
    public set position(position: Vector2D) {
        this._position = new Vector2D(Math.fround(position.x), Math.fround(position.y));
    }

    color: Color = undefined;
    outline: LineStyle = undefined;
    shadow: Shadow = undefined;

    constructor(context: CanvasRenderingContext2D, position: Vector2D) {
        this._context = context;
        this.position = position;

        this.color = new Color();
    }
}
