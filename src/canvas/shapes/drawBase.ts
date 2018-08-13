export class DrawBase {
    protected context: CanvasRenderingContext2D;
    private _drawCallback: () => void;

    constructor(context: CanvasRenderingContext2D, drawCallback: () => void) {
        this.context = context;
        this._drawCallback = drawCallback;
    }

    public draw() {
        this._drawCallback();
    }
}
