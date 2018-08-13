"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
class Vector2D {
    get x() {
        return this.vector[0];
    }
    get y() {
        return this.vector[1];
    }
    constructor(x, y) {
        this.vector = gl_matrix_1.vec2.fromValues(x, y);
    }
    scale(scaleAmount) {
        let resultVector;
        gl_matrix_1.vec2.scale(resultVector, this.vector, scaleAmount);
        return new Vector2D(resultVector[0], resultVector[1]);
    }
    subtract(other) {
        let outResult = gl_matrix_1.vec2.create();
        gl_matrix_1.vec2.sub(outResult, this.vector, other.vector);
        return outResult;
    }
    distance(other) {
        let outResult = gl_matrix_1.vec2.dist(this.vector, other.vector);
        return outResult;
    }
    move(x, y) {
        this.vector[0] = this.vector[0] + x;
        this.vector[1] = this.vector[1] + y;
        return this;
    }
    positionOn(current) {
        this.vector[0] = current.x;
        this.vector[1] = current.y;
        return this;
    }
}
exports.Vector2D = Vector2D;
//# sourceMappingURL=vector.js.map