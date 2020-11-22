import { Vector2D } from 'canvas/objects/vector';
import { Size } from 'canvas/models/size';
import { ShapeBase } from 'canvas/shapes/shape-base';

export class Corner {
    private _controlPoint: Vector2D;
    public get controlPoint(): Vector2D { return this._controlPoint; }
    public set controlPoint(v: Vector2D) { this._controlPoint = v; }

    private _endingPoint: Vector2D;
    public get endingPoint(): Vector2D { return this._endingPoint; }
    public set endingPoint(v: Vector2D) { this._endingPoint = v; }

    constructor(_controlPoint: Vector2D, _endingPoint: Vector2D) {
        this._controlPoint = _controlPoint;
        this._endingPoint = _endingPoint;
    }
}

export class Rectangle extends ShapeBase {

    //#region Public Properties

    private _size: Size = new Size(50, 50);
    public get size(): Size { return this._size; }
    public set size(v: Size) {
        this._size = v;
        this.isDirty = true;
    }

    private _roundedCorners: boolean = false;
    public set roundedCorners(v: boolean) {
        this._roundedCorners = v;
        this.isDirty = true;
    }

    private _endGap: number = 0;
    public get endGap(): number { return this._endGap; }
    public set endGap(v: number) {
        let limit = new Vector2D(Math.fround(this.size.width / 2), Math.fround(this.size.height / 2));

        if (v > limit.x || v > limit.y) {
            this._endGap = Math.min(limit.x, limit.y);
        }
        else if (v < 0) {
            this._endGap = 0;
        }
        else {
            this._endGap = v;
        }

        this.isDirty = true;
    }

    public get center(): Vector2D {
        return new Vector2D(
            this.position.x + Math.fround(this._size.width / 2),
            this.position.y + Math.fround(this._size.height / 2)
        );
    }

    public get topMiddle(){
        return new Vector2D(
            this.center.x,
            this.topLeft.y
        );
    }

    public get bottomMiddle(){
        return new Vector2D(
            this.center.x,
            this.bottomLeft.y
        );
    }

    public get leftMiddle(){
        return new Vector2D(
            this.topLeft.x,
            this.center.y
        );
    }

    public get rightMiddle(){
        return new Vector2D(
            this.topRight.x,
            this.center.y
        );
    }

    public get topLeft(): Vector2D {
        return this.position;
    }

    public get topRight(): Vector2D {
        return new Vector2D(this.position.x + this._size.width, this.position.y);
    }

    public get bottomRight(): Vector2D {
        return new Vector2D(this.position.x + this._size.width, this.position.y + this._size.height);
    }

    public get bottomLeft(): Vector2D {
        return new Vector2D(this.position.x, this.position.y + this._size.height);
    }

    public get topLine() {
        return {
            p1: new Vector2D(this.position.x + this._endGap, this.position.y),
            p2: new Vector2D(this.position.x + this.size.width - this._endGap, this.position.y)
        };
    }

    public get topRightCorner(): Corner {
        let cp = new Vector2D(this.position.x + this.size.width, this.position.y);
        let ep = new Vector2D(this.position.x + this.size.width, this.position.y + this._endGap);
        return new Corner(cp, ep);
    }

    public get rightLine() {
        return {
            p1: new Vector2D(this.position.x + this.size.width, this.position.y + this._endGap),
            p2: new Vector2D(this.position.x + this.size.width, this.position.y + this.size.height - this._endGap)
        };
    }

    public get bottomRightCorner(): Corner {

        let cp = new Vector2D(this.position.x + this._size.width, this.position.y + this._size.height);
        let ep = new Vector2D(this.position.x + this._size.width - this._endGap, this.position.y + this._size.height);

        return new Corner(cp, ep);
    }

    public get bottomLine() {
        return {
            p1: new Vector2D(this.position.x + this.size.width - this._endGap, this.position.y + this.size.height),
            p2: new Vector2D(this.position.x + this._endGap, this.position.y + this.size.height)
        };
    }

    public get bottomLeftCorner(): Corner {
        let cp = new Vector2D(this.position.x, this.position.y + this.size.height);
        let ep = new Vector2D(this.position.x, this.position.y + this.size.height - this._endGap);
        return new Corner(cp, ep);
    }

    public get leftLine() {
        return {
            p1: new Vector2D(this.position.x, this.position.y + this.size.height - this._endGap),
            p2: new Vector2D(this.position.x, this.position.y + this._endGap)
        };
    }

    public get topLeftCorner(): Corner {
        let cp = new Vector2D(this.position.x, this.position.y);
        let ep = new Vector2D(this.position.x + this._endGap, this.position.y);
        return new Corner(cp, ep);
    }

    //#endregion

    constructor(context: CanvasRenderingContext2D, position: Vector2D) {
        super(context, position, () => { this.drawRectangle(); });
    }

    private drawRectangle() {
        this._context.save();

        // craeate rectangle path
        if (this._endGap > 0) {
            this.drawComplexRectangle();
        }
        else {
            this.drawBasicRectangle();
        }

        // does it have a shadow
        if (this.shadow !== undefined) {
            this._context.shadowBlur = this.shadow.blur;
            this._context.shadowColor = this.shadow.shade;
            this._context.shadowOffsetX = this.shadow.offsetX;
            this._context.shadowOffsetY = this.shadow.offsetY;
        }

        // fill it
        if (this.color !== undefined) {
            this._context.globalAlpha = this.color.alpha;
            this._context.fillStyle = this.color.shade;
            this._context.fill();
        }

        // draw the outline
        if (this.outline !== undefined) {

            // reset shadow for line ( otherwise, the shadow would show on top of the rectangle)
            this._context.shadowColor = '';
            this._context.shadowBlur = 0;
            this._context.shadowOffsetX = 0;
            this._context.shadowOffsetY = 0;

            this._context.lineWidth = this.outline.width;
            this._context.globalAlpha = this.outline.alpha;
            this._context.strokeStyle = this.outline.shade;
            this._context.stroke();
        }

        this._context.restore();
    }

    private drawBasicRectangle() {
        this._context.beginPath();

        // start
        this._context.moveTo(this.position.x, this.position.y);

        // top
        this._context.lineTo(this.position.x + this._size.width, this.position.y);

        // right
        this._context.lineTo(this.position.x + this._size.width, this.position.y + this._size.height);

        // bottom
        this._context.lineTo(this.position.x, this.position.y + this._size.height);

        // left
        this._context.lineTo(this.position.x, this.position.y);

        this._context.closePath();
    }

    private drawComplexRectangle() {
        this._context.beginPath();

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
        this._context.moveTo(topLine.p1.x, topLine.p1.y);
        this._context.lineTo(topLine.p2.x, topLine.p2.y);

        // top right corner
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(trCorner.controlPoint.x, trCorner.controlPoint.y, trCorner.endingPoint.x, trCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(trCorner.controlPoint.x - this._endGap, trCorner.controlPoint.y);
            this._context.lineTo(trCorner.endingPoint.x, trCorner.endingPoint.y);
        }

        // right line
        this._context.lineTo(rightLine.p1.x, rightLine.p1.y);
        this._context.lineTo(rightLine.p2.x, rightLine.p2.y);

        // bottom right corner
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(brCorner.controlPoint.x, brCorner.controlPoint.y, brCorner.endingPoint.x, brCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(brCorner.controlPoint.x - this._endGap, brCorner.controlPoint.y);
            this._context.lineTo(brCorner.endingPoint.x, brCorner.endingPoint.y);
        }

        // bottom line
        this._context.lineTo(bottomLine.p1.x, bottomLine.p1.y);
        this._context.lineTo(bottomLine.p2.x, bottomLine.p2.y);

        // bottom left corner
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(blCorner.controlPoint.x, blCorner.controlPoint.y, blCorner.endingPoint.x, blCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(blCorner.controlPoint.x + this._endGap, blCorner.controlPoint.y);
            this._context.lineTo(blCorner.endingPoint.x, blCorner.endingPoint.y);
        }

        // left line
        this._context.lineTo(leftLine.p1.x, leftLine.p1.y);
        this._context.lineTo(leftLine.p2.x, leftLine.p2.y);

        // top left corner
        if (this._roundedCorners) {
            this._context.quadraticCurveTo(tlCorner.controlPoint.x, tlCorner.controlPoint.y, tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }
        else {
            this._context.lineTo(tlCorner.controlPoint.x + this._endGap, tlCorner.controlPoint.y);
            this._context.lineTo(tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }

        this._context.closePath();
    }

    pointWithinBounds(v: Vector2D): boolean {
        let topLeft = this.topLeft;
        let bottomRight = this.bottomRight;

        if (v.x >= topLeft.x && v.x <= bottomRight.x) {
            if (v.y >= topLeft.y && v.y <= bottomRight.y) {
                return true;
            }
        }

        return false;
    }

    lineIntersects(other: { p1: Vector2D, p2: Vector2D }) {
        let segments = [];
        let screenBounds = this._context.canvas.getBoundingClientRect();

        // screen lines
        let screenTop = {
            p1: new Vector2D(screenBounds.left, screenBounds.top),
            p2: new Vector2D(screenBounds.right, screenBounds.top)
        };

        let screenRight = {
            p1: new Vector2D(screenBounds.right, screenBounds.top),
            p2: new Vector2D(screenBounds.right, screenBounds.bottom)
        };

        let screenBottom = {
            p1: new Vector2D(screenBounds.right, screenBounds.bottom),
            p2: new Vector2D(screenBounds.left, screenBounds.bottom)
        };

        let screenLeft = {
            p1: new Vector2D(screenBounds.left, screenBounds.bottom),
            p2: new Vector2D(screenBounds.left, screenBounds.top)
        };

        segments.push(screenTop);
        segments.push(screenRight);
        segments.push(screenBottom);
        segments.push(screenLeft);

        segments.push(this.topLine);
        segments.push(this.rightLine);
        segments.push(this.bottomLine);
        segments.push(this.leftLine);

        let closestIntersect: { intersection: Vector2D, param: number } = null;

        for (let i = 0; i < segments.length; i++) {
            let intersect = this.getIntersection(other, segments[i]);
            if (!intersect) { continue; }
            if (!closestIntersect || intersect.param < closestIntersect.param) {
                closestIntersect = intersect;
            }
        }

        return closestIntersect ? closestIntersect.intersection : undefined;
    }

    getIntersection(ray: { p1: Vector2D, p2: Vector2D }, segment: { p1: Vector2D, p2: Vector2D }) {
        // top used research
        // https://www.youtube.com/watch?v=c065KoXooSw
        // https://ncase.me/sight-and-light/ - ended up using their equation. I tried a few of my own, but this worked best :(

        // RAY in parametric: Point + Direction*T1
        let r_px = ray.p1.x;
        let r_py = ray.p1.y;
        let r_dx = ray.p2.x - ray.p1.x;
        let r_dy = ray.p2.y - ray.p1.y;

        // SEGMENT in parametric: Point + Direction*T2
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

        // SOLVE FOR T1 & T2
        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        // Must be within parametic whatevers for RAY/SEGMENT
        if (T1 < 0) { return null; }
        if (T2 < 0 || T2 > 1) { return null; }

        // Return the POINT OF INTERSECTION
        return {
            intersection: new Vector2D(
                r_px + r_dx * T1,
                r_py + r_dy * T1
            ),
            param: T1
        };

    }

    // Returns 1 if the lines intersect, otherwise 0. In addition, if the lines
    // intersect the intersection point may be stored in the floats i_x and i_y.
    // private checkLineIntersection(line1: { p1: Vector, p2: Vector }, line2: { p1: Vector, p2: Vector }) {


    //     let s1x = line1.p2.x - line1.p1.x;
    //     let s1y = line1.p2.y - line1.p1.y;
    //     let s2x = line2.p2.x - line2.p1.x;
    //     let s2y = line2.p2.y - line2.p1.y;

    //     let s = (-s1y *
    //         (line1.p1.x - line2.p1.x) + s1x *
    //         (line1.p1.y - line2.p1.y)) /
    //         (-s2x * s1y + s1x * s2y);

    //     let t = (s2x *
    //         (line1.p1.y - line2.p1.y) - s2y *
    //         (line1.p1.x - line2.p1.x)) /
    //         (-s2x * s1y + s1x * s2y);

    //     if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    //         // Collision detected
    //         let ix = line1.p1.x + (t * s1x);
    //         let iy = line1.p1.y + (t * s1y);

    //         return { intersection: new Vector2D(ix, iy), t: t, s: s };
    //     }

    //     return; // No collision
    // }

}
