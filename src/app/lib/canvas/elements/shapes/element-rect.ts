import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Rectangle } from '@canvas/shapes/rectangle';
import { ElementBase } from '@canvas/elements/element-base';
import { UI_EVENT_TYPE } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { LineStyle } from '@canvas/models/line-style';
import { Color } from '@canvas/models/color';
import { Bounds } from '@canvas/objects/bounds';

// This will grow in to a lot more than just a rectangle wrapper...

export class ElementRect extends ElementBase {

    public set cornerRadius(v: number) { (<Rectangle>this.baseElement).cornerRadius = v; }
    public get size(): Size { return (<Rectangle>this.baseElement).size; }
    public set size(v: Size) { (<Rectangle>this.baseElement).size = v; }

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context);
        this.setupBaseElement(context, position);
    }

    private setupBaseElement(context, position) {
        let r = new Rectangle(context, position);
        this.baseElement = r;

        this.hoverMenu = (context) => {
            this.drawHoverMenu(context);
        };
    }

    private drawHoverMenu(context) {
        // parent position
        let pp = this.getposition();

        // parent size
        let ps = this.size;

        // bounds that we are working with
        let b = new Bounds(pp, ps);

        // style
        let cornerSize = new Size(15, 15);
        let cornerColor = new Color('lime');
        let straightColor = new Color('yellow');

        // top left corner
        let tlc = this.buildRect(context, b.topLeft, cornerSize, cornerColor);
        tlc.draw();

        // top Right corner
        let trc = this.buildRect(context, new Vector(b.topRight.x - cornerSize.width, b.topRight.y), cornerSize, cornerColor);
        trc.draw();

        // bottom Right corner
        let brc = this.buildRect(context, new Vector(b.bottomRight.x - cornerSize.width, b.bottomRight.y - cornerSize.height), cornerSize, cornerColor);
        brc.draw();

        // bottom left corner
        let blc = this.buildRect(context, new Vector(b.bottomLeft.x, b.bottomLeft.y - cornerSize.height), cornerSize, cornerColor);
        blc.draw();

        // left center rectangle
        let lcr = this.leftCenterRect(context, b, cornerSize, straightColor);
        lcr.draw();

        // right center rectangle
        let rcr = this.rightCenterRect(context, b, cornerSize, straightColor);
        rcr.draw();

        // top center rectangle
        let topStraight = this.topCenterRect(context, b, cornerSize, straightColor);
        topStraight.draw();

        // bottom center rectangle
        let bottomStraight = this.bottomCenterRect(context, b, cornerSize, straightColor);
        bottomStraight.draw();
    }

    buildRect(context: CanvasRenderingContext2D, position: Vector, size: Size, color: Color): Rectangle {
        let rect = new Rectangle(context, position);
        rect.color = color;
        rect.size = size;
        rect.color.alpha = .35;

        return rect;
    }

    topCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vector(bounds.topLeft.x + cornerSize.width, bounds.topLeft.y);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(context, p, s, color);
    }

    bottomCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vector(bounds.bottomLeft.x + cornerSize.width, bounds.bottomLeft.y - cornerSize.height);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(context, p, s, color);
    }

    leftCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vector(bounds.topLeft.x, bounds.topLeft.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(context, p, s, color);
    }

    rightCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vector(bounds.topRight.x - cornerSize.width, bounds.topRight.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(context, p, s, color);
    }
}
