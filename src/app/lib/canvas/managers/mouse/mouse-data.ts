import { Vector } from '../../objects/vector';
import { MouseEventType } from './event-types';

export class MouseData {
    eventType: MouseEventType;
    mousePosition: Vector;
    clickPosition: Vector;
    mouseOnCanvas: boolean;
    scrollDirection: string;
    leftMouseState: string;
    mouseMoving: boolean;
}
