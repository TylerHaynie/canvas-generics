import { Vector } from '../objects/vector';
import { Circle } from '../shapes/circle';

export class CollisionUtility {

    constructor() {}

    circleOverCircle(area: Circle, circle: Circle): boolean {
        let withinBounds: boolean = false;

        let dx = area.position.x - circle.position.x;
        let dy = area.position.y - circle.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < area.radius + circle.radius) {
            withinBounds = true;
        }

        return withinBounds;
    }

}
