import { Vector } from '@canvas/objects/vector';
import { MouseEventType, PanZoomEventType } from '@canvas/events/canvas-event-types';

export class MouseData {
    eventType: MouseEventType;
    translatedPosition: Vector;
    mousePosition: Vector;
    clickPosition: Vector;
    mouseOnCanvas: boolean;
    scrollDirection: string;
    leftMouseState: string;
    mouseMoving: boolean;
}

export class PanZoomData {
    eventType: PanZoomEventType;
    scale: number;
    pan: Vector;
    mousePosition: Vector;
}
