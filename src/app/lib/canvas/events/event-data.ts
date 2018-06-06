import { Vector } from '@canvas/objects/vector';
import { MOUSE_EVENT_TYPE, PAN_ZOOM_EVENT_TYPE, MOUSE_STATE } from '@canvas/events/canvas-event-types';

export class MouseData {
    uiMouseState: MOUSE_STATE;
    eventType: MOUSE_EVENT_TYPE;
    translatedPosition: Vector;
    mousePosition: Vector;
    clickPosition: Vector;
    mouseOnCanvas: boolean;
    scrollDirection: string;
    leftMouseState: string;
    mouseMoving: boolean;
}

export class PanZoomData {
    eventType: PAN_ZOOM_EVENT_TYPE;
    scale: number;
    pan: Vector;
    mousePosition: Vector;
}
