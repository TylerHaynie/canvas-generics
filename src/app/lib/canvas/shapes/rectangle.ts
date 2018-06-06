import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { ShapeBase } from '@canvas/shapes/shape-base';

export class Corner {
    controlPoint: Vector;
    endingPoint: Vector;

    constructor(controlPoint: Vector, endingPoint: Vector) {
        this.controlPoint = controlPoint;
        this.endingPoint = endingPoint;
    }
}

export class Rectangle extends ShapeBase {

    //#region Public Properties

    public set size(v: Size) { this._size = v; }
    public get size(): Size { return this._size; }

    public set cornerRadius(v: number) { this._cornerRadius = v; }
    public get cornerRadius(): number { return this._cornerRadius; }


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

    public get topLineStart(): Vector {
        return new Vector(Math.fround(this.position.x + this._cornerRadius), Math.fround(this.position.y));
    }

    public get topLineEnd(): Vector {
        return new Vector(Math.fround(this.position.x + this._size.width - this._cornerRadius), Math.fround(this.position.y));
    }

    public get topRightCorner(): Corner {
        let cp = new Vector(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y));
        let ep = new Vector(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y + this._cornerRadius));
        return new Corner(cp, ep);
    }

    public get rightLineEnd(): Vector {
        return new Vector(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y + this._size.height - this._cornerRadius));
    }

    public get bottomRightCorner(): Corner {
        let cp = new Vector(Math.fround(this.position.x + this._size.width), Math.fround(this.position.y + this._size.height));
        let ep = new Vector(Math.fround(this.position.x + this._size.width - this._cornerRadius), Math.fround(this.position.y + this._size.height));
        return new Corner(cp, ep);
    }

    public get bottomLineEnd(): Vector {
        return new Vector(Math.fround(this.position.x + this._cornerRadius), Math.fround(this.position.y + this._size.height));
    }

    public get bottomLeftCorner(): Corner {
        let cp = new Vector(Math.fround(this.position.x), Math.fround(this.position.y + this._size.height));
        let ep = new Vector(Math.fround(this.position.x), Math.fround(this.position.y + this._size.height - this._cornerRadius));
        return new Corner(cp, ep);
    }

    public get leftLineEnd(): Vector {
        return new Vector(Math.fround(this.position.x), Math.fround(this.position.y + this._cornerRadius));
    }

    public get topLeftCorner(): Corner {
        let cp = new Vector(Math.fround(this.position.x), Math.fround(this.position.y));
        let ep = new Vector(Math.fround(this.position.x + this._cornerRadius), Math.fround(this.position.y));
        return new Corner(cp, ep);
    }

    //#endregion

    private _size: Size;
    private _cornerRadius: number = 2;

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context, position);
    }

    draw() {
        if (this.context) {
            if (this.position && this._size) {
                this.context.save();

                if (this._cornerRadius > 0) {
                    if (this._cornerRadius < Math.fround(this._size.width * 0.25) && this._cornerRadius < Math.fround(this._size.height * 0.25)) {
                        // radius is 25% or less the width or height of the rectangle
                        // it's large enough to draw the rounded corners
                        this.drawComplexRectangle();
                    }
                    else {
                        // radius is 25% or more the width or height of the rectangle
                        // save some number crunching and draw a basic rectangle
                        this.drawBasicRectangle();
                    }
                }
                else {
                    this.drawBasicRectangle();
                }

                // does it have a shadow
                if (this.shadow) {
                    this.context.shadowBlur = this.shadow.shadowBlur;
                    this.context.shadowColor = this.shadow.shadowColor;
                    this.context.shadowOffsetX = this.shadow.offsetX;
                    this.context.shadowOffsetY = this.shadow.offsetY;
                }

                // fill it
                if (this.color) {
                    this.context.globalAlpha = this.color.alpha;
                    this.context.fillStyle = this.color.shade;
                    this.context.fill();
                }

                // draw the outline
                if (this.outline) {

                    // reset shadow for line
                    this.context.shadowColor = '';
                    this.context.shadowBlur = 0;
                    this.context.shadowOffsetX = 0;
                    this.context.shadowOffsetY = 0;

                    this.context.lineWidth = this.outline.lineWidth;
                    this.context.globalAlpha = this.outline.alpha;
                    this.context.strokeStyle = this.outline.shade;
                    this.context.stroke();
                }

                this.context.restore();
            }
            else {
                console.warn('You are trying to draw a rectangle without one or all of the following properties: {position, size}');
            }
        }
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
        let tls = this.topLineStart;
        this.context.moveTo(tls.x, tls.y);

        // top line
        let tle = this.topLineEnd;
        this.context.lineTo(tle.x, tle.y);

        // top right corner
        let trc = this.topRightCorner;
        this.context.quadraticCurveTo(trc.controlPoint.x, trc.controlPoint.y, trc.endingPoint.x, trc.endingPoint.y);

        // right line
        let rle = this.rightLineEnd;
        this.context.lineTo(rle.x, rle.y);

        // bottom right corner
        let brc = this.bottomRightCorner;
        this.context.quadraticCurveTo(brc.controlPoint.x, brc.controlPoint.y, brc.endingPoint.x, brc.endingPoint.y);

        // bottom line
        let ble = this.bottomLineEnd;
        this.context.lineTo(ble.x, ble.y);

        // bottom left corner
        let blc = this.bottomLeftCorner;
        this.context.quadraticCurveTo(blc.controlPoint.x, blc.controlPoint.y, blc.endingPoint.x, blc.endingPoint.y);

        // left line
        let lle = this.leftLineEnd;
        this.context.lineTo(lle.x, lle.y);

        // top left corner
        let tlc = this.topLeftCorner;
        this.context.quadraticCurveTo(tlc.controlPoint.x, tlc.controlPoint.y, tlc.endingPoint.x, tlc.endingPoint.y);

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

}
