import { Vector2D } from '@canvas/objects/vector';

export class RayCastUtility {
    constructor() { }

    lineIntersects(pa: Vector2D, pb: Vector2D, pc: Vector2D, pd: Vector2D) {

        // he has a very good explination of the equation
        let r = new Vector2D(pb.x - pa.x, pb.y - pa.y);
        let s = new Vector2D(pd.x - pc.x, pd.y - pc.y);

        let d = r.x * s.y - r.y * s.x;
        let u = ((pc.x - pa.x) * r.y - (pc.y - pa.y) * r.x) / d;
        let t = ((pc.x - pa.x) * s.y - (pc.y - pa.y) * s.x) / d;

        if (u >= 0 && u <= 1) {
            if (t >= 0 && t <= 1) {
                return new Vector2D(
                    pa.x + t * r.x,
                    pa.y + t * r.y
                );
            }
        }

        return;
    }


}
