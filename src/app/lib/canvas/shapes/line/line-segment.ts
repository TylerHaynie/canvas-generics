import { Vector } from '@canvas/objects/vector';

export class LineSegment {
    startPosition: Vector;
    points: Vector[] = [];

    constructor(startPosition: Vector) {
        this.startPosition = startPosition;
    }

    addPoint(point: Vector) {
        this.points.push(point);
    }

    addPoints(points: Vector[]) {
        points.forEach(point => {
            this.points.push(point);
        });
    }
}
