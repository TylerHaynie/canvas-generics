import { PanZoomData, MouseData } from 'canvas/events/event-data';
import { MOUSE_EVENT_TYPE } from 'canvas/events/canvas-event-types';
export declare class MouseManager {
    readonly mouseOnCanvas: boolean;
    private _context;
    private contextModified;
    private contextData;
    private mousePosition;
    private translatedPosition;
    private _mouseOnCanvas;
    private scrollingDirection;
    private leftMousePosition;
    private isMoving;
    private eventType;
    private mouseEvent;
    on(on: MOUSE_EVENT_TYPE, callback: (e: MouseData) => void): void;
    constructor(context: CanvasRenderingContext2D);
    contextupdated(data: PanZoomData): void;
    private fireEvent;
    private registerEvents;
    private doMouseDown;
    private updateMousePosition;
    private mouseUp;
    private mouseLeave;
    private mouseScrollUp;
    private mouseScrollDown;
}
//# sourceMappingURL=mouse-manager.d.ts.map