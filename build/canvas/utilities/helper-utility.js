"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const line_1 = require("canvas/shapes/line/line");
const line_segment_1 = require("canvas/shapes/line/line-segment");
const canvas_enums_1 = require("canvas/events/canvas-enums");
const circle_1 = require("canvas/shapes/circle");
const line_style_1 = require("canvas/models/line-style");
const shadow_1 = require("canvas/models/shadow");
const vector_1 = require("canvas/objects/vector");
class HelperUtility {
    constructor(context) {
        this.context = context;
    }
    drawGrid(color, spacing) {
        let line = new line_1.Line(this.context);
        line.style.shade = color;
        for (let x = 0 + 0.5; x < this.context.canvas.width; x += spacing) {
            let segment = new line_segment_1.LineSegment();
            segment.addPoints([new vector_1.Vector2D(x, 0), new vector_1.Vector2D(x, this.context.canvas.height)]);
            line.addSegment(segment);
        }
        for (let y = 0 + 0.5; y < this.context.canvas.height; y += spacing) {
            let segment = new line_segment_1.LineSegment();
            segment.addPoints([new vector_1.Vector2D(0, y), new vector_1.Vector2D(this.context.canvas.width, y)
            ]);
            line.addSegment(segment);
        }
        line.draw();
    }
    trackMouse(v, color, drawArrows = false) {
        let line = new line_1.Line(this.context);
        line.style.shade = color;
        let h1 = new line_segment_1.LineSegment();
        h1.addPoints([new vector_1.Vector2D(0, v.y), new vector_1.Vector2D(v.x, v.y)]);
        line.addSegment(h1);
        let x1 = new line_segment_1.LineSegment();
        x1.addPoints([new vector_1.Vector2D(this.context.canvas.width, v.y), new vector_1.Vector2D(v.x, v.y)]);
        line.addSegment(x1);
        let v1 = new line_segment_1.LineSegment();
        v1.addPoints([new vector_1.Vector2D(v.x, 0), new vector_1.Vector2D(v.x, v.y)]);
        line.addSegment(v1);
        let v2 = new line_segment_1.LineSegment();
        v2.addPoints([new vector_1.Vector2D(v.x, this.context.canvas.height), new vector_1.Vector2D(v.x, v.y)]);
        line.addSegment(v2);
        if (drawArrows) {
            let ra = new line_segment_1.LineSegment();
            ra.addPoints([
                new vector_1.Vector2D(this.context.canvas.width - 5, v.y - 5),
                new vector_1.Vector2D(this.context.canvas.width, v.y),
                new vector_1.Vector2D(this.context.canvas.width - 5, v.y + 5)
            ]);
            line.addSegment(ra);
            let la = new line_segment_1.LineSegment();
            la.addPoints([
                new vector_1.Vector2D(5, v.y - 5),
                new vector_1.Vector2D(0, v.y),
                new vector_1.Vector2D(5, v.y + 5)
            ]);
            line.addSegment(la);
            let da = new line_segment_1.LineSegment();
            da.addPoints([
                new vector_1.Vector2D(v.x + 5, this.context.canvas.height - 5),
                new vector_1.Vector2D(v.x, this.context.canvas.height),
                new vector_1.Vector2D(v.x - 5, this.context.canvas.height - 5)
            ]);
            line.addSegment(da);
            let ta = new line_segment_1.LineSegment();
            ta.addPoints([
                new vector_1.Vector2D(v.x + 5, 5),
                new vector_1.Vector2D(v.x, 0),
                new vector_1.Vector2D(v.x - 5, 5)
            ]);
            line.addSegment(ta);
        }
        line.draw();
    }
    drawMouse(position, state) {
        switch (state) {
            case canvas_enums_1.MOUSE_STATE.DEFAULT:
                this.redDotMouse(position);
                break;
            case canvas_enums_1.MOUSE_STATE.GRAB:
                this.holdMeMouse(position);
                break;
            default:
                this.redDotMouse(position);
                break;
        }
    }
    redDotMouse(position) {
        let co = new circle_1.Circle(this.context, position);
        co.radius = 20;
        co.color = undefined;
        co.outline = new line_style_1.LineStyle();
        co.outline.shade = '#555';
        co.outline.alpha = .50;
        let cp = new circle_1.Circle(this.context, position);
        cp.color.shade = '#e80000';
        cp.radius = 1;
        cp.draw();
        co.draw();
    }
    holdMeMouse(position) {
        let lineLength = 10;
        let line = new line_1.Line(this.context);
        line.style.shade = '#d14d02';
        line.style.width = .65;
        line.shadow = new shadow_1.Shadow();
        line.shadow.shade = '#000';
        line.shadow.blur = 4;
        let trp = new vector_1.Vector2D(position.x + lineLength + 1, position.y - lineLength - 1);
        let tlp = new vector_1.Vector2D(position.x - lineLength, position.y - lineLength);
        let brp = new vector_1.Vector2D(position.x + lineLength, position.y + lineLength);
        let blp = new vector_1.Vector2D(position.x - lineLength + 3, position.y + lineLength - 3);
        let trs = new line_segment_1.LineSegment();
        trs.addPoints([position, trp]);
        line.addSegment(trs);
        let tls = new line_segment_1.LineSegment();
        tls.addPoints([position, tlp]);
        line.addSegment(tls);
        let brs = new line_segment_1.LineSegment();
        brs.addPoints([position, brp]);
        line.addSegment(brs);
        let bls = new line_segment_1.LineSegment();
        bls.addPoints([position, blp]);
        line.addSegment(bls);
        line.draw();
        let r1 = new circle_1.Circle(this.context, new vector_1.Vector2D(position.x, position.y));
        r1.color.shade = '#121212';
        r1.outline = new line_style_1.LineStyle();
        r1.outline.shade = 'red';
        r1.outline.width = .5;
        r1.radius = 2;
        r1.draw();
        let trc = new circle_1.Circle(this.context, trp);
        trc.color.shade = '#121212';
        trc.outline = new line_style_1.LineStyle();
        trc.outline.shade = 'red';
        trc.outline.width = .5;
        trc.radius = 6;
        trc.draw();
        let tlc = new circle_1.Circle(this.context, tlp);
        tlc.color.shade = '#121212';
        tlc.outline = new line_style_1.LineStyle();
        tlc.outline.shade = 'red';
        tlc.outline.width = .5;
        tlc.radius = 3;
        tlc.draw();
        let brc = new circle_1.Circle(this.context, brp);
        brc.color.shade = '#121212';
        brc.outline = new line_style_1.LineStyle();
        brc.outline.shade = 'red';
        brc.outline.width = .5;
        brc.radius = 4;
        brc.draw();
        let blc = new circle_1.Circle(this.context, blp);
        blc.color.shade = '#121212';
        blc.outline = new line_style_1.LineStyle();
        blc.outline.shade = 'red';
        blc.outline.width = .5;
        blc.radius = 4;
        blc.draw();
    }
}
exports.HelperUtility = HelperUtility;
//# sourceMappingURL=helper-utility.js.map