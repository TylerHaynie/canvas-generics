import { iPoint } from '../interfaces/iPoint';
export class MathUtility {
    constructor() { }

    findSlope(p1: iPoint, p2: iPoint) {
        return (p2.y - p1.y) / (p2.x - p1.x);
    }
}
