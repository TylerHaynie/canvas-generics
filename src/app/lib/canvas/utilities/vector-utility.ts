import { iVector } from '../interfaces/iVector';
export class VectorUtility {
    constructor() { }

    findSlope(p1: iVector, p2: iVector) {
        return (p2.y - p1.y) / (p2.x - p1.x);
    }

    lineIntersects(pa: iVector, pb: iVector, pc: iVector, pd: iVector) {
        // credit goes to: https://www.youtube.com/watch?v=c065KoXooSw
        // he has a very good explination of the equation
        let r = <iVector>{ x: pb.x - pa.x, y: pb.y - pa.y };
        let s = <iVector>{ x: pd.x - pc.x, y: pd.y - pc.y };

        let d = r.x * s.y - r.y * s.x;
        let u = ((pc.x - pa.x) * r.y - (pc.y - pa.y) * r.x) / d;
        let t = ((pc.x - pa.x) * s.y - (pc.y - pa.y) * s.x) / d;

        if (u >= 0 && u <= 1) {
            if (t >= 0 && t <= 1) {
                return <iVector>{
                    x: pa.x + t * r.x,
                    y: pa.y + t * r.y
                };
            }
        }

        return;
    }

    rotateVector(v, a) {
        let x = v.x * Math.cos(a) - v.y * Math.sin(a);
        let y = v.x * Math.sin(a) + v.y * Math.cos(a);

        return <iVector>{ x: x, y: y };
    }
}
