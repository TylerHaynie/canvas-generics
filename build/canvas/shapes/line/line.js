"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const line_style_1 = require("canvas/models/line-style");
const draw_base_1 = require("canvas/shapes/draw-base");
class Line extends draw_base_1.DrawBase {
    constructor(context) {
        super(context, undefined, () => { this.drawLine(); });
        this.segments = [];
        this._autoClosePath = false;
        this.style = new line_style_1.LineStyle();
    }
    get autoClosePath() { return this._autoClosePath; }
    set autoClosePath(v) {
        this._autoClosePath = v;
        this.isDirty = true;
    }
    get style() { return this._style; }
    set style(v) {
        this._style = v;
        this.isDirty = true;
    }
    get shadow() { return this._shadow; }
    set shadow(v) {
        this._shadow = v;
        this.isDirty = true;
    }
    addSegment(segment) {
        this.segments.push(segment);
        this.isDirty = true;
    }
    addSegments(segments) {
        segments.forEach(segment => {
            this.segments.push(segment);
        });
        this.isDirty = true;
    }
    drawLine() {
        if (this.segments.length > 0) {
            this._context.save();
            if (this.shadow) {
                this._context.shadowBlur = this.shadow.blur;
                this._context.shadowColor = this.shadow.shade;
                this._context.shadowOffsetX = this.shadow.offsetX;
                this._context.shadowOffsetY = this.shadow.offsetY;
            }
            this._context.lineWidth = this.style.width;
            this._context.strokeStyle = this.style.shade;
            this._context.globalAlpha = this.style.alpha;
            this._context.fillStyle = this.style.shade;
            this._context.beginPath();
            this.segments.forEach(segment => {
                if (!(segment.points.length > 0)) {
                    console.warn('The following segment in the line does not contain any points.');
                    console.warn('LineSegment', segment);
                    return;
                }
                this._context.moveTo(segment.points[0].x, segment.points[0].y);
                segment.points.forEach(vector => {
                    this._context.lineTo(vector.x, vector.y);
                });
                if (segment.fillSegment) {
                    this._context.closePath();
                    this._context.fill();
                    this._context.beginPath();
                }
            });
            if (this.autoClosePath) {
                this._context.closePath();
            }
            this._context.stroke();
            this._context.setTransform(1, 0, 0, 1, 0, 0);
            this._context.restore();
        }
        else {
            console.warn('You are trying to draw a line without any segments');
        }
    }
}
exports.Line = Line;
//# sourceMappingURL=line.js.map