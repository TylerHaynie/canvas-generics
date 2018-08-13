import { Vector2D } from 'canvas/objects/vector';
export declare class LineSegment {
    readonly points: Vector2D[];
    private _points;
    fillSegment: boolean;
    constructor(startPoint?: Vector2D, fillSegment?: boolean);
    addPoint(point: Vector2D): void;
    addPoints(points: Vector2D[]): void;
    removePoint(point: Vector2D): void;
    clearPoints(): void;
}
//# sourceMappingURL=line-segment.d.ts.map