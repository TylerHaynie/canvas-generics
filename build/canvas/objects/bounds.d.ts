import { Size } from 'canvas/models/size';
import { Vector2D } from 'canvas/objects/vector';
export declare class Bounds {
    private _x;
    readonly x: number;
    private _y;
    readonly y: number;
    private _width;
    readonly width: number;
    private _height;
    readonly height: number;
    constructor(v: Vector2D, size: Size);
    readonly topLeft: Vector2D;
    readonly topRight: Vector2D;
    readonly bottomLeft: Vector2D;
    readonly bottomRight: Vector2D;
    readonly topLength: number;
    readonly bottomLength: number;
    readonly left_height: number;
    readonly right_height: number;
}
//# sourceMappingURL=bounds.d.ts.map