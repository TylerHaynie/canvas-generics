import { Vector2D } from 'canvas/objects/vector';
import { Size } from 'canvas/models/size';
import { Color } from 'canvas/models/color';
export declare class QuadData {
    vector: Vector2D;
    size: Size;
    data: any;
    constructor(x: number, y: number, data?: any, size?: Size);
}
export declare class Boundary {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x: number, y: number, w: number, h: number);
    containsQuadData(dataPoint: QuadData): boolean;
    intersects(other: Boundary): boolean;
}
export declare class QuadTree {
    boundary: Boundary;
    capicity: number;
    dataPoints: QuadData[];
    isDivided: boolean;
    topLeft: QuadTree;
    topRight: QuadTree;
    bottomLeft: QuadTree;
    bottomRight: QuadTree;
    constructor(b: Boundary, c: number);
    insert(p: QuadData): boolean;
    private subdivide;
    searchBoundary(b: Boundary): QuadData[];
    reset(w: number, h: number): void;
    debugQuad(context: CanvasRenderingContext2D, color: Color, lineWidth?: number): void;
}
