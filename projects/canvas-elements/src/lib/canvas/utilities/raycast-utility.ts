import { Vertex } from '../objects/vertex';

export class RayCastUtility {
    constructor() { }

    lineIntersects(pa: Vertex, pb: Vertex, pc: Vertex, pd: Vertex) {
        let r = new Vertex(pb.x - pa.x, pb.y - pa.y);
        let s = new Vertex(pd.x - pc.x, pd.y - pc.y);

        let d = r.x * s.y - r.y * s.x;
        let u = ((pc.x - pa.x) * r.y - (pc.y - pa.y) * r.x) / d;
        let t = ((pc.x - pa.x) * s.y - (pc.y - pa.y) * s.x) / d;

        if (u >= 0 && u <= 1) {
            if (t >= 0 && t <= 1) {
                return new Vertex(
                    pa.x + t * r.x,
                    pa.y + t * r.y
                );
            }
        }

        return;
    }
}