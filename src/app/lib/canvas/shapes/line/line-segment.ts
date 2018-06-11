import { Vector2D } from '@canvas/objects/vector';

export class LineSegment {
    startPosition: Vector2D;
    points: Vector2D[] = [];

    constructor(startPosition: Vector2D) {
        this.startPosition = startPosition;
    }

    addPoint(point: Vector2D) {
        this.points.push(point);
    }

    addPoints(points: Vector2D[]) {
        points.forEach(point => {
            this.points.push(point);
        });
    }
}
