import { Line } from '../objects/line/line';
import { iColor } from '../interfaces/iColor';
import { LineSegment } from '../objects/line/line-segment';
import { CanvasWrapper } from '../canvas-wrapper';
import { ShapeUtility } from './shape-utility';

export class HelperUtility {
    private context: CanvasRenderingContext2D;
    private shape: ShapeUtility;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.shape = new ShapeUtility(this.context);
    }

    drawGrid(color: string, spacing: number, lineWidth: number = 1) {
        let line = new Line();
        line.color = color;
        line.lineWidth = lineWidth;

        // verticle lines
        // start at 0.5 so the lines take up 1 whole pixel and not 2 halves
        for (let x = 0 + 0.5; x < this.context.canvas.width; x += spacing) {
            let segment = new LineSegment({ x: x, y: 0 });
            segment.addVector({ x: x, y: this.context.canvas.height });
            line.addSegment(segment);
        }

        // horizontal
        // start at 0.5 so the lines take up 1 whole pixel and not 2 half pixels
        for (let y = 0 + 0.5; y < this.context.canvas.height; y += spacing) {
            let segment = new LineSegment({ x: 0, y: y });
            segment.addVector({ x: this.context.canvas.width, y: y });
            line.addSegment(segment);
        }

        this.shape.drawLine(line);
    }

    trackMouse(x: number, y: number, color: string, lineWidth: number = 1, drawArrows: boolean = false) {
        let line = new Line();
        line.color = color;
        line.lineWidth = lineWidth;

        // horizontal line
        let x1 = new LineSegment({ x: 0, y: y });
        x1.addVector({ x: this.context.canvas.width, y: y });
        line.addSegment(x1);

        if (drawArrows) {
            // right arrow
            let ra = new LineSegment({ x: this.context.canvas.width - 5, y: y - 5 });
            ra.addVector({ x: this.context.canvas.width, y: y });
            ra.addVector({ x: this.context.canvas.width - 5, y: y + 5 });
            line.addSegment(ra);
        }

        // verticle Line
        let y1 = new LineSegment({ x: x, y: 0 });
        y1.addVector({ x: x, y: this.context.canvas.height });
        line.addSegment(y1);

        if (drawArrows) {
            // down arrow
            let da = new LineSegment({ x: x + 5, y: this.context.canvas.height - 5 });
            da.addVector({ x: x, y: this.context.canvas.height });
            da.addVector({ x: x - 5, y: this.context.canvas.height - 5 });
            line.addSegment(da);
        }

        this.shape.drawLine(line);
    }

}
