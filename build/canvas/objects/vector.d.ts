import { vec2 } from 'gl-matrix';
export declare class Vector2D {
    protected vector: vec2;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    scale(scaleAmount: number): Vector2D;
    subtract(other: Vector2D): any;
    distance(other: Vector2D): any;
    move(x: number, y: number): this;
    positionOn(current: Vector2D): this;
}
