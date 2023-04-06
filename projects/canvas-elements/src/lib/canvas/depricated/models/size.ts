export class Size {
    _width: number;
    _height: number;

    public get width(): number { return this._width; }
    public get height(): number { return this._height; }

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    setSize(width: number, height: number) {
        this._width = width;
        this._height = height;
    }
}
