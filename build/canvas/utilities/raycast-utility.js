"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
class RayCastUtility {
    constructor() { }
    lineIntersects(pa, pb, pc, pd) {
        let r = new vector_1.Vector2D(pb.x - pa.x, pb.y - pa.y);
        let s = new vector_1.Vector2D(pd.x - pc.x, pd.y - pc.y);
        let d = r.x * s.y - r.y * s.x;
        let u = ((pc.x - pa.x) * r.y - (pc.y - pa.y) * r.x) / d;
        let t = ((pc.x - pa.x) * s.y - (pc.y - pa.y) * s.x) / d;
        if (u >= 0 && u <= 1) {
            if (t >= 0 && t <= 1) {
                return new vector_1.Vector2D(pa.x + t * r.x, pa.y + t * r.y);
            }
        }
        return;
    }
}
exports.RayCastUtility = RayCastUtility;
//# sourceMappingURL=raycast-utility.js.map