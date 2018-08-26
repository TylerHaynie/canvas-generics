import { Vector2D } from "canvas/objects/vector";

export class DrawBase {
    protected _context: CanvasRenderingContext2D;

    private _position: Vector2D;
    public get position(): Vector2D {
        return this._position;
    }
    public set position(v: Vector2D) {
        this._position = v;
        this.isDirty = true;
    }

    private _drawCallback: () => void;

    protected isDirty: boolean = true;

    constructor(context: CanvasRenderingContext2D, pos: Vector2D, drawCallback: () => void) {
        this._context = context;
        this._position = pos;
        this._drawCallback = drawCallback;
    }

    public draw() {
        if (this.isDirty) {
            this._drawCallback();

            this.isDirty = false;
        }
    }
}
