import { Color } from '../models/color';
import { LineStyle } from '../models/line-style';
import { Shadow } from '../models/shadow';
import { Vector2D } from '../objects/vector';
import { v4 as uuidv4 } from 'uuid';

export class ShapeBase {
    private _id: string = uuidv4();
    public get id(): string { return this._id; }

    private _position: Vector2D;
    public get position(): Vector2D { return this._position; }
    public setPosition(x: number, y: number) {
        this._position.set(Math.fround(x), Math.fround(y));
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

    constructor(position: Vector2D) {
        this._position = position;
        this._color = new Color();
    }
}
