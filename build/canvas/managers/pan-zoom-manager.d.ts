import { MouseManager } from 'canvas/managers/mouse-manager';
import { PAN_ZOOM_EVENT_TYPE } from 'canvas/events/canvas-event-types';
import { PanZoomData } from 'canvas/events/event-data';
export declare class PanZoomManager {
    scalingAllowed: boolean;
    minScale: number;
    maxScale: number;
    scaleStep: number;
    panningAllowed: boolean;
    panSpeed: number;
    private context;
    private mouseManager;
    private mousePosition;
    private canvasScaleStep;
    private canvasScale;
    private minimumPanSpeed;
    private maximumPanSpeed;
    private allowPanning;
    private pannableModifier;
    private panOffset;
    private isPanning;
    private panStartPosition;
    private totalPanning;
    private panModifier;
    private allowScaling;
    private maximumScale;
    private minimumScale;
    private pinchMoveStart;
    private pinchMoveEnd;
    private isPinching;
    private pinchScale;
    private eventType;
    private panZoomEvent;
    on(on: PAN_ZOOM_EVENT_TYPE, callback: (e: PanZoomData) => void): void;
    constructor(context: CanvasRenderingContext2D, mouseManager: MouseManager);
    zoomIn(): void;
    zoomOut(): void;
    private registerEvents;
    private fireEvent;
    private mouseDown;
    private mouseMove;
    private mouseStop;
    private pan;
    private scaleUp;
    private scaleDown;
    private resetView;
}
//# sourceMappingURL=pan-zoom-manager.d.ts.map