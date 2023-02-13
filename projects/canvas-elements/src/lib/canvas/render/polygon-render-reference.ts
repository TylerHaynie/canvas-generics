import { CanvasShader } from "./shaders/canvas-api/canvas-shader";

export class PolygonRenderReference {
    public get polygonId(): string { return this._polygonId; }
    private _posZ: number;
    private _index: number = -1;
    private _polygonId: string = '';

    public get polygonIndex(): number { return this._index; }

    public shader: CanvasShader;

    constructor(polygonIndex: number, polygonId: string, shader: CanvasShader) {
        this._index = polygonIndex;
        this._polygonId = polygonId;
        this.shader = shader;
    }
}
