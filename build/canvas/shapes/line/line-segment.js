"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LineSegment {
    constructor(startPoint) {
        this._points = [];
        this._fillSegment = false;
        if (startPoint) {
            this._points.push(startPoint);
        }
    }
    get points() { return this._points; }
    get fillSegment() { return this._fillSegment; }
    set fillSegment(v) {
        this._fillSegment = v;
    }
    addPoint(point) {
        this._points.push(point);
    }
    addPoints(points) {
        points.forEach(point => {
            this._points.push(point);
        });
    }
    removePoint(point) {
        let i = this._points.indexOf(point);
        this._points.splice(i, 1);
    }
    clearPoints() {
        this._points = [];
    }
}
exports.LineSegment = LineSegment;
//# sourceMappingURL=line-segment.js.map