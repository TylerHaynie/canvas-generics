import { DIRECTION, QUARTERS } from '../events/canvas-enums';
import { Color } from '../models/color';
import { LineStyle } from '../models/line-style';
import { Size } from '../models/size';
import { Line } from '../shapes/line/line';
import { LineSegment } from '../shapes/line/line-segment';
import { Rectangle } from '../shapes/rectangle';
import { Vertex } from './vertex';

export class ConnectionObjects {

    constructor() { }

    funnel(pos: Vertex, direction: DIRECTION, gap: number, style: LineStyle): Line  {
        return this.createArrow(pos, direction, gap, style, true, true, true);
    }

    filledArrow(pos: Vertex, direction: DIRECTION, gap: number, style: LineStyle): Line  {
        return this.createArrow(pos, direction, gap, style, true, true);
    }

    arrow(pos: Vertex, direction: DIRECTION, gap: number, style: LineStyle, closePath?: boolean): Line  {
        return this.createArrow(pos, direction, gap, style, false, closePath);
    }

    square(pos: Vertex, size: Size, color: Color) : Rectangle {
        let r = new Rectangle(new Vertex(Math.fround(pos.x - size.width / 2), Math.fround(pos.y - size.height / 2)));
        r.color = color;
        r.size = size;

        return r;
    }

    private createArrow(pos: Vertex, direction: DIRECTION, gap: number,
        style: LineStyle, isFilled: boolean = false, autoClosePath: boolean = false, isFunnel: boolean = false): Line {

        let line = new Line();
        line.style = style;

        switch (direction) {
            case DIRECTION.NORTH:
            case DIRECTION.SOUTH:
                let nsp: Vertex[] = [];

                // adding points
                nsp.push(new Vertex(pos.x - gap, direction === DIRECTION.SOUTH ? pos.y - gap : pos.y + gap));
                if (isFunnel) {
                    nsp.push(new Vertex(pos.x - gap * QUARTERS.ONE, pos.y));
                    nsp.push(new Vertex(pos.x + gap * QUARTERS.ONE, pos.y));
                }
                else {
                    nsp.push(new Vertex(pos.x, pos.y));
                }
                nsp.push(new Vertex(pos.x + gap, direction === DIRECTION.SOUTH ? pos.y - gap : pos.y + gap));

                // create line segment
                let nss = new LineSegment();
                nss.addPoints(nsp);
                nss.fillSegment = isFilled;

                // add the segment to the line
                line.addSegment(nss);
                break;

            case DIRECTION.EAST:
            case DIRECTION.WEST:
                let ewp: Vertex[] = [];

                // add points for segment
                ewp.push(new Vertex(direction === DIRECTION.WEST ? pos.x + gap : pos.x - gap, pos.y - gap));
                if (isFunnel) {
                    ewp.push(new Vertex(pos.x, pos.y - gap * QUARTERS.ONE));
                    ewp.push(new Vertex(pos.x, pos.y + gap * QUARTERS.ONE));
                }
                else {
                    ewp.push(new Vertex(pos.x, pos.y));
                }
                ewp.push(new Vertex(direction === DIRECTION.WEST ? pos.x + gap : pos.x - gap, pos.y + gap));

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
