import { LineSegment } from 'canvas/shapes/line/line-segment';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { DrawBase } from 'canvas/shapes/draw-base';

export class Line extends DrawBase {
    private segments: LineSegment[] = [];
    autoClosePath: boolean = false;

    style: LineStyle;
    shadow?: Shadow;

    constructor(context: CanvasRenderingContext2D) {
        super(context, () => { this.drawLine(); });
        this.style = new LineStyle();
    }

    addSegment(segment: LineSegment) {
        this.segments.push(segment);
    }

    addSegments(segments: LineSegment[]) {
        segments.forEach(segment => {
            this.segments.push(segment);
        });
    }

    private drawLine() {
        if (this.context) {
            if (this.segments.length > 0) {
                this.context.save();

                // does it have a shadow
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

                // start the path
                this.context.beginPath();

                // each line segment
                this.segments.forEach(segment => {
                    if (!(segment.points.length > 0)) {
                        console.warn('The following segment in the line does not contain any points.');
                        console.warn('LineSegment', segment);
                        return;
                    }
                    // starting at the first point
                    this.context.moveTo(segment.points[0].x, segment.points[0].y);

                    // draw line to each point
                    segment.points.forEach(vector => {
                        this.context.lineTo(vector.x, vector.y);
                    });

                    // is the segment filled?
                    if (segment.fillSegment) {
                        // close and fill the path (+1 draw call)
                        this.context.closePath();
                        this.context.fill();

                        // start a new path
                        this.context.beginPath();
                    }
                });

                // close path
                if (this.autoClosePath) { this.context.closePath(); }

                // draw
                this.context.stroke();

                // restore context
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
