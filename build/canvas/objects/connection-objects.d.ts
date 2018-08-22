import { Vector2D } from 'canvas/objects/vector';
import { Line } from 'canvas/shapes/line/line';
import { Color } from 'canvas/models/color';
import { LineStyle } from 'canvas/models/line-style';
import { Rectangle } from 'canvas/shapes/rectangle';
import { Size } from 'canvas/models/size';
import { DIRECTION } from 'canvas/enums';
export declare class ConnectionObjects {
    private context;
    constructor(context: CanvasRenderingContext2D);
    funnel(pos: Vector2D, direction: DIRECTION, gap: number, style: LineStyle): Line;
    filledArrow(pos: Vector2D, direction: DIRECTION, gap: number, style: LineStyle): Line;
    arrow(pos: Vector2D, direction: DIRECTION, gap: number, style: LineStyle, closePath?: boolean): Line;
    square(pos: Vector2D, size: Size, color: Color): Rectangle;
    private createArrow;
}
