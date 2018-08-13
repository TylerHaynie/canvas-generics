"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_1 = require("canvas/shapes/rectangle");
const vector_1 = require("canvas/objects/vector");
const size_1 = require("canvas/models/size");
const line_style_1 = require("canvas/models/line-style");
class QuadData {
    constructor(x, y, data = undefined, size = undefined) {
        this.vector = new vector_1.Vector2D(x, y);
        this.data = data;
        this.size = size ? size : new size_1.Size(1, 1);
    }
}
exports.QuadData = QuadData;
class Boundary {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    containsQuadData(dataPoint) {
        if (dataPoint.vector.x > this.x &&
            dataPoint.vector.x < this.x + this.w) {
            if (dataPoint.vector.y > this.y &&
                dataPoint.vector.y < this.y + this.h) {
                return true;
            }
        }
        return false;
    }
    intersects(other) {
        if (other.x - other.w > this.x + this.w ||
            other.x + other.w < this.x - this.w ||
            other.y - other.h > this.y + this.h ||
            other.y + other.h > this.y - this.h) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Boundary = Boundary;
class QuadTree {
    constructor(b, c) {
        this.dataPoints = [];
        this.isDivided = false;
        this.boundary = b;
        this.capicity = c;
    }
    insert(p) {
        if (!this.boundary.containsQuadData(p)) {
            return false;
        }
        if (this.dataPoints.length < this.capicity) {
            this.dataPoints.push(p);
            return true;
        }
        if (!this.isDivided) {
            this.subdivide();
            for (let x = this.dataPoints.length; x > 0; x--) {
                this.insert(this.dataPoints[x - 1]);
                this.dataPoints.splice(x, 1);
            }
        }
        if (this.topLeft.insert(p)) {
            return true;
        }
        if (this.topRight.insert(p)) {
            return true;
        }
        if (this.bottomLeft.insert(p)) {
            return true;
        }
        if (this.bottomRight.insert(p)) {
            return true;
        }
        return false;
    }
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        let tlBounds = new Boundary(x, y, w / 2, h / 2);
        this.topLeft = new QuadTree(tlBounds, this.capicity);
        let trBounds = new Boundary(x + w / 2, y, w / 2, h / 2);
        this.topRight = new QuadTree(trBounds, this.capicity);
        let blBounds = new Boundary(x, y + h / 2, w / 2, h / 2);
        this.bottomLeft = new QuadTree(blBounds, this.capicity);
        let brBounds = new Boundary(x + w / 2, y + h / 2, w / 2, h / 2);
        this.bottomRight = new QuadTree(brBounds, this.capicity);
        this.isDivided = true;
    }
    searchBoundary(b) {
        let dataInRange = [];
        if (!this.boundary.intersects(b)) {
            return dataInRange;
        }
        for (let x = 0; x < this.dataPoints.length; x++) {
            if (b.containsQuadData(this.dataPoints[x])) {
                dataInRange.push(this.dataPoints[x]);
            }
        }
        if (!this.isDivided) {
            return dataInRange;
        }
        for (let p of this.topLeft.searchBoundary(b)) {
            dataInRange.push(p);
        }
        for (let p of this.topRight.searchBoundary(b)) {
            dataInRange.push(p);
        }
        for (let p of this.bottomLeft.searchBoundary(b)) {
            dataInRange.push(p);
        }
        for (let p of this.bottomRight.searchBoundary(b)) {
            dataInRange.push(p);
        }
        return dataInRange;
    }
    reset(w, h) {
        this.boundary.w = w;
        this.boundary.h = h;
        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;
        this.dataPoints = [];
        this.isDivided = false;
    }
    debugQuad(context, color, lineWidth = .25) {
        let p = new vector_1.Vector2D(this.boundary.x, this.boundary.y);
        let rect = new rectangle_1.Rectangle(context, p);
        rect.size = new size_1.Size(this.boundary.w, this.boundary.h);
        rect.outline = new line_style_1.LineStyle(color.shade, lineWidth);
        rect.outline.alpha = color.alpha;
        rect.draw();
        if (this.isDivided) {
            this.topLeft.debugQuad(context, color, lineWidth);
            this.topRight.debugQuad(context, color, lineWidth);
            this.bottomLeft.debugQuad(context, color, lineWidth);
            this.bottomRight.debugQuad(context, color, lineWidth);
        }
    }
}
exports.QuadTree = QuadTree;
//# sourceMappingURL=quad-tree.js.map