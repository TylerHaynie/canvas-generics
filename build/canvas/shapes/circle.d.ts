import { Vector2D } from 'canvas/objects/vector';
import { ShapeBase } from 'canvas/shapes/shape-base';
export declare class Circle extends ShapeBase {
    radius: number;
    constructor(context: CanvasRenderingContext2D, position: Vector2D);
    private drawCircle;
    pointWithinBounds(point: Vector2D): boolean;
}
//# sourceMappingURL=circle.d.ts.map