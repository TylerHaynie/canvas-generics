import { LineSegment } from './line-segment';
import { LineStyle } from '../../models/line-style';
import { Shadow } from '../../models/shadow';

export class Line {
    private context: CanvasRenderingContext2D;

    segments: LineSegment[] = [];
    style: LineStyle;
    shadow?: Shadow;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
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

    draw() {
        if (this.context) {
            if (this.segments.length > 0) {
                this.context.save();
                this.context.beginPath();

                this.segments.forEach(segment => {
                    if (!segment.startPosition || !(segment.points.length > 0)) {
                        console.warn('A segment in the line does not have one or all of the following properties: {startPosition, points}');
                        return;
                    }
                    this.context.moveTo(segment.startPosition.x, segment.startPosition.y);
                    segment.points.forEach(vector => {
                        this.context.lineTo(vector.x, vector.y);
                    });
                });

                // does it have a shadow
                if (this.shadow) {
                    this.context.shadowBlur = this.shadow.shadowBlur;
                    this.context.shadowColor = this.shadow.shadowColor;
                    this.context.shadowOffsetX = this.shadow.offsetX;
                    this.context.shadowOffsetY = this.shadow.offsetY;
                }

                this.context.lineWidth = this.style.lineWidth;
                this.context.strokeStyle = this.style.shade;
                this.context.globalAlpha = this.style.alpha;

                this.context.stroke();

                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.restore();
            }
            else {
                // console.warn('You are trying to draw a line without any segments');
            }
        }
        else {
            console.log('no context');
        }
    }
}
