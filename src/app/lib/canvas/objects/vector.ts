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

    public scale(scaleAmount: number): Vector2D {
        let resultVector: vec2;
        vec2.scale(resultVector, this.vector, scaleAmount);
        return new Vector2D(resultVector[0], resultVector[1]);
    }

    public subtract(other: Vector2D) {
        let outResult = vec2.create();
        vec2.sub(outResult, this.vector, other.vector);
        return outResult;
    }

    public distance(other: Vector2D) {
         let outResult = vec2.dist(this.vector, other.vector);
        return outResult;
    }

    // public set(x: number, y: number) {
    //     this.vector.set([x, y]);
    // }

}
