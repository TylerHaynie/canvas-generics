import { LineSegment } from 'canvas/shapes/line/line-segment';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { DrawBase } from 'canvas/shapes/draw-base';
export declare class Line extends DrawBase {
    private segments;
    private _autoClosePath;
    autoClosePath: boolean;
    private _style;
    style: LineStyle;
    private _shadow;
    shadow: Shadow;
    constructor(context: CanvasRenderingContext2D);
    addSegment(segment: LineSegment): void;
    addSegments(segments: LineSegment[]): void;
    private drawLine;
}
