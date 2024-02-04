import { vec3 } from 'gl-matrix';

export class Vector {
    private _vector: vec3;

    public get x() { return this._vector[0]; }
    public get y() { return this._vector[1]; }
    public get z() { return this._vector[2]; }

    public get value(): vec3 { return this._vector; }
    public get isZero(): boolean { return vec3.equals(this._vector, [0, 0, 0]); }
    public get isNotZero(): boolean { return !this.isZero; }

    constructor(x: number, y: number, z: number = 0) {
        this._vector = this.roundedVec(x, y, z);
    }

    public setValues(x: number, y: number, z: number = 0): void {
        vec3.set(this._vector, Math.fround(x), Math.fround(y), Math.fround(z));
    }

    public setVector(vector: Vector): void {
        vec3.set(this._vector, vector.x, vector.y, vector.z);
    }

    public add(vector: Vector) {
        vec3.add(this._vector, this._vector, vector.value);
    }

    public addValues(x: number, y: number, z: number = 0) {
        vec3.add(this._vector, this._vector, this.roundedVec(x, y, z));
    }

    public subtract(vector: Vector) {
        vec3.subtract(this._vector, this._vector, vector.value);
    }

    public subtractValues(x: number, y: number, z: number = 0) {
        vec3.subtract(this._vector, this._vector, this.roundedVec(x, y, z));
    }

    public scaleBy(scaleAmount: number): void {
        vec3.scale(this._vector, this._vector, scaleAmount);
    }

    public multiplyBy(amount: number): void {
        vec3.multiply(this._vector, this._vector, this.roundedVec(amount, amount, amount));
    }

    public distanceTo(target: Vector): number {
        return vec3.dist(this._vector, target.value);
    }

    public directionTo(target: Vector): Vector {
        let vec = vec3.subtract([0, 0, 0], target.value, this._vector);
        return new Vector(vec[0], vec[1], vec[2]);
    }

    private roundedVec(x: number, y: number, z: number = 0): vec3 {
        return vec3.fromValues(Math.fround(x), Math.fround(y), Math.fround(z))
    }
}
