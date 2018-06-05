import { Vector } from '../../objects/vector';
import { MouseEventType } from '../../events/canvas-event-types';

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
