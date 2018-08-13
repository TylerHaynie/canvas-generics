import { Size } from 'canvas/models/size';
import { Vector2D } from 'canvas/objects/vector';
export declare class ResizeProperty {
    private context;
    private position;
    private size;
    private topLeftCorner;
    private topRightCorner;
    private bottomRightCorner;
    private bottomLeftCorner;
    private leftMidRect;
    private rightMidRect;
    private topMidRect;
    private bottomMidRect;
    constructor(context: CanvasRenderingContext2D, position: Vector2D, size: Size);
    draw(): void;
    private buildMenu();
    mouseMove(e: any): void;
    mouseDown(e: any): void;
    private buildRect(context, position, size, color);
    private topCenterRect(context, bounds, cornerSize, color);
    private bottomCenterRect(context, bounds, cornerSize, color);
    private leftCenterRect(context, bounds, cornerSize, color);
    private rightCenterRect(context, bounds, cornerSize, color);
    private topLeftBottomRightCornerHover(e, element);
    private topRightBottomLeftCornerHover(e, element);
    private horizontalHovered(e, element);
    private verticalHovered(e, element);
}
