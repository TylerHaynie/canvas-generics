import { Vector2D } from '../../objects/vector';

export class LineSegment {

    public get points(): Vector2D[] { return this._points; }
    private _points: Vector2D[] = [];

    private _fillSegment: boolean = false;
    public get fillSegment(): boolean { return this._fillSegment; }
    public set fillSegment(v: boolean) {
        this._fillSegment = v;
        // isDirty = true;
    }

    constructor(startPoint?: Vector2D) {
        if (startPoint) { this._points.push(startPoint); }
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
