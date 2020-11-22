import { LineSegment } from 'canvas/shapes/line/line-segment';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { DrawBase } from 'canvas/shapes/draw-base';

export class Line extends DrawBase {
    private segments: LineSegment[] = [];

    private _autoClosePath: boolean = false;
    public get autoClosePath(): boolean { return this._autoClosePath; }
    public set autoClosePath(v: boolean) {
        this._autoClosePath = v;
        this.isDirty = true;
    }

    private _style: LineStyle;
    public get style(): LineStyle { return this._style; }
    public set style(v: LineStyle) {
        this._style = v;
        this.isDirty = true;
    }

    private _shadow: Shadow;
    public get shadow(): Shadow { return this._shadow; }
    public set shadow(v: Shadow) {
        this._shadow = v;
        this.isDirty = true;
    }

    constructor(context: CanvasRenderingContext2D) {
        super(context, undefined, () => { this.drawLine(); });
        this.style = new LineStyle();
    }

    addSegment(segment: LineSegment) {
        this.segments.push(segment);

        this.isDirty = true;
    }

    addSegments(segments: LineSegment[]) {
        segments.forEach(segment => {
            this.segments.push(segment);
        });

        this.isDirty = true;
    }

    private drawLine() {
        if (this.segments.length > 0) {
            this._context.save();

            // does it have a shadow
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

            // start the path
            this._context.beginPath();

            // each line segment
            this.segments.forEach(segment => {
                if (!(segment.points.length > 0)) {
                    console.warn('The following segment in the line does not contain any points.');
                    console.warn('LineSegment', segment);
                    return;
                }
                // starting at the first point
                this._context.moveTo(segment.points[0].x, segment.points[0].y);

                // draw line to each point
                segment.points.forEach(vector => {
                    this._context.lineTo(vector.x, vector.y);
                });

                // is the segment filled?
                if (segment.fillSegment) {
                    // close and fill the path (+1 draw call)
                    this._context.closePath();
                    this._context.fill();

                    // start a new path
                    this._context.beginPath();
                }
            });

            // close path
            if (this.autoClosePath) { this._context.closePath(); }

            // draw
            this._context.stroke();

            // restore context
            // this._context.setTransform(1, 0, 0, 1, 0, 0);
            this._context.restore();
        }
        else {
            console.warn('You are trying to draw a line without any segments');
        }
    }
}
