"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("canvas/objects/vector");
const line_1 = require("canvas/shapes/line/line");
const line_segment_1 = require("canvas/shapes/line/line-segment");
const rectangle_1 = require("canvas/shapes/rectangle");
const enums_1 = require("canvas/enums");
class ConnectionObjects {
    constructor(context) {
        this.context = context;
    }
    funnel(pos, direction, gap, style) {
        return this.createArrow(pos, direction, gap, style, true, true, true);
    }
    filledArrow(pos, direction, gap, style) {
        return this.createArrow(pos, direction, gap, style, true, true);
    }
    arrow(pos, direction, gap, style, closePath) {
        return this.createArrow(pos, direction, gap, style, false, closePath);
    }
    square(pos, size, color) {
        let r = new rectangle_1.Rectangle(this.context, new vector_1.Vector2D(Math.fround(pos.x - size.width / 2), Math.fround(pos.y - size.height / 2)));
        r.color = color;
        r.size = size;
        return r;
    }
    createArrow(pos, direction, gap, style, isFilled = false, autoClosePath = false, isFunnel = false) {
        let line = new line_1.Line(this.context);
        line.autoClosePath = autoClosePath;
        line.style = style;
        switch (direction) {
            case enums_1.DIRECTION.NORTH:
            case enums_1.DIRECTION.SOUTH:
                let nsp = [];
                nsp.push(new vector_1.Vector2D(pos.x - gap, direction === enums_1.DIRECTION.SOUTH ? pos.y - gap : pos.y + gap));
                if (isFunnel) {
                    nsp.push(new vector_1.Vector2D(pos.x - gap * enums_1.QUARTERS.ONE, pos.y));
                    nsp.push(new vector_1.Vector2D(pos.x + gap * enums_1.QUARTERS.ONE, pos.y));
                }
                else {
                    nsp.push(new vector_1.Vector2D(pos.x, pos.y));
                }
                nsp.push(new vector_1.Vector2D(pos.x + gap, direction === enums_1.DIRECTION.SOUTH ? pos.y - gap : pos.y + gap));
                let nss = new line_segment_1.LineSegment();
                nss.addPoints(nsp);
                nss.fillSegment = isFilled;
                line.addSegment(nss);
                break;
            case enums_1.DIRECTION.EAST:
            case enums_1.DIRECTION.WEST:
                let ewp = [];
                ewp.push(new vector_1.Vector2D(direction === enums_1.DIRECTION.WEST ? pos.x + gap : pos.x - gap, pos.y - gap));
                if (isFunnel) {
                    ewp.push(new vector_1.Vector2D(pos.x, pos.y - gap * enums_1.QUARTERS.ONE));
                    ewp.push(new vector_1.Vector2D(pos.x, pos.y + gap * enums_1.QUARTERS.ONE));
                }
                else {
                    ewp.push(new vector_1.Vector2D(pos.x, pos.y));
                }
                ewp.push(new vector_1.Vector2D(direction === enums_1.DIRECTION.WEST ? pos.x + gap : pos.x - gap, pos.y + gap));
                let ews = new line_segment_1.LineSegment();
                ews.addPoints(ewp);
                ews.fillSegment = isFilled;
                line.addSegment(ews);
                break;
        }
        return line;
    }
}
exports.ConnectionObjects = ConnectionObjects;
//# sourceMappingURL=connection-objects.js.map