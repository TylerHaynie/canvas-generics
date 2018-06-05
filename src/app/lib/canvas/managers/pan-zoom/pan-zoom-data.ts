import { Vector } from '../../objects/vector';
import { PanZoomEventType } from '../../events/canvas-event-types';

export class PanZoomData {
    eventType: PanZoomEventType;
    scale: number;
    pan: Vector;
    mousePosition: Vector;
}
