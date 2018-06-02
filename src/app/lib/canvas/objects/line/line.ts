import { iPoint } from '../../interfaces/iPoint';
import { LineSegment } from './line-segment';
import { iLine } from '../../interfaces/iLine';

export class Line implements iLine {
    point: iPoint;
    segments: LineSegment[] = [];

    lineWidth: number;
    color: string | CanvasGradient | CanvasPattern;
    alpha: number;
    modifiedAlpha?: number;

    constructor() { }

    addSegment(segment: LineSegment) {
        this.segments.push(segment);
    }
}
