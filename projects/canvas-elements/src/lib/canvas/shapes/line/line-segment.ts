import { Vertex } from '../../objects/vertex';

export class LineSegment {

    public get points(): Vertex[] { return this._points; }
    private _points: Vertex[] = [];

    private _fillSegment: boolean = false;
    public get fillSegment(): boolean { return this._fillSegment; }
    public set fillSegment(v: boolean) {
        this._fillSegment = v;
        // isDirty = true;
    }

    constructor(startPoint?: Vertex) {
        if (startPoint) { this._points.push(startPoint); }
    }

    addPoint(point: Vertex) {
        this._points.push(point);
    }

    addPoints(points: Vertex[]) {
        points.forEach(point => {
            this._points.push(point);
        });
    }

    removePoint(point: Vertex) {
        let i = this._points.indexOf(point);
        this._points.splice(i, 1);
    }

    clearPoints() {
        this._points = [];
    }
}
