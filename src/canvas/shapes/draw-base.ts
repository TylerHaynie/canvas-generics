export class DrawBase {
    protected _context: CanvasRenderingContext2D;
    private _drawCallback: () => void;

    protected isDirty: boolean = false;

    constructor(context: CanvasRenderingContext2D, drawCallback: () => void) {
        this._context = context;
        this._drawCallback = drawCallback;
    }

    public draw() {
        if (this.isDirty) {
            this._drawCallback();

            this.isDirty = false;
        }
    }
}
