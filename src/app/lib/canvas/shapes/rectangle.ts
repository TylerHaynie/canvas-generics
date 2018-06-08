import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { ShapeBase } from '@canvas/shapes/shape-base';

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

    private _size: Size = new Size(50, 50);
    private _cornerRadius: number = 0;
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context, position);
        this.context = context;
    }

    draw() {

        this.context.save();

        // craeate rectangle path
        // *important* dont not add a corner radius to a tiny ractangle. you are just hurting yourself
        if (this._cornerRadius > 0) {
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
        let tls = this.topLineStart;
        this.context.moveTo(tls.x, tls.y);

        // top line
        let tle = this.topLineEnd;
        this.context.lineTo(tle.x, tle.y);

        // top right corner
        let trc = this.topRightCorner;
        this.context.quadraticCurveTo(trc._controlPoint.x, trc._controlPoint.y, trc._endingPoint.x, trc._endingPoint.y);

        // right line
        let rle = this.rightLineEnd;
        this.context.lineTo(rle.x, rle.y);

        // bottom right corner
        let brc = this.bottomRightCorner;
        this.context.quadraticCurveTo(brc._controlPoint.x, brc._controlPoint.y, brc._endingPoint.x, brc._endingPoint.y);

        // bottom line
        let ble = this.bottomLineEnd;
        this.context.lineTo(ble.x, ble.y);

        // bottom left corner
        let blc = this.bottomLeftCorner;
        this.context.quadraticCurveTo(blc._controlPoint.x, blc._controlPoint.y, blc._endingPoint.x, blc._endingPoint.y);

        // left line
        let lle = this.leftLineEnd;
        this.context.lineTo(lle.x, lle.y);

        // top left corner
        let tlc = this.topLeftCorner;
        this.context.quadraticCurveTo(tlc._controlPoint.x, tlc._controlPoint.y, tlc._endingPoint.x, tlc._endingPoint.y);

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
