import { Line } from 'canvas/shapes/line/line';
import { LineSegment } from 'canvas/shapes/line/line-segment';
import { MOUSE_STATE } from 'canvas/events/canvas-enums';
import { Circle } from 'canvas/shapes/circle';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { Vector2D } from 'canvas/objects/vector';

export class HelperUtility {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    drawGrid(color: string, spacing: number) {
        let line = new Line(this.context);
        line.style.shade = color;

        // TODO: I want to start the gird at center

        // vertical lines
        // start at 0.5 so the lines take up 1 whole pixel and not 2 halves
        for (let x = 0 + 0.5; x < this.context.canvas.width; x += spacing) {
            let segment = new LineSegment();
            segment.addPoints([new Vector2D(x, 0), new Vector2D(x, this.context.canvas.height)]);
            line.addSegment(segment);
        }

        // horizontal
        // start at 0.5 so the lines take up 1 whole pixel and not 2 half pixels
        for (let y = 0 + 0.5; y < this.context.canvas.height; y += spacing) {
            let segment = new LineSegment();
            segment.addPoints([new Vector2D(0, y), new Vector2D(this.context.canvas.width, y)
            ]);
            line.addSegment(segment);
        }

        line.draw();
    }

    trackMouse(v: Vector2D, color: string, drawArrows: boolean = false) {
        let line = new Line(this.context);
        line.style.shade = color;

        // horizontal line (left)
        let h1 = new LineSegment();
        h1.addPoints([new Vector2D(0, v.y), new Vector2D(v.x, v.y)]);
        line.addSegment(h1);

        // horizontal line (right)
        let x1 = new LineSegment();
        x1.addPoints([new Vector2D(this.context.canvas.width, v.y), new Vector2D(v.x, v.y)]);
        line.addSegment(x1);

        // vertical line (top)
        let v1 = new LineSegment();
        v1.addPoints([new Vector2D(v.x, 0), new Vector2D(v.x, v.y)]);
        line.addSegment(v1);

        // vertical line (bottom)
        let v2 = new LineSegment();
        v2.addPoints([new Vector2D(v.x, this.context.canvas.height), new Vector2D(v.x, v.y)]);
        line.addSegment(v2);

        if (drawArrows) {
            // right arrow
            let ra = new LineSegment();
            ra.addPoints([
                new Vector2D(this.context.canvas.width - 5, v.y - 5),
                new Vector2D(this.context.canvas.width, v.y),
                new Vector2D(this.context.canvas.width - 5, v.y + 5)
            ]);
            line.addSegment(ra);

            // left arrow
            let la = new LineSegment();
            la.addPoints([
                new Vector2D(5, v.y - 5),
                new Vector2D(0, v.y),
                new Vector2D(5, v.y + 5)
            ]);
            line.addSegment(la);

            // bottom arrow
            let da = new LineSegment();
            da.addPoints([
                new Vector2D(v.x + 5, this.context.canvas.height - 5),
                new Vector2D(v.x, this.context.canvas.height),
                new Vector2D(v.x - 5, this.context.canvas.height - 5)
            ]);
            line.addSegment(da);

            // top  arrow
            let ta = new LineSegment();
            ta.addPoints([
                new Vector2D(v.x + 5, 5),
                new Vector2D(v.x, 0),
                new Vector2D(v.x - 5, 5)
            ]);
            line.addSegment(ta);
        }

        line.draw();
    }

    drawMouse(position: Vector2D, state: MOUSE_STATE) {
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

    private redDotMouse(position: Vector2D) {
        // circle outline
        let co = new Circle(this.context, position);
        co.radius = 20;
        co.color = undefined;
        co.outline = new LineStyle();
        co.outline.shade = '#555';
        co.outline.alpha = .50;

        // center point
        let cp = new Circle(this.context, position);
        cp.color.shade = '#e80000';
        cp.radius = 1;

        cp.draw();
        co.draw();
    }

    private holdMeMouse(position: Vector2D) {
        let lineLength = 10;
        let line = new Line(this.context);
        line.style.shade = '#d14d02';
        line.style.width = .65;
        line.shadow = new Shadow();
        line.shadow.shade = '#000';
        line.shadow.blur = 4;

        // top right
        let trp = new Vector2D(position.x + lineLength + 1, position.y - lineLength - 1);
        // top left
        let tlp = new Vector2D(position.x - lineLength, position.y - lineLength);
        // bottom right
        let brp = new Vector2D(position.x + lineLength, position.y + lineLength);
        // bottom left
        let blp = new Vector2D(position.x - lineLength + 3, position.y + lineLength - 3);

        let trs = new LineSegment();
        trs.addPoints([position, trp]);
        line.addSegment(trs);

        let tls = new LineSegment();
        tls.addPoints([position, tlp]);
        line.addSegment(tls);

        let brs = new LineSegment();
        brs.addPoints([position, brp]);
        line.addSegment(brs);

        let bls = new LineSegment();
        bls.addPoints([position, blp]);
        line.addSegment(bls);

        // draw line
        line.draw();

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
        let r1 = new Circle(this.context, new Vector2D(position.x, position.y));
        r1.color.shade = '#121212';
        r1.outline = new LineStyle();
        r1.outline.shade = 'red';
        r1.outline.width = .5;
        r1.radius = 2;
        r1.draw();

        // top right
        let trc = new Circle(this.context, trp);
        trc.color.shade = '#121212';
        trc.outline = new LineStyle();
        trc.outline.shade = 'red';
        trc.outline.width = .5;
        trc.radius = 6;
        trc.draw();

        // top left
        let tlc = new Circle(this.context, tlp);
        tlc.color.shade = '#121212';
        tlc.outline = new LineStyle();
        tlc.outline.shade = 'red';
        tlc.outline.width = .5;
        tlc.radius = 3;
        tlc.draw();

        // bottom right
        let brc = new Circle(this.context, brp);
        brc.color.shade = '#121212';
        brc.outline = new LineStyle();
        brc.outline.shade = 'red';
        brc.outline.width = .5;
        brc.radius = 4;
        brc.draw();

        // bottom left
        let blc = new Circle(this.context, blp);
        blc.color.shade = '#121212';
        blc.outline = new LineStyle();
        blc.outline.shade = 'red';
        blc.outline.width = .5;
        blc.radius = 4;
        blc.draw();
    }

}
