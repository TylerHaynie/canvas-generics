import { Vector2D } from 'canvas/objects/vector';

export class LineSegment {

    public get points(): Vector2D[] { return this._points; }
    private _points: Vector2D[] = [];
    fillSegment: boolean;

    constructor(startPoint?: Vector2D, fillSegment?: boolean) {
        if (startPoint) { this._points.push(startPoint); }
        this.fillSegment = fillSegment || false;
    }

    addPoint(point: Vector2D) {
        this._points.push(point);
    }

    addPoints(points: Vector2D[]) {
        points.forEach(point => {
            this._points.push(point);
        });
    }

    removePoint(point: Vector2D) {
        let i = this._points.indexOf(point);
        this._points.splice(i, 1);
    }

    clearPoints() {
        this._points = [];
    }
}
