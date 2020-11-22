import { Vector2D } from 'canvas/objects/vector';
import { Line } from 'canvas/shapes/line/line';
import { LineSegment } from 'canvas/shapes/line/line-segment';
import { Color } from 'canvas/models/color';
import { LineStyle } from 'canvas/models/line-style';
import { Rectangle } from 'canvas/shapes/rectangle';
import { Size } from 'canvas/models/size';
import { DIRECTION, QUARTERS } from 'canvas/enums';

export class ConnectionObjects {

    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    funnel(pos: Vector2D, direction: DIRECTION, gap: number, style: LineStyle) {
        return this.createArrow(pos, direction, gap, style, true, true, true);
    }

    filledArrow(pos: Vector2D, direction: DIRECTION, gap: number, style: LineStyle) {
        return this.createArrow(pos, direction, gap, style, true, true);
    }

    arrow(pos: Vector2D, direction: DIRECTION, gap: number, style: LineStyle, closePath?: boolean) {
        return this.createArrow(pos, direction, gap, style, false, closePath);
    }

    square(pos: Vector2D, size: Size, color: Color) {
        let r = new Rectangle(this.context, new Vector2D(Math.fround(pos.x - size.width / 2), Math.fround(pos.y - size.height / 2)));
        r.color = color;
        r.size = size;

        return r;
    }

    private createArrow(pos: Vector2D, direction: DIRECTION, gap: number,
        style: LineStyle, isFilled: boolean = false, autoClosePath: boolean = false, isFunnel: boolean = false) {

        let line = new Line(this.context);
        line.autoClosePath = autoClosePath;
        line.style = style;

        switch (direction) {
            case DIRECTION.NORTH:
            case DIRECTION.SOUTH:
                let nsp: Vector2D[] = [];

                // adding points
                nsp.push(new Vector2D(pos.x - gap, direction === DIRECTION.SOUTH ? pos.y - gap : pos.y + gap));
                if (isFunnel) {
                    nsp.push(new Vector2D(pos.x - gap * QUARTERS.ONE, pos.y));
                    nsp.push(new Vector2D(pos.x + gap * QUARTERS.ONE, pos.y));
                }
                else {
                    nsp.push(new Vector2D(pos.x, pos.y));
                }
                nsp.push(new Vector2D(pos.x + gap, direction === DIRECTION.SOUTH ? pos.y - gap : pos.y + gap));

                // create line segment
                let nss = new LineSegment();
                nss.addPoints(nsp);
                nss.fillSegment = isFilled;

                // add the segment to the line
                line.addSegment(nss);
                break;

            case DIRECTION.EAST:
            case DIRECTION.WEST:
                let ewp: Vector2D[] = [];

                // add points for segment
                ewp.push(new Vector2D(direction === DIRECTION.WEST ? pos.x + gap : pos.x - gap, pos.y - gap));
                if (isFunnel) {
                    ewp.push(new Vector2D(pos.x, pos.y - gap * QUARTERS.ONE));
                    ewp.push(new Vector2D(pos.x, pos.y + gap * QUARTERS.ONE));
                }
                else {
                    ewp.push(new Vector2D(pos.x, pos.y));
                }
                ewp.push(new Vector2D(direction === DIRECTION.WEST ? pos.x + gap : pos.x - gap, pos.y + gap));

                // create segment
                let ews = new LineSegment();
                ews.addPoints(ewp);
                ews.fillSegment = isFilled;

                // add segment
                line.addSegment(ews);
                break;
        }

        return line;
    }

}
