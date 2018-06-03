import { iVector } from '../../interfaces/iVector';
import { LineSegment } from './line-segment';
import { iLine } from '../../interfaces/iLine';

export class Line implements iLine {
    vector: iVector;
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
