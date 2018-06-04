import { Vector } from '../../objects/vector';

export class MouseData {
    mousePosition: Vector;
    clickPosition: Vector;
    mouseOnCanvas: boolean;
    scrollDirection: string;
    leftMouseState: string;
    mouseMoving: boolean;
}
