import { iRectangle } from '../interfaces/iRectangle';
import { iCircle } from '../interfaces/iCircle';
import { Line } from '../objects/line/line';

export class ShapeUtility {
    private context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    drawRectangle(rect: iRectangle) {
        this.context.save();

        // does it have a shadow
        if (rect.shadow) {
            this.context.shadowBlur = rect.shadow.shadowBlur;
            this.context.shadowColor = rect.shadow.shadowColor;
        }

        // draw the solid rect
        if (rect.color) {
            this.context.globalAlpha = rect.color.modifiedAlpha ? rect.color.modifiedAlpha : rect.color.alpha;
            this.context.fillStyle = rect.color.color;
            this.context.fillRect(rect.vector.x, rect.vector.y, rect.size.width, rect.size.height);
        }

        // draw the outline
        if (rect.outline) {
            this.context.lineWidth = rect.outline.lineWidth;
            this.context.globalAlpha = rect.outline.modifiedAlpha ? rect.outline.modifiedAlpha : rect.outline.alpha;
            this.context.strokeStyle = rect.outline.color;
            this.context.strokeRect(rect.vector.x, rect.vector.y, rect.size.width, rect.size.height);
        }

        this.context.restore();
    }

    drawCircle(circle: iCircle) {
        this.context.save();
        this.context.beginPath();
        this.context.globalAlpha = 0;

        // create the circle
        this.context.arc(circle.vector.x, circle.vector.y, circle.radius, 0, 2 * Math.PI);

        // does it have a shadow
        if (circle.shadow) {
            this.context.shadowBlur = circle.shadow.shadowBlur;
            this.context.shadowColor = circle.shadow.shadowColor;
        }

        // draw solid circle
        if (circle.color) {
            this.context.globalAlpha = circle.color.modifiedAlpha ? circle.color.modifiedAlpha : circle.color.alpha;
            this.context.fillStyle = circle.color.color;

            this.context.fill();
        }

        // does it have an outline
        if (circle.outline) {
            this.context.lineWidth = circle.outline.lineWidth;
            this.context.globalAlpha = circle.outline.modifiedAlpha ? circle.outline.modifiedAlpha : circle.outline.alpha;
            this.context.strokeStyle = circle.outline.color;

            // outline the circle
            this.context.stroke();
        }
        this.context.restore();
    }

    drawLine(line: Line) {
        this.context.save();
        this.context.beginPath();

        line.segments.forEach(segment => {
            this.context.moveTo(segment.startVector.x, segment.startVector.y);
            segment.vectors.forEach(vector => {
                this.context.lineTo(vector.x, vector.y);
            });
        });

        this.context.lineWidth = line.lineWidth;
        this.context.strokeStyle = line.color;
        this.context.globalAlpha = line.modifiedAlpha ? line.modifiedAlpha : line.alpha;
        this.context.stroke();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.restore();
    }

}
