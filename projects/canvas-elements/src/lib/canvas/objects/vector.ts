import { vec2 } from 'gl-matrix';

export class Vector2D {
    protected vector: vec2;

    public get x() {
        return <number>this.vector[0];
    }
    public get y() {
        return <number>this.vector[1];
    }

    constructor(x: number, y: number) {
        this.vector = vec2.fromValues(x, y);
    }

    public scaleBy(scaleAmount: number): void{
        vec2.scale(this.vector, this.vector, scaleAmount);
    }

    public distanceTo(other: Vector2D): number {
        let outResult = vec2.dist(this.vector, other.vector);
        return outResult;
    }

    public set(x: number, y: number): void {
        vec2.set(this.vector, x, y);
    }
}
