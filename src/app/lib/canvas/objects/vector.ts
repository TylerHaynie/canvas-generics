import { vec2 } from 'gl-matrix';

export class Vector2D {
    private _vector: vec2;

    public get x() {
        return <number>this._vector[0];
    }
    public get y() {
        return <number>this._vector[1];
    }

    constructor(x: number, y: number) {
        this._vector = vec2.fromValues(x, y);
    }

}
