import { CanvasShader } from "./shaders/canvas-api/canvas-shader";

export class PolygonRenderReference {
    private _index: number = -1;
    private _polygonId: string = '';
    private _shader: CanvasShader;

    public get polygonIndex(): number { return this._index; }
    public get polygonId(): string { return this._polygonId; }
    public get shader(): CanvasShader { return this._shader; }

    constructor(polygonIndex: number, polygonId: string, shader: CanvasShader) {
        this._index = polygonIndex;
        this._polygonId = polygonId;
        this._shader = shader;
    }
}