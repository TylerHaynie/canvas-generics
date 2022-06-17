import { Vector2D } from '../objects/vector';
import { MOUSE_STATE, MOUSE_EVENT_TYPE, PAN_ZOOM_EVENT_TYPE } from './canvas-enums';

export class MouseData {
    uiMouseState: MOUSE_STATE;
    eventType: MOUSE_EVENT_TYPE;
    translatedPosition: Vector2D;
    mousePosition: Vector2D;
    clickPosition: Vector2D;
    mouseOnCanvas: boolean;
    scrollDirection: string;
    primaryMouseState: string;
    mouseMoving: boolean;
}

export class PanZoomData {
    eventType: PAN_ZOOM_EVENT_TYPE;
    scale: number;
    pan: Vector2D;
    mousePosition: Vector2D;
}
