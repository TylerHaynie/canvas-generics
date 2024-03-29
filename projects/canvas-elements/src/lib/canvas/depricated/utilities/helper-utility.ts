import { MOUSE_STATE } from '../engine/events/canvas-enums';
import { LineStyle } from '../depricated/models/line-style';
import { Shadow } from '../models/shadow';
import { Vector } from '../engine/geometry/vector';
import { Circle } from '../shapes/circle';
import { Line } from '../depricated/shapes/line/line';
import { LineSegment } from '../depricated/shapes/line/line-segment';

export class HelperUtility {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    getGrid(color: string, spacing: number): Line {
        let gridLines = new Line();
        gridLines.style.setShade(color);

        // TODO: I want to start the gird at center

        // vertical lines
        // start at 0.5 so the lines take up 1 whole pixel and not 2 halves
        for (let x = 0 + 0.5; x < this.context.canvas.width; x += spacing) {
            let segment = new LineSegment(new Vector(x, 0));
            segment.addPoint(new Vector(x, this.context.canvas.height));
            gridLines.addSegment(segment);
        }

        // horizontal
        // start at 0.5 so the lines take up 1 whole pixel and not 2 half pixels
        for (let y = 0 + 0.5; y < this.context.canvas.height; y += spacing) {
            let segment = new LineSegment(new Vector(0, y));
            segment.addPoint(new Vector(this.context.canvas.width, y));
            gridLines.addSegment(segment);
        }

        return gridLines;
    }

    trackMouse(v: Vector, color: string, drawArrows: boolean = false): Line {
        let line = new Line();
        line.style.setShade(color);

        // horizontal line (left)
        let h1 = new LineSegment(new Vector(0, v.y));
        h1.addPoint(new Vector(v.x, v.y));
        line.addSegment(h1);

        // horizontal line (right)
        let x1 = new LineSegment(new Vector(this.context.canvas.width, v.y));
        x1.addPoint(new Vector(v.x, v.y));
        line.addSegment(x1);

        // vertical line (top)
        let v1 = new LineSegment(new Vector(v.x, 0));
        v1.addPoint(new Vector(v.x, v.y));
        line.addSegment(v1);

        // vertical line (bottom)
        let v2 = new LineSegment(new Vector(v.x, this.context.canvas.height));
        v2.addPoint(new Vector(v.x, v.y));
        line.addSegment(v2);

        if (drawArrows) {
            // right arrow
            let ra = new LineSegment(new Vector(this.context.canvas.width - 5, v.y - 5));
            ra.addPoint(new Vector(this.context.canvas.width, v.y));
            ra.addPoint(new Vector(this.context.canvas.width - 5, v.y + 5));
            line.addSegment(ra);

            // left arrow
            let la = new LineSegment(new Vector(5, v.y - 5));
            la.addPoint(new Vector(0, v.y));
            la.addPoint(new Vector(5, v.y + 5));
            line.addSegment(la);

            // bottom arrow
            let da = new LineSegment(new Vector(v.x + 5, this.context.canvas.height - 5));
            da.addPoint(new Vector(v.x, this.context.canvas.height));
            da.addPoint(new Vector(v.x - 5, this.context.canvas.height - 5));
            line.addSegment(da);

            // top  arrow
            let ta = new LineSegment(new Vector(v.x + 5, 5));
            ta.addPoint(new Vector(v.x, 0));
            ta.addPoint(new Vector(v.x - 5, 5));
            line.addSegment(ta);
        }

        return line;
    }

    drawMouse(position: Vector, state: MOUSE_STATE) {
        switch (state) {
            case MOUSE_STATE.DEFAULT:
                this.redDotMouse(position);
                break;
            case MOUSE_STATE.GRAB:
                this.holdMeMouse(position);
                break;
            default:
                this.redDotMouse(position);
                break;
        }
    }

    private redDotMouse(position: Vector) {
        // circle outline
        let co = new Circle(position);
        co.radius = 20;
        co.outline = new LineStyle();
        co.outline.width = 1;
        co.outline.setShade('#555');
        co.outline.setAlpha(.80);
        co.color.setAlpha(.40);
        co.color.setShade('#333');

        // center point
        let cp = new Circle(position);
        // cp.color = new Color();
        cp.color.setShade('#e80000');
        cp.radius = 3;

        cp.draw(this.context);
        co.draw(this.context);
    }

    private holdMeMouse(position: Vector) {
        let lineLength = 10;
        let line = new Line();
        line.style.setShade('#d14d02');
        line.style.width = .65;
        line.shadow = new Shadow();
        // line.shadow.shadowColor = '#000';
        // line.shadow.shadowBlur = 4;

        // top right
        let trp = new Vector(position.x + lineLength + 1, position.y - lineLength - 1);
        // top left
        let tlp = new Vector(position.x - lineLength, position.y - lineLength);
        // bottom right
        let brp = new Vector(position.x + lineLength, position.y + lineLength);
        // bottom left
        let blp = new Vector(position.x - lineLength + 3, position.y + lineLength - 3);

        let trs = new LineSegment(position);
        trs.addPoint(trp);
        line.addSegment(trs);

        let tls = new LineSegment(position);
        tls.addPoint(tlp);
        line.addSegment(tls);

        let brs = new LineSegment(position);
        brs.addPoint(brp);
        line.addSegment(brs);

        let bls = new LineSegment(position);
        bls.addPoint(blp);
        line.addSegment(bls);

        // draw line
        line.draw(this.context);

        // arrows
        // let arrows = new Line(this.context);
        // arrows.style.shade = 'red';
        // arrows.style.lineWidth = 1;

        // let up = new LineSegment(new Vector2D(position.x, position.y - 12));
        // up.addPoint(new Vector2D(position.x - 2, position.y - 8));
        // up.addPoint(new Vector2D(position.x - 2, position.y - 8));
        // arrows.addSegment(up);

        // arrows.draw();

        // center circle
        let r1 = new Circle(new Vector(position.x, position.y));
        r1.color.setShade('#121212');
        r1.outline = new LineStyle();
        r1.outline.setShade('red');
        r1.outline.width = .5;
        r1.radius = 2;
        r1.draw(this.context,);

        // top right
        let trc = new Circle(trp);
        trc.color.setShade('#121212');
        trc.outline = new LineStyle();
        trc.outline.setShade('red');
        trc.outline.width = .5;
        trc.radius = 6;
        trc.draw(this.context,);

        // top left
        let tlc = new Circle(tlp);
        tlc.color.setShade('#121212');
        tlc.outline = new LineStyle();
        tlc.outline.setShade('red');
        tlc.outline.width = .5;
        tlc.radius = 3;
        tlc.draw(this.context,);

        // bottom right
        let brc = new Circle(brp);
        brc.color.setShade('#121212');
        brc.outline = new LineStyle();
        brc.outline.setShade('red');
        brc.outline.width = .5;
        brc.radius = 4;
        brc.draw(this.context,);

        // bottom left
        let blc = new Circle(blp);
        blc.color.setShade('#121212');
        blc.outline = new LineStyle();
        blc.outline.setShade('red');
        blc.outline.width = .5;
        blc.radius = 4;
        blc.draw(this.context,);
    }

}
