import { vec2 } from 'gl-matrix';

export class Vector2D {
    vector: vec2;

    public get x() {
        return <number>this.vector[0];
    }
    public get y() {
        return <number>this.vector[1];
    }

    constructor(x: number, y: number) {
        this.vector = vec2.fromValues(x, y);
    }

}
