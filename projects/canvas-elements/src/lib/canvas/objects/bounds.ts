import { Size } from '../models/size';
import { Vertex } from './vertex';

export class Bounds {
    private _x: number;
    public get x(): number { return this._x; }

    private _y: number;
    public get y(): number { return this._y; }

    private _width: number;
    public get width(): number { return this._width; }

    private _height: number;
    public get height(): number { return this._height; }

    constructor(v: Vertex, size: Size) {
        this._x = v.x;
        this._y = v.y;
        this._width = size.width;
        this._height = size.height;
    }

    public get topLeft(): Vertex {
        return new Vertex(this._x, this._y);
    }

    public get topRight(): Vertex {
        return new Vertex(this._x + this._width, this._y);
    }

    public get bottomLeft(): Vertex {
        return new Vertex(this._x, this._y + this._height);
    }

    public get bottomRight(): Vertex {
        return new Vertex(this._x + this._width, this._y + this._height);
    }

    // public get topLength(): number {
    //     return Math.max(this.topLeft.x, this.topRight.x) - Math.max(this.topLeft.x, this.topRight.x);
    // }

    // public get bottomLength(): number {
    //     return Math.max(this.bottomLeft.x, this.bottomRight.x) - Math.max(this.bottomLeft.x, this.bottomRight.x);
    // }

    // public get left_height(): number {
    //     return Math.max(this.topLeft.y, this.bottomLeft.y) - Math.max(this.topLeft.y, this.bottomLeft.y);
    // }

    // public get right_height(): number {
    //     return Math.max(this.topRight.y, this.bottomRight.y) - Math.max(this.topRight.y, this.bottomRight.y);
    // }
}
