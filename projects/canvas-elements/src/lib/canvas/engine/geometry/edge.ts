export class Edge {
    private _indices = Array<number>(2);
    public get indices(): Array<number> { return this._indices; }

    constructor(startPolyIndex: number, endPolyIndex: number) {
        this.indices[0] = startPolyIndex;
        this.indices[1] = endPolyIndex;
    }
}