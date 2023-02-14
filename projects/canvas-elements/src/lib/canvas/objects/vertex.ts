import { vec3 } from 'gl-matrix';

export class Vertex {
    private _vertex: vec3;

    public get x() { return this._vertex[0]; }
    public get y() { return this._vertex[1]; }
    public get z() { return this._vertex[2]; }
    public get value(): vec3 { return this._vertex; }

    constructor(x: number, y: number, z: number = 0) {
        this._vertex = vec3.fromValues(x, y, z);
    }

    public scaleBy(scaleAmount: number): void {
        vec3.scale(this._vertex, this._vertex, scaleAmount);
    }

    public distanceTo(other: Vertex): number {
        return vec3.dist(this._vertex, other.value);
    }

    public setValues(x: number, y: number, z: number): void {
        vec3.set(this._vertex, Math.fround(x), Math.fround(y), Math.fround(z));
    }

    public set(vector: Vertex): void {
        vec3.set(this._vertex, vector.x, vector.y, vector.z);
    }
}
