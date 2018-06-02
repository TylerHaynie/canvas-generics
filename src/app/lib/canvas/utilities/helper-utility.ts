import { Line } from '../objects/line/line';
import { iColor } from '../interfaces/iColor';
import { LineSegment } from '../objects/line/line-segment';
import { CanvasWrapper } from '../canvas-wrapper';
import { ShapeUtility } from './shape-utility';

export class HelperUtility {
    private context: CanvasRenderingContext2D;
    private shapes: ShapeUtility;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.shapes = new ShapeUtility(this.context);
    }

    drawGrid(color: string, spacing: number, lineWidth: number = 1) {
        let line = new Line();
        line.color = color;
        line.lineWidth = lineWidth;

        // verticle lines
        // start at 0.5 so the lines take up 1 whole pixel and not 2 halves
        for (let x = 0 + 0.5; x < this.context.canvas.width; x += spacing) {
            let segment = new LineSegment({ x: x, y: 0 });
            segment.addPoint({ x: x, y: this.context.canvas.height });
            line.addSegment(segment);
        }

        // horizontal
        // start at 0.5 so the lines take up 1 whole pixel and not 2 half pixels
        for (let y = 0 + 0.5; y < this.context.canvas.height; y += spacing) {
            let segment = new LineSegment({ x: 0, y: y });
            segment.addPoint({ x: this.context.canvas.width, y: y });
            line.addSegment(segment);
        }

        this.shapes.drawLine(line);
    }

    trackMouse(x: number, y: number, color: string, lineWidth: number = 1, drawArrows: boolean = false) {
        let lineGap = 0;
        let line = new Line();
        line.color = color;
        line.lineWidth = lineWidth;

        // horizontal line
        let x1 = new LineSegment({ x: 0, y: y });
        x1.addPoint({ x: this.context.canvas.width / 2 - lineGap, y: y });
        line.addSegment(x1);

        // creating a gap
        let x2 = new LineSegment({ x: this.context.canvas.width / 2 + lineGap, y: y });
        x2.addPoint({ x: this.context.canvas.width, y: y });
        line.addSegment(x2);

        if (drawArrows) {
            // right arrow
            let ra = new LineSegment({ x: this.context.canvas.width - 5, y: y - 5 });
            ra.addPoint({ x: this.context.canvas.width, y: y });
            ra.addPoint({ x: this.context.canvas.width - 5, y: y + 5 });
            line.addSegment(ra);
        }

        // verticle Line
        let y1 = new LineSegment({ x: x, y: 0 });
        y1.addPoint({ x: x, y: this.context.canvas.height / 2 - lineGap });
        line.addSegment(y1);

        // creating a gap
        let y2 = new LineSegment({ x: x, y: this.context.canvas.height / 2 + lineGap });
        y2.addPoint({ x: x, y: this.context.canvas.height });
        line.addSegment(y2);

        if (drawArrows) {
            // down arrow
            let da = new LineSegment({ x: x + 5, y: this.context.canvas.height - 5 });
            da.addPoint({ x: x, y: this.context.canvas.height });
            da.addPoint({ x: x - 5, y: this.context.canvas.height - 5 });
            line.addSegment(da);
        }

        // writing 'x' and 'y' in the gaps
        // this.context.fillText(this.xText, this.size.width / 2 - 2.5, this.point.y + 2.5);
        // this.context.fillText(this.yText, this.point.x - 2.5, this.size.height / 2 + 2.5);

        this.shapes.drawLine(line);
    }

}
