import { Vector } from '@canvas/objects/vector';

export class RayCastUtility {
    constructor() { }

    lineIntersects(pa: Vector, pb: Vector, pc: Vector, pd: Vector) {
        
        // he has a very good explination of the equation
        let r = <Vector>{ x: pb.x - pa.x, y: pb.y - pa.y };
        let s = <Vector>{ x: pd.x - pc.x, y: pd.y - pc.y };

        let d = r.x * s.y - r.y * s.x;
        let u = ((pc.x - pa.x) * r.y - (pc.y - pa.y) * r.x) / d;
        let t = ((pc.x - pa.x) * s.y - (pc.y - pa.y) * s.x) / d;

        if (u >= 0 && u <= 1) {
            if (t >= 0 && t <= 1) {
                return <Vector>{
                    x: pa.x + t * r.x,
                    y: pa.y + t * r.y
                };
            }
        }

        return;
    }


}
