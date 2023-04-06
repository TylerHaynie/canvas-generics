import { CanvasShader } from "./shaders/basic/canvas-shader";

export class PolyRenderReference {
    private _index: number = -1;
    private _polyId: string = '';
    private _shader: CanvasShader;

    public get polyIndex(): number { return this._index; }
    public get polyId(): string { return this._polyId; }
    public get shader(): CanvasShader { return this._shader; }

    constructor(polyIndex: number, polyId: string, shader: CanvasShader) {
        this._index = polyIndex;
        this._polyId = polyId;
        this._shader = shader;
    }
}