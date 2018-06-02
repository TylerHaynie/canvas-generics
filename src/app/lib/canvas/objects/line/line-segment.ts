import { iPoint } from '../../interfaces/iPoint';

export class LineSegment {
    startPoint: iPoint;
    points: iPoint[];

    constructor(startPoint: iPoint) {
        this.startPoint = startPoint;
        this.points = [];
    }

    addPoint(point: iPoint) {
        this.points.push(point);
    }
}
