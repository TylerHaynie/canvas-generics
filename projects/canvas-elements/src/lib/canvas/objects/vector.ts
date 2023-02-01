import { vec3 } from 'gl-matrix';

export class Vector {
    protected vector: vec3;

    public get x() {
        return <number>this.vector[0];
    }

    public get y() {
        return <number>this.vector[1];
    }

    public get z() {
        return <number>this.vector[2];
    }

    constructor(x: number, y: number, z: number = 0) {
        this.vector = vec3.fromValues(x, y, z);
    }

    public scaleBy(scaleAmount: number): void{
        vec3.scale(this.vector, this.vector, scaleAmount);
    }

    public distanceTo(other: Vector): number {
        return vec3.dist(this.vector, other.vector);
    }

    public set(x: number, y: number, z: number): void {
        vec3.set(this.vector, x, y, z);
    }
}
