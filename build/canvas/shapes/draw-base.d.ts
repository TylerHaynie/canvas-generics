import { Vector2D } from "canvas/objects/vector";
export declare class DrawBase {
    protected _context: CanvasRenderingContext2D;
    private _position;
    position: Vector2D;
    private _drawCallback;
    protected isDirty: boolean;
    constructor(context: CanvasRenderingContext2D, pos: Vector2D, drawCallback: () => void);
    draw(): void;
}
