import { LineStyle } from '../../models/line-style';
import { Shadow } from '../../models/shadow';
import { LineSegment } from './line-segment';

export class Line {
    private context: CanvasRenderingContext2D;

    private segments: LineSegment[] = [];

    private _style: LineStyle;
    public get style(): LineStyle { return this._style; }
    public set style(v: LineStyle) {
        if (!this._style) {
            this._style = new LineStyle();
        }

        this._style = v;
    }

    private _shadow: Shadow;
    public get shadow(): Shadow { return this._shadow; }
    public set shadow(v: Shadow) {
        if (!this._style) {
            this._style = new LineStyle();
        }

        this._shadow = v;
    }

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
                    if (!segment || !(segment.points.length > 0)) {
                        console.warn('A segment in the line does not have one or all of the following properties: {startPosition, points}');
                        return;
                    }
                    this.context.moveTo(segment.points[0].x, segment.points[0].y);
                    for (let i = 1; i < segment.points.length; i++) {
                        this.context.lineTo(segment.points[i].x, segment.points[i].y);
                    }
                });

                // does it have a shadow
                if (this.shadow) {
                    // this.context.shadowBlur = this.shadow.shadowBlur;
                    // this.context.shadowColor = this.shadow.shadowColor;
                    this.context.shadowOffsetX = this.shadow.offsetX;
                    this.context.shadowOffsetY = this.shadow.offsetY;
                }

                this.context.lineWidth = this.style.width;
                this.context.strokeStyle = this.style.shade;
                this.context.globalAlpha = this.style.alpha;

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
