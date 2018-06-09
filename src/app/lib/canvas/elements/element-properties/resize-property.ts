import { Bounds } from '@canvas/objects/bounds';
import { Size } from '@canvas/models/size';
import { Color } from '@canvas/models/color';
import { Vector } from '@canvas/objects/vector';
import { Rectangle } from '@canvas/shapes/rectangle';

export class ResizeProperty {
private position: Vector;
private size: Size;

constructor(position: Vector, size: Size){
    this.position = position;
    this.size = size;
}

    drawHoverMenu(context) {
        // parent position
        let pp = this.position;

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

    private buildRect(context: CanvasRenderingContext2D, position: Vector, size: Size, color: Color): Rectangle {
        let rect = new Rectangle(context, position);
        rect.color = color;
        rect.size = size;
        rect.color.alpha = .35;

        return rect;
    }

    private topCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vector(bounds.topLeft.x + cornerSize.width, bounds.topLeft.y);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(context, p, s, color);
    }

    private bottomCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vector(bounds.bottomLeft.x + cornerSize.width, bounds.bottomLeft.y - cornerSize.height);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(context, p, s, color);
    }

    private leftCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vector(bounds.topLeft.x, bounds.topLeft.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(context, p, s, color);
    }

    private rightCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): Rectangle {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vector(bounds.topRight.x - cornerSize.width, bounds.topRight.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(context, p, s, color);
    }
}
