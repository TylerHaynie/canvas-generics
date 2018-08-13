"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const line_style_1 = require("canvas/models/line-style");
const drawBase_1 = require("canvas/shapes/drawBase");
class Line extends drawBase_1.DrawBase {
    constructor(context) {
        super(context, () => { this.drawLine(); });
        this.segments = [];
        this.autoClosePath = false;
        this.style = new line_style_1.LineStyle();
    }
    addSegment(segment) {
        this.segments.push(segment);
    }
    addSegments(segments) {
        segments.forEach(segment => {
            this.segments.push(segment);
        });
    }
    drawLine() {
        if (this.context) {
            if (this.segments.length > 0) {
                this.context.save();
                if (this.shadow) {
                    this.context.shadowBlur = this.shadow.blur;
                    this.context.shadowColor = this.shadow.shade;
                    this.context.shadowOffsetX = this.shadow.offsetX;
                    this.context.shadowOffsetY = this.shadow.offsetY;
                }
                this.context.lineWidth = this.style.width;
                this.context.strokeStyle = this.style.shade;
                this.context.globalAlpha = this.style.alpha;
                this.context.fillStyle = this.style.shade;
                this.context.beginPath();
                this.segments.forEach(segment => {
                    if (!(segment.points.length > 0)) {
                        console.warn('The following segment in the line does not contain any points.');
                        console.warn('LineSegment', segment);
                        return;
                    }
                    this.context.moveTo(segment.points[0].x, segment.points[0].y);
                    segment.points.forEach(vector => {
                        this.context.lineTo(vector.x, vector.y);
                    });
                    if (segment.fillSegment) {
                        this.context.closePath();
                        this.context.fill();
                        this.context.beginPath();
                    }
                });
                if (this.autoClosePath) {
                    this.context.closePath();
                }
                this.context.stroke();
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.restore();
            }
            else {
                console.warn('You are trying to draw a line without any segments');
            }
        }
        else {
            console.error('no context');
        }
    }
}
exports.Line = Line;
//# sourceMappingURL=line.js.map