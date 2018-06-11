import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { ShapeBase } from '@canvas/shapes/shape-base';
import { ViewChildDecorator } from '@angular/core';

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

export class Rectangle extends ShapeBase {

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
        return <Vector>{
            x: Math.fround(this.position.x - this._size.width / 2),
            y: Math.fround(this.position.y - this._size.height / 2)
        };
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
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context, position);
        this.context = context;
    }

    draw() {

        this.context.save();

        // craeate rectangle path
        if (this._endGap > 0) {
            this.drawComplexRectangle();
        }
        else {
            this.drawBasicRectangle();
        }

        // does it have a shadow
        if (this.shadow !== undefined) {
            this.context.shadowBlur = this.shadow.shadowBlur;
            this.context.shadowColor = this.shadow.shadowColor;
            this.context.shadowOffsetX = this.shadow.offsetX;
            this.context.shadowOffsetY = this.shadow.offsetY;
        }

        // fill it
        if (this.color !== undefined) {
            this.context.globalAlpha = this.color.alpha;
            this.context.fillStyle = this.color.shade;
            this.context.fill();
        }

        // draw the outline
        if (this.outline !== undefined) {

            // reset shadow for line
            this.context.shadowColor = '';
            this.context.shadowBlur = 0;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;

            this.context.lineWidth = this.outline.width;
            this.context.globalAlpha = this.outline.alpha;
            this.context.strokeStyle = this.outline.shade;
            this.context.stroke();
        }

        this.context.restore();
    }

    private drawBasicRectangle() {
        this.context.beginPath();

        // start
        this.context.moveTo(this.position.x, this.position.y);

        // top
        this.context.lineTo(this.position.x + this._size.width, this.position.y);

        // right
        this.context.lineTo(this.position.x + this._size.width, this.position.y + this._size.height);

        // bottom
        this.context.lineTo(this.position.x, this.position.y + this._size.height);

        // left
        this.context.lineTo(this.position.x, this.position.y);

        this.context.closePath();
    }

    private drawComplexRectangle() {
        this.context.beginPath();

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
        this.context.moveTo(topLine.p1.x, topLine.p1.y);
        this.context.lineTo(topLine.p2.x, topLine.p2.y);

        // top right corner
        if (this._roundedCorners) {
            this.context.quadraticCurveTo(trCorner.controlPoint.x, trCorner.controlPoint.y, trCorner.endingPoint.x, trCorner.endingPoint.y);
        }
        else {
            this.context.lineTo(trCorner.controlPoint.x - this._endGap, trCorner.controlPoint.y);
            this.context.lineTo(trCorner.endingPoint.x, trCorner.endingPoint.y);
        }

        // right line
        this.context.lineTo(rightLine.p1.x, rightLine.p1.y);
        this.context.lineTo(rightLine.p2.x, rightLine.p2.y);

        // bottom right corner
        if (this._roundedCorners) {
            this.context.quadraticCurveTo(brCorner.controlPoint.x, brCorner.controlPoint.y, brCorner.endingPoint.x, brCorner.endingPoint.y);
        }
        else {
            this.context.lineTo(brCorner.controlPoint.x - this._endGap, brCorner.controlPoint.y);
            this.context.lineTo(brCorner.endingPoint.x, brCorner.endingPoint.y);
        }

        // bottom line
        this.context.lineTo(bottomLine.p1.x, bottomLine.p1.y);
        this.context.lineTo(bottomLine.p2.x, bottomLine.p2.y);

        // bottom left corner
        if (this._roundedCorners) {
            this.context.quadraticCurveTo(blCorner.controlPoint.x, blCorner.controlPoint.y, blCorner.endingPoint.x, blCorner.endingPoint.y);
        }
        else {
            this.context.lineTo(blCorner.controlPoint.x + this._endGap, blCorner.controlPoint.y);
            this.context.lineTo(blCorner.endingPoint.x, blCorner.endingPoint.y);
        }

        // left line
        this.context.lineTo(leftLine.p1.x, leftLine.p1.y);
        this.context.lineTo(leftLine.p2.x, leftLine.p2.y);

        // top left corner
        if (this._roundedCorners) {
            this.context.quadraticCurveTo(tlCorner.controlPoint.x, tlCorner.controlPoint.y, tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }
        else {
            this.context.lineTo(tlCorner.controlPoint.x + this._endGap, tlCorner.controlPoint.y);
            this.context.lineTo(tlCorner.endingPoint.x, tlCorner.endingPoint.y);
        }

        this.context.closePath();
    }

    pointWithinBounds(point: Vector): boolean {
        let topLeft = this.topLeft;
        let bottomRight = this.bottomRight;

        if (point.x >= topLeft.x && point.x <= bottomRight.x) {
            if (point.y >= topLeft.y && point.y <= bottomRight.y) {
                return true;
            }
        }

        return false;
    }

    lineIntersects(other: { p1: Vector, p2: Vector }) {
        let intersects: Vector;
        // foreach line
        let tl = this.topLine;
        intersects = this.checkLineIntersection({ p1: tl.p1, p2: tl.p2 }, other);
        if (intersects) {
            return intersects;
        }

        let rl = this.rightLine;
        intersects = this.checkLineIntersection({ p1: rl.p1, p2: rl.p2 }, other);
        if (intersects) {
            return intersects;
        }

        let bl = this.bottomLine;
        intersects = this.checkLineIntersection({ p1: bl.p1, p2: bl.p2 }, other);
        if (intersects) {
            return intersects;
        }

        let ll = this.leftLine;
        intersects = this.checkLineIntersection({ p1: ll.p1, p2: ll.p2 }, other);
        if (intersects) {
            return intersects;
        }

        return;
    }

    // Returns 1 if the lines intersect, otherwise 0. In addition, if the lines
    // intersect the intersection point may be stored in the floats i_x and i_y.
    private checkLineIntersection(line1: { p1: Vector, p2: Vector }, line2: { p1: Vector, p2: Vector }) {
        let s1_x, s1_y;
        let s2_x, s2_y;

        s1_x = line1.p2.x - line1.p1.x;
        s1_y = line1.p2.y - line1.p1.y;
        s2_x = line2.p2.x - line2.p1.x;
        s2_y = line2.p2.y - line2.p1.y;

        let s, t;
        s = (-s1_y *
            (line1.p1.x - line2.p1.x) + s1_x *
            (line1.p1.y - line2.p1.y)) /
            (-s2_x * s1_y + s1_x * s2_y);

        t = (s2_x *
            (line1.p1.y - line2.p1.y) - s2_y *
            (line1.p1.x - line2.p1.x)) /
            (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            // Collision detected
            let i_x = line1.p1.x + (t * s1_x);
            let i_y = line1.p1.y + (t * s1_y);
            return new Vector(i_x, i_y);
        }

        return; // No collision
    }

}
