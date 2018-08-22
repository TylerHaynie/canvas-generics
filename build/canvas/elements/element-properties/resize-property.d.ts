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
    private buildMenu;
    mouseMove(e: any): void;
    mouseDown(e: any): void;
    private buildRect;
    private topCenterRect;
    private bottomCenterRect;
    private leftCenterRect;
    private rightCenterRect;
    private topLeftBottomRightCornerHover;
    private topRightBottomLeftCornerHover;
    private horizontalHovered;
    private verticalHovered;
}
