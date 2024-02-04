import { CanvasShader } from "./shaders/basic/canvas-shader";

export class PolyRenderReference {
    private _index: number = -1;
    private _polyId: string = '';
    private _shader: CanvasShader;
    private _isVisible: boolean = true;

    public get polyIndex(): number { return this._index; }
    public get polyId(): string { return this._polyId; }
    public get shader(): CanvasShader { return this._shader; }
    public get visible(): boolean { return this._isVisible; }

    public set visible(isVisible: boolean) { this._isVisible = isVisible; }

    constructor(polyIndex: number, polyId: string, shader: CanvasShader, isVisible: boolean = true) {
        this._index = polyIndex;
        this._polyId = polyId;
        this._shader = shader;
        this._isVisible = isVisible;
    }
}