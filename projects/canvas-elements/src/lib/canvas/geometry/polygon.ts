import { Vertex } from "../objects/vertex";
import { v4 as uuidv4 } from 'uuid';
import { IIdentifiable } from "../models/interfaces/identifiable";
import { Edge } from "./edge";
import { Face } from "./face";

export class Polygon implements IIdentifiable {
    private _id: string = uuidv4();
    private _origin: Vertex;
    private _vertices: Vertex[] = [];
    private _edges: Edge[] = [];
    private _faces: Face[] = [];

    public get id(): string { return this._id; }
    public get position(): Vertex { return this._origin; }
    public get edges(): Edge[] { return this._edges; }
    public get faces(): Face[] { return this._faces; }

    constructor(position: Vertex) {
        this._origin = position;
    }

    public addVertex(vertex: Vertex): number {
        this._vertices.push(vertex);
        return this._vertices.length - 1;
    }

    public getVertex(index: number): Vertex {
        return this._vertices[index];
    }

    public createEdge(startVertIndex: number, endVertIndex: number): number {
        this._edges.push(new Edge(startVertIndex, endVertIndex));
        return this._edges.length - 1;
    }

    public getEdgeVertices(edgeIndex: number): Vertex[] {
        let edge = this._edges[edgeIndex];
        return [this._vertices[edge.indices[0]], this._vertices[edge.indices[1]]]
    }

    public createFace(vertIndices: number[]): number {
        this._faces.push(new Face(vertIndices));
        return this._faces.length - 1;
    }

    public getFaceVertices(faceIndex: number): Vertex[] {
        let face = this._faces[faceIndex];
        let vertices = Array<Vertex>(face.indices.length);
        let insertAt = 0;
        face.indices.forEach(faceIndex => {
            vertices[insertAt] = this._vertices[faceIndex];
            insertAt += 1;
        });

        return vertices;
    }

    public setPosition(vector: Vertex): void {
        // this.moveVertices();
        this._origin.set(vector);
    }

    // public scale(scaleBy: Vertex){

    // }

    // // when the position changes, move all verticies by the position delta
    // private moveVerticies(direction: Vertex, distance: number): void {

    // }
}