import { Vector } from "./vector";
import { v4 as uuidv4 } from 'uuid';
import { IIdentifiable } from "../../depricated/models/interfaces/identifiable";
import { Edge } from "./edge";
import { Face } from "./face";

export class Polygon implements IIdentifiable {
    private _id: string = uuidv4();
    private _origin: Vector;
    private _vectors: Vector[] = [];
    private _edges: Edge[] = [];
    private _faces: Face[] = [];

    public get id(): string { return this._id; }
    public get position(): Vector { return this._origin; }
    public get edges(): Edge[] { return this._edges; }
    public get faces(): Face[] { return this._faces; }

    constructor(position: Vector) {
        this._origin = position;
    }

    public addVector(vector: Vector): number {
        this._vectors.push(vector);
        return this._vectors.length - 1;
    }

    public getVector(index: number): Vector {
        return this._vectors[index];
    }

    public createEdge(startVertIndex: number, endVertIndex: number): number {
        this._edges.push(new Edge(startVertIndex, endVertIndex));
        return this._edges.length - 1;
    }

    public getEdgeVectors(edgeIndex: number): Vector[] {
        let edge = this._edges[edgeIndex];
        return [this._vectors[edge.indices[0]], this._vectors[edge.indices[1]]]
    }

    public createFace(vertIndices: number[]): number {
        this._faces.push(new Face(vertIndices));
        return this._faces.length - 1;
    }

    public getFaceVectors(faceIndex: number): Vector[] {
        let face = this._faces[faceIndex];
        let vectors = Array<Vector>(face.indices.length);
        let insertAt = 0;
        face.indices.forEach(faceIndex => {
            vectors[insertAt] = this._vectors[faceIndex];
            insertAt += 1;
        });

        return vectors;
    }

    public moveTo(targetPosition: Vector): void {
        let direction = this._origin.directionTo(targetPosition);
        this.moveSelf(direction);
    }

    public moveBy(amount: Vector): void {
        this.moveSelf(amount);
    }

    private moveSelf(movement: Vector): void {
        for (let i = 0; i < this._vectors.length; i++) {
            this._vectors[i].add(movement);
        }

        this._origin.add(movement);
    }
}