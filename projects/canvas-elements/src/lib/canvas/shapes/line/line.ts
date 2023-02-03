import { IDrawable } from '../../models/interfaces/idrawable';
import { LineStyle } from '../../models/line-style';
import { Shadow } from '../../models/shadow';
import { LineSegment } from './line-segment';

export class Line implements IDrawable {
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

    constructor() {
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

    async draw(context: CanvasRenderingContext2D) {
        if (context) {
            if (this.segments.length > 0) {
                context.save();
                context.beginPath();

                this.segments.forEach(segment => {
                    if (!segment || !(segment.points.length > 0)) {
                        console.warn('A segment in the line does not have one or all of the following properties: {startPosition, points}');
                        return;
                    }
                    context.moveTo(segment.points[0].x, segment.points[0].y);
                    for (let i = 1; i < segment.points.length; i++) {
                        context.lineTo(segment.points[i].x, segment.points[i].y);
                    }
                });

                // does it have a shadow
                if (this.shadow) {
                    // context.shadowBlur = this.shadow.shadowBlur;
                    context.shadowColor = this.shadow.shade;
                    context.shadowOffsetX = this.shadow.offsetX;
                    context.shadowOffsetY = this.shadow.offsetY;
                }

                context.lineWidth = this.style.width;
                context.strokeStyle = this.style.shade;
                context.globalAlpha = this.style.alpha;

                context.stroke();

                context.setTransform(1, 0, 0, 1, 0, 0);
                context.restore();
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
