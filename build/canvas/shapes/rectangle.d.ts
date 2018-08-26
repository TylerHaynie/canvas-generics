import { Vector2D } from 'canvas/objects/vector';
import { Size } from 'canvas/models/size';
import { ShapeBase } from 'canvas/shapes/shape-base';
export declare class Corner {
    private _controlPoint;
    controlPoint: Vector2D;
    private _endingPoint;
    endingPoint: Vector2D;
    constructor(_controlPoint: Vector2D, _endingPoint: Vector2D);
}
export declare class Rectangle extends ShapeBase {
    private _size;
    size: Size;
    private _roundedCorners;
    roundedCorners: boolean;
    private _endGap;
    endGap: number;
    readonly center: Vector2D;
    readonly topLeft: Vector2D;
    readonly topRight: Vector2D;
    readonly bottomRight: Vector2D;
    readonly bottomLeft: Vector2D;
    readonly topLine: {
        p1: Vector2D;
        p2: Vector2D;
    };
    readonly topRightCorner: Corner;
    readonly rightLine: {
        p1: Vector2D;
        p2: Vector2D;
    };
    readonly bottomRightCorner: Corner;
    readonly bottomLine: {
        p1: Vector2D;
        p2: Vector2D;
    };
    readonly bottomLeftCorner: Corner;
    readonly leftLine: {
        p1: Vector2D;
        p2: Vector2D;
    };
    readonly topLeftCorner: Corner;
    constructor(context: CanvasRenderingContext2D, position: Vector2D);
    private drawRectangle;
    private drawBasicRectangle;
    private drawComplexRectangle;
    pointWithinBounds(v: Vector2D): boolean;
    lineIntersects(other: {
        p1: Vector2D;
        p2: Vector2D;
    }): Vector2D;
    getIntersection(ray: {
        p1: Vector2D;
        p2: Vector2D;
    }, segment: {
        p1: Vector2D;
        p2: Vector2D;
    }): {
        intersection: Vector2D;
        param: number;
    };
}
