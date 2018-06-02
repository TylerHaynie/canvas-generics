import { iPoint } from '../interfaces/iPoint';
import { iCircle } from '../interfaces/iCircle';

export class CollisionUtility {

    constructor() {}

    areaOverCircle(area: iCircle, circle: iCircle): boolean {
        let withinBounds: boolean = false;

        let dx = area.point.x - circle.point.x;
        let dy = area.point.y - circle.point.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < area.radius + circle.radius) {
            withinBounds = true;
        }

        return withinBounds;
    }

}
