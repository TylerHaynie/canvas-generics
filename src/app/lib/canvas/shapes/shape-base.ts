import { Vector2D } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { DrawBase } from '@canvas/shapes/drawBase';

export class ShapeBase extends DrawBase {
    private _position: Vector2D;

    public get position(): Vector2D { return this._position; }
    public set position(position: Vector2D) {
        this._position = new Vector2D(Math.fround(position.x), Math.fround(position.y));
    }

    private _outline: LineStyle = undefined;
    public get outline(): LineStyle { return this._outline; }
    public set outline(v: LineStyle) { this._outline = v; }

    private _shadow: Shadow = undefined;
    public get shadow(): Shadow { return this._shadow; }
    public set shadow(v: Shadow) { this._shadow = v; }

    public color: Color = new Color();

    constructor(context: CanvasRenderingContext2D, position: Vector2D, drawCallback: () => void) {
        super(context, drawCallback);
        this._position = position;
    }
}
