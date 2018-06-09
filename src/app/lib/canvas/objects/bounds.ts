import { Size } from '@canvas/models/size';
import { Vector } from '@canvas/objects/vector';

export class Bounds {
    private _x: number;
    public get x(): number { return this._x; }

    private _y: number;
    public get y(): number { return this._y; }

    private _width: number;
    public get width(): number { return this._width; }

    private _height: number;
    public get height(): number { return this._height; }

    constructor(point: Vector, size: Size) {
        this._x = point.x;
        this._y = point.y;
        this._width = size.width;
        this._height = size.height;
    }

    public get topLeft(): Vector {
        return <Vector>{ x: this._x, y: this._y };
    }

    public get topRight(): Vector {
        return <Vector>{ x: this._x + this._width, y: this._y };
    }

    public get bottomLeft(): Vector {
        return <Vector>{ x: this._x, y: this._y + this._height };
    }

    public get bottomRight(): Vector {
        return <Vector>{ x: this._x + this._width, y: this._y + this._height };
    }

    public get topLength(): number {
        return Math.max(this.topLeft.x, this.topRight.x) - Math.max(this.topLeft.x, this.topRight.x);
    }

    public get bottomLength(): number {
        return Math.max(this.bottomLeft.x, this.bottomRight.x) - Math.max(this.bottomLeft.x, this.bottomRight.x);
    }

    public get left_height(): number {
        return Math.max(this.topLeft.y, this.bottomLeft.y) - Math.max(this.topLeft.y, this.bottomLeft.y);
    }

    public get right_height(): number {
        return Math.max(this.topRight.y, this.bottomRight.y) - Math.max(this.topRight.y, this.bottomRight.y);
    }
}
