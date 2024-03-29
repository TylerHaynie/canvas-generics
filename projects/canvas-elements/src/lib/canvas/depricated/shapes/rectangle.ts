import { Vector } from '../../engine/geometry/vector';
import { IDrawable } from '../models/interfaces/idrawable';
import { Size } from '../models/size';
import { ShapeBase } from './shape-base';

export class Corner {
    private _controlPoint: Vector;
    public get controlPoint(): Vector { return this._controlPoint; }
    public set controlPoint(v: Vector) { this._controlPoint = v; }

    private _endingPoint: Vector;
    public get endingPoint(): Vector { return this._endingPoint; }
    public set endingPoint(v: Vector) { this._endingPoint = v; }

    constructor(_controlPoint: Vector, _endingPoint: Vector) {
        this._controlPoint = _controlPoint;
        this._endingPoint = _endingPoint;
    }
}

export class Rectangle extends ShapeBase implements IDrawable {

    //#region Public Properties

    public set size(v: Size) { this._size = v; }
    public get size(): Size { return this._size; }

    public set roundedCorners(v: boolean) { this._roundedCorners = v; }

    public get endGap(): number { return this._endGap; }
    public set endGap(v: number) {
        let limit = new Vector(this.size.width / 2, this.size.height / 2);

        if (v > limit.x || v > limit.y) {
            this._endGap = Math.min(limit.x, limit.y);
        }
        else if (v < 0) {
            this._endGap = 0;
        }
        else {
            this._endGap = v;
        }
    }

    public get center(): Vector {
        return new Vector(
            Math.fround(this.position.x - this._size.width / 2),
            Math.fround(this.position.y - this._size.height / 2)
        );
    }

    public get topLeft(): Vector {
        return this.position;
    }

    public get topRight(): Vector {
        return new Vector(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y));
    }

    public get bottomRight(): Vector {
        return new Vector(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y + this._size.height));
    }

    public get bottomLeft(): Vector {
        return new Vector(Math.fround(this.position.x), Math.fround(this.position.y + this._size.height));
    }

    public get topLine() {
        return {
            p1: new Vector(this.position.x + this._endGap, this.position.y),
            p2: new Vector(this.position.x + this.size.width - this._endGap, this.position.y)
        };
    }

    public get topRightCorner(): Corner {
        let cp = new Vector(this.position.x + this.size.width, this.position.y);
        let ep = new Vector(this.position.x + this.size.width, this.position.y + this._endGap);
        return new Corner(cp, ep);
    }

    public get rightLine() {
        return {
            p1: new Vector(this.position.x + this.size.width, this.position.y + this._endGap),
            p2: new Vector(this.position.x + this.size.width, this.position.y + this.size.height - this._endGap)
        };
    }

    public get bottomRightCorner(): Corner {

        let cp = new Vector(this.position.x + this._size.width, this.position.y + this._size.height);
        let ep = new Vector(this.position.x + this._size.width - this._endGap, this.position.y + this._size.height);

        return new Corner(cp, ep);
    }

    public get bottomLine() {
        return {
            p1: new Vector(this.position.x + this.size.width - this._endGap, this.position.y + this.size.height),
            p2: new Vector(this.position.x + this._endGap, this.position.y + this.size.height)
        };
    }

    public get bottomLeftCorner(): Corner {
        let cp = new Vector(this.position.x, this.position.y + this.size.height);
        let ep = new Vector(this.position.x, this.position.y + this.size.height - this._endGap);
        return new Corner(cp, ep);
    }

    public get leftLine() {
        return {
            p1: new Vector(this.position.x, this.position.y + this.size.height - this._endGap),
            p2: new Vector(this.position.x, this.position.y + this._endGap)
        };
    }

    public get topLeftCorner(): Corner {
        let cp = new Vector(this.position.x, this.position.y);
        let ep = new Vector(this.position.x + this._endGap, this.position.y);
        return new Corner(cp, ep);
    }

    //#endregion

    private _size: Size = new Size(50, 50);
    private _endGap: number = 0;
    private _roundedCorners: boolean = false;

    constructor(position: Vector) {
        super(position);
    }

    async draw(context: CanvasRenderingContext2D) {
        context.save();

        // create rectangle path
        if (this._endGap > 0) {
            this.drawComplexRectangle(context);
        }
        else {
            this.drawBasicRectangle(context);
        }

        // does it have a shadow
        if (this.shadow !== undefined) {
            // super.context.shadowBlur = this.shadow.shadowBlur;
            // super.context.shadowColor = this.shadow.shadowColor;
            context.shadowOffsetX = this.shadow.offsetX;
            context.shadowOffsetY = this.shadow.offsetY;
        }

        // fill it
        if (this.color !== undefined) {
            context.globalAlpha = this.color.alpha;
            context.fillStyle = this.color.shade;
            context.fill();
        }

        // draw the outline
        if (this.outline !== undefined) {

            // reset shadow for line
            context.shadowColor = '';
            context.shadowBlur = 0;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            context.lineWidth = this.outline.width;
            context.globalAlpha = this.outline.alpha;
            context.strokeStyle = this.outline.shade;
            context.stroke();
        }

        context.restore();
    }

    private drawBasicRectangle(context: CanvasRenderingContext2D ) {
        context.beginPath();

        // start
        context.moveTo(this.position.x, this.position.y);

        // top
        context.lineTo(this.position.x + this._size.width, this.position.y);

        // right
        context.lineTo(this.position.x + this._size.width, this.position.y + this._size.height);

        // bottom
        context.lineTo(this.position.x, this.position.y + this._size.height);

        // left
        context.lineTo(this.position.x, this.position.y);

        context.closePath();
    }

    private drawComplexRectangle(context: CanvasRenderingContext2D ) {
        context.beginPath();

        // top line start
        let topLine = this.topLine;
        let rightLine = this.rightLine;
        let bottomLine = this.bottomLine;
        let leftLine = this.leftLine;

        let trCorner = this.topRightCorner;
        let brCorner = this.bottomRightCorner;
        let blCorner = this.bottomLeftCorner;
        let tlCorner = this.topLeftCorner;

        // top line
        context.moveTo(topLine.p1.x, topLine.p1.y);
        context.lineTo(topLine.p2.x, topLine.p2.y);

        // top right corner
        if (this._roundedCorners) {
            context.quadraticCurveTo(trCorner.controlPoint.x, trCorner.controlPoint.y, trCorner.endingPoint.x, trCorner.endingPoint.y);
        }
        else {
            context.lineTo(trCorner.controlPoint.x - this._endGap, trCorner.controlPoint.y);
            context.lineTo(trCorner.endingPoint.x, trCorner.endingPoint.y);
        }

        // right line
        context.lineTo(rightLine.p1.x, rightLine.p1.y);
        context.lineTo(rightLine.p2.x, rightLine.p2.y);

        // bottom right corner
        if (this._roundedCorners) {
            context.quadraticCurveTo(brCorner.controlPoint.x, brCorner.controlPoint.y, brCorner.endingPoint.x, brCorner.endingPoint.y);
        }
        else {
            context.lineTo(brCorner.controlPoint.x - this._endGap, brCorner.controlPoint.y);
            context.lineTo(brCorner.endingPoint.x, brCorner.endingPoint.y);
        }

        // bottom line
        context.lineTo(bottomLine.p1.x, bottomLine.p1.y);
        context.lineTo(bottomLine.p2.x, bottomLine.p2.y);

        // bottom left corner
        if (this._roundedCorners) {
            context.quadraticCurveTo(blCorner.controlPoint.x, blCorner.controlPoint.y, blCorner.endingPoint.x, blCorner.endingPoint.y);
        }
        else {
            context.lineTo(blCorner.controlPoint.x + this._endGap, blCorner.controlPoint.y);
            context.lineTo(blCorner.endingPoint.x, blCorner.endingPoint.y);
        }

        // left line
        context.lineTo(leftLine.p1.x, leftLine.p1.y);
        context.lineTo(leftLine.p2.x, leftLine.p2.y);

        // top left corner
        if (this._roundedCorners) {
            context.quadraticCurveTo(tlCorner.controlPoint.x, tlCorner.controlPoint.y, tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }
        else {
            context.lineTo(tlCorner.controlPoint.x + this._endGap, tlCorner.controlPoint.y);
            context.lineTo(tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }

        context.closePath();
    }

    pointWithinBounds(v: Vector): boolean {
        let topLeft = this.topLeft;
        let bottomRight = this.bottomRight;

        if (v.x >= topLeft.x && v.x <= bottomRight.x) {
            if (v.y >= topLeft.y && v.y <= bottomRight.y) {
                return true;
            }
        }

        return false;
    }

    lineIntersects(other: { p1: Vector, p2: Vector }) {
        let segments = [];
        segments.push(this.topLine);
        segments.push(this.rightLine);
        segments.push(this.bottomLine);
        segments.push(this.leftLine);

        let closestIntersect: { intersection: Vector, param: number } = null;

        for (let i = 0; i < segments.length; i++) {
            let intersect = this.getIntersection(other, segments[i]);
            if (!intersect) { continue; }
            if (!closestIntersect || intersect.param < closestIntersect.param) {
                closestIntersect = intersect;
            }
        }

        return closestIntersect ? closestIntersect.intersection : undefined;
    }

    getIntersection(ray: { p1: Vector, p2: Vector }, segment: { p1: Vector, p2: Vector }) {
        // sources
        // https://www.youtube.com/watch?v=c065KoXooSw
        // https://ncase.me/sight-and-light/

        // RAY: Point + Direction * T1
        let r_px = ray.p1.x;
        let r_py = ray.p1.y;
        let r_dx = ray.p2.x - ray.p1.x;
        let r_dy = ray.p2.y - ray.p1.y;

        // SEGMENT: Point + Direction * T2
        let s_px = segment.p1.x;
        let s_py = segment.p1.y;
        let s_dx = segment.p2.x - segment.p1.x;
        let s_dy = segment.p2.y - segment.p1.y;

        // Are they parallel? If so, no intersect
        let r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        let s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag) { // Directions are the same.
            return null;
        }

        // Find T1 & T2
        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;


        if (T1 < 0) { return null; }            // no intersection
        if (T2 < 0 || T2 > 1) { return null; }  // no intersection

        // return point-of-intersection
        return {
            intersection: new Vector(
                r_px + r_dx * T1,
                r_py + r_dy * T1
            ),
            param: T1
        };

    }
}
