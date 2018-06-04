import { Vector } from '../objects/vector';
import { Size } from '../models/size';
export class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(point: Vector, size: Size) {
        this.x = point.x;
        this.y = point.y;
        this.width = size.width;
        this.height = size.height;
    }

    public get topLeft(): Vector {
        return <Vector>{ x: this.x, y: this.y };
    }
    public get topRight(): Vector {
        return <Vector>{ x: this.x + this.width, y: this.y };
    }
    public get bottomLeft(): Vector {
        return <Vector>{ x: this.x, y: this.y - this.height };
    }
    public get bottomRight(): Vector {
        return <Vector>{ x: this.x + this.width, y: this.y + this.height };
    }

    public get topLength(): number {
        return Math.max(this.topLeft.x, this.topRight.x) - Math.max(this.topLeft.x, this.topRight.x);
    }

    public get bottomLength(): number {
        return Math.max(this.bottomLeft.x, this.bottomRight.x) - Math.max(this.bottomLeft.x, this.bottomRight.x);
    }

    public get leftHeight(): number {
        return Math.max(this.topLeft.y, this.bottomLeft.y) - Math.max(this.topLeft.y, this.bottomLeft.y);
    }

    public get rightHeight(): number {
        return Math.max(this.topRight.y, this.bottomRight.y) - Math.max(this.topRight.y, this.bottomRight.y);
    }

}
