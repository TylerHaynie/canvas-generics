import { MOUSE_STATE } from 'canvas/events/canvas-event-types';
import { Vector2D } from 'canvas/objects/vector';
export declare class HelperUtility {
    private context;
    constructor(context: CanvasRenderingContext2D);
    drawGrid(color: string, spacing: number): void;
    trackMouse(v: Vector2D, color: string, drawArrows?: boolean): void;
    drawMouse(position: Vector2D, state: MOUSE_STATE): void;
    private redDotMouse(position);
    private holdMeMouse(position);
}
