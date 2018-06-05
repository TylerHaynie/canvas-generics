import { Vector } from '../../objects/vector';
import { PanZoomEventType } from './event-type';

export class PanZoomData {
    eventType: PanZoomEventType;
    scale: number;
    pan: Vector;
    mousePosition: Vector;
}
