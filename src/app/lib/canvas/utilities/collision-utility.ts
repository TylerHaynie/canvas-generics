import { iVector } from '../interfaces/iVector';
import { iCircle } from '../interfaces/iCircle';

export class CollisionUtility {

    constructor() {}

    areaOverCircle(area: iCircle, circle: iCircle): boolean {
        let withinBounds: boolean = false;

        let dx = area.vector.x - circle.vector.x;
        let dy = area.vector.y - circle.vector.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < area.radius + circle.radius) {
            withinBounds = true;
        }

        return withinBounds;
    }

}
