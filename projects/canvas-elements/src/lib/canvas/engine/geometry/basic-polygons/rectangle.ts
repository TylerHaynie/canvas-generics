import { Vector } from "../vector";
import { Polygon } from "../polygon";

export interface IVisibility {
    isVisible(): boolean;
}

export class Rectangle extends Polygon {
    private _size: Vector;
    private _vectorIndices: Int32Array = new Int32Array([-1, -1, -1, -1]);

    constructor(position: Vector, size: Vector = undefined) {
        super(position);
        this._size = size == undefined ? new Vector(1, 1, 0) : size
        this.buildPolygon();
        this.updateVectors();
    }

    private buildPolygon() {
        this._vectorIndices[0] = super.addVector(new Vector(0, 0));
        this._vectorIndices[1] = super.addVector(new Vector(0, 0));
        this._vectorIndices[2] = super.addVector(new Vector(0, 0));
        this._vectorIndices[3] = super.addVector(new Vector(0, 0));

        super.createEdge(this._vectorIndices[0], this._vectorIndices[1]);
        super.createEdge(this._vectorIndices[1], this._vectorIndices[2]);
        super.createEdge(this._vectorIndices[2], this._vectorIndices[3]);
        super.createEdge(this._vectorIndices[3], this._vectorIndices[0]);

        super.createFace([this._vectorIndices[0], this._vectorIndices[1], this._vectorIndices[2], this._vectorIndices[3]]);
    }

    public setSize(x: number, y: number) {
        this._size.setValues(x, y);
        this.updateVectors();
    }

    private updateVectors() {
        let pos = super.position;
        let halfX = (this._size.x / 2);
        let halfY = (this._size.y / 2);

        super.getVector(this._vectorIndices[0]).setValues(pos.x - halfX, pos.y + halfY);
        super.getVector(this._vectorIndices[1]).setValues(pos.x - halfX, pos.y - halfY);
        super.getVector(this._vectorIndices[2]).setValues(pos.x + halfX, pos.y - halfY);
        super.getVector(this._vectorIndices[3]).setValues(pos.x + halfX, pos.y + halfY);
    }
}