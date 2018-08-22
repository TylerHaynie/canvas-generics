import { LineSegment } from 'canvas/shapes/line/line-segment';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { DrawBase } from 'canvas/shapes/drawBase';
export declare class Line extends DrawBase {
    private segments;
    autoClosePath: boolean;
    style: LineStyle;
    shadow?: Shadow;
    constructor(context: CanvasRenderingContext2D);
    addSegment(segment: LineSegment): void;
    addSegments(segments: LineSegment[]): void;
    private drawLine;
}
