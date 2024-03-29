import { Shadow } from '../models/shadow';
import { v4 as uuidv4 } from 'uuid';
import { Vector } from '../../engine/geometry/vector';
import { Color } from '../../engine/models/color';
import { LineStyle } from '../models/line-style';

export class ShapeBase {
    private _id: string = uuidv4();
    public get id(): string { return this._id; }

    private _position: Vector;
    public get position(): Vector { return this._position; }
    public setPosition(x: number, y: number, z: number) {
        this._position.setValues(Math.fround(x), Math.fround(y), Math.fround(z));
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

    constructor(position: Vector) {
        this._position = position;
        this._color = new Color();
    }
}
