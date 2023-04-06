import { Vector } from '../../../engine/geometry/vector';

export class LineSegment {

    public get points(): Vector[] { return this._points; }
    private _points: Vector[] = [];

    private _fillSegment: boolean = false;
    public get fillSegment(): boolean { return this._fillSegment; }
    public set fillSegment(v: boolean) {
        this._fillSegment = v;
        // isDirty = true;
    }

    constructor(startPoint?: Vector) {
        if (startPoint) { this._points.push(startPoint); }
    }

    addPoint(point: Vector) {
        this._points.push(point);
    }

    addPoints(points: Vector[]) {
        points.forEach(point => {
            this._points.push(point);
        });
    }

    removePoint(point: Vector) {
        let i = this._points.indexOf(point);
        this._points.splice(i, 1);
    }

    clearPoints() {
        this._points = [];
    }
}
