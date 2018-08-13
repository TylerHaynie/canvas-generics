"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
class RandomUtility {
    randomWithNegative() {
        return Math.fround(((Math.random() * 200) - 100) / 100);
    }
    randomNumberBetween(n1, n2) {
        return Math.floor(Math.random() * Math.max(n1, n2)) + Math.min(n1, n2);
    }
    randomVectorInBounds(w, h) {
        let rx = Math.fround(Math.random() * w);
        let ry = Math.fround(Math.random() * h);
        return new vector_1.Vector2D(rx, ry);
    }
}
exports.RandomUtility = RandomUtility;
//# sourceMappingURL=random-utility.js.map