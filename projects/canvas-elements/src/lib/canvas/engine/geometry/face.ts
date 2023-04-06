export class Face {
    private _indices: number[] = [];
    public get indices(): number[] { return this._indices; }

    constructor(polyIndices: number[]) {
        this._indices.push(...polyIndices);
    }
}