import { Vertex } from "../../objects/vertex";
import { Polygon } from "../polygon";

export class Rectangle extends Polygon {
    private _size: Vertex;

    constructor(position: Vertex, size: Vertex = undefined) {
        super(position);
        this._size = size == undefined ? new Vertex(1, 1, 0) : size
        this.buildPolygon();
    }

    private buildPolygon() {
        let pos = super.position;
        let halfX = (this._size.x / 2);
        let halfY = (this._size.y / 2);

        let v1Index = super.addVertex(new Vertex(pos.x - halfX, pos.y + halfY));
        let v2Index = super.addVertex(new Vertex(pos.x - halfX, pos.y - halfY));
        let v3Index = super.addVertex(new Vertex(pos.x + halfX, pos.y - halfY));
        let v4Index = super.addVertex(new Vertex(pos.x + halfX, pos.y + halfY));

        super.createEdge(v1Index, v2Index);
        super.createEdge(v2Index, v3Index);
        super.createEdge(v3Index, v4Index);
        super.createEdge(v4Index, v1Index);

        super.createFace([v1Index, v2Index, v3Index, v4Index]);
    }
}