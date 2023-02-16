import { CanvasEngine } from '../../canvas-engine';
import { Vector } from '../geometry/vector';
import { MOUSE_STATE, MOUSE_EVENT_TYPE, PAN_ZOOM_EVENT_TYPE, KEYBOARD_EVENT_TYPE, RENDER_EVENT_TYPE, ENGINE_EVENT_TYPE } from './canvas-enums';

export class EngineEventData {
    eventType: ENGINE_EVENT_TYPE;
    engine: CanvasEngine;
}

export class MouseEventData {
    uiMouseState: MOUSE_STATE;
    eventType: MOUSE_EVENT_TYPE;
    translatedPosition: Vector;
    mousePosition: Vector;
    clickPosition: Vector;
    mouseOnCanvas: boolean;
    scrollDirection: string;
    primaryMouseState: string;
    mouseMoving: boolean;
}

export class KeyboardEventData {
    eventType: KEYBOARD_EVENT_TYPE;
    keyQueue: string[];
    latestKeyDown: string;
    latestKeyUp: string;
    controlDown: boolean;
    shiftDown: boolean;
    altDown: boolean;
    hasKeyDown: Boolean;
}

export class RenderEventData {
    eventType: RENDER_EVENT_TYPE;
    bitmap: ImageBitmap;
    drawCalls: number;
}

export class PanZoomData {
    eventType: PAN_ZOOM_EVENT_TYPE;
    scale: number;
    pan: Vector;
    mousePosition: Vector;
}
