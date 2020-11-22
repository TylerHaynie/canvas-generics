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

    private _color: Color;
    public get color(): Color { return this._color; }
    public set color(v: Color) {
        if (this._color == undefined) {
            this._color = new Color();
        }

        this._color = v;
    }

    private _outline: LineStyle;
    public get outline(): LineStyle { return this._outline; }
    public set outline(v: LineStyle) {
        if (this._outline == undefined) {
            this._outline = new LineStyle();
        }

        this._outline = v;
    }

    private _shadow: Shadow;
    public get shadow(): Shadow { return this._shadow; }
    public set shadow(v: Shadow) {
        if (this._shadow == undefined) {
            this._shadow = new Shadow();
        }

        this._shadow = v;
    }

    constructor(context: CanvasRenderingContext2D, position: Vector2D) {
        this._context = context;
        this._position = position;
    }
}
