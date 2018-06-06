import { Vector } from '@canvas/objects/vector';

export class CollisionUtility {

    constructor() {}

    checkRadiusCollision(v1: Vector, v1Radius: number, v2: Vector, v2Radius: number): boolean {
        let withinBounds: boolean = false;

        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < v1Radius + v2Radius) {
            withinBounds = true;
        }

        return withinBounds;
    }

}
