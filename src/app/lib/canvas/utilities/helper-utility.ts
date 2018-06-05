import { Vector } from '../objects/vector';
import { Line } from '../shapes/line/line';
import { LineSegment } from '../shapes/line/line-segment';

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
            let segment = new LineSegment(new Vector(x, 0));
            segment.addPoint(new Vector(x, this.context.canvas.height));
            line.addSegment(segment);
        }

        // horizontal
        // start at 0.5 so the lines take up 1 whole pixel and not 2 half pixels
        for (let y = 0 + 0.5; y < this.context.canvas.height; y += spacing) {
            let segment = new LineSegment(new Vector(0, y));
            segment.addPoint(new Vector(this.context.canvas.width, y));
            line.addSegment(segment);
        }

        line.draw();
    }

    trackMouse(point: Vector, color: string, drawArrows: boolean = false) {
        let line = new Line(this.context);
        line.style.shade = color;

        // horizontal line (left)
        let h1 = new LineSegment(new Vector(0, point.y));
        h1.addPoint(new Vector(point.x, point.y));
        line.addSegment(h1);

        // horizontal line (right)
        let x1 = new LineSegment(new Vector(this.context.canvas.width, point.y));
        x1.addPoint(new Vector(point.x, point.y));
        line.addSegment(x1);

        // vertical line (top)
        let v1 = new LineSegment(new Vector(point.x, 0));
        v1.addPoint(new Vector(point.x, point.y));
        line.addSegment(v1);

        // vertical line (bottom)
        let v2 = new LineSegment(new Vector(point.x, this.context.canvas.height));
        v2.addPoint(new Vector(point.x, point.y));
        line.addSegment(v2);

        if (drawArrows) {
            // right arrow
            let ra = new LineSegment(new Vector(this.context.canvas.width - 5, point.y - 5));
            ra.addPoint(new Vector(this.context.canvas.width, point.y));
            ra.addPoint(new Vector(this.context.canvas.width - 5, point.y + 5));
            line.addSegment(ra);

            // left arrow
            let la = new LineSegment(new Vector(5, point.y - 5));
            la.addPoint(new Vector(0, point.y));
            la.addPoint(new Vector(5, point.y + 5));
            line.addSegment(la);

            // bottom arrow
            let da = new LineSegment(new Vector(point.x + 5, this.context.canvas.height - 5));
            da.addPoint(new Vector(point.x, this.context.canvas.height));
            da.addPoint(new Vector(point.x - 5, this.context.canvas.height - 5));
            line.addSegment(da);

            // top  arrow
            let ta = new LineSegment(new Vector(point.x + 5, 5));
            ta.addPoint(new Vector(point.x, 0));
            ta.addPoint(new Vector(point.x - 5, 5));
            line.addSegment(ta);
        }

        line.draw();
    }

}
