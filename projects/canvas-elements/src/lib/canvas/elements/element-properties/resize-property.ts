import { UI_EVENT_TYPE } from '../../events/canvas-enums';
import { MouseData } from '../../events/event-data';
import { Color } from '../../models/color';
import { Size } from '../../models/size';
import { Bounds } from '../../objects/bounds';
import { Vertex } from '../../objects/vertex';
import { Rectangle } from '../../shapes/rectangle';
import { ElementBase } from '../element-base';

export class ResizeProperty {
    private position: Vertex;
    private size: Size;

    private topLeftCorner: ElementBase;
    private topRightCorner: ElementBase;
    private bottomRightCorner: ElementBase;
    private bottomLeftCorner: ElementBase;
    private leftMidRect: ElementBase;
    private rightMidRect: ElementBase;
    private topMidRect: ElementBase;
    private bottomMidRect: ElementBase;

    constructor(position: Vertex, size: Size) {
        this.position = position;
        this.size = size;

        this.buildMenu();
    }

    draw(context: CanvasRenderingContext2D) {
        this.topLeftCorner.draw(context);
        this.topRightCorner.draw(context);
        this.bottomRightCorner.draw(context);
        this.bottomLeftCorner.draw(context);

        this.leftMidRect.draw(context);
        this.rightMidRect.draw(context);
        this.topMidRect.draw(context);
        this.bottomMidRect.draw(context);
    }

    private buildMenu() {
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
        let hoverColor = new Color('pink');
        hoverColor.setAlpha(1);

        // top left corner
        this.topLeftCorner = this.buildRect(b.topLeft, cornerSize, cornerColor);
        this.topLeftCorner.hoverColor = hoverColor;
        this.topLeftCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topLeftBottomRightCornerHover(e, this.topLeftCorner);
        });

        // top Right corner
        this.topRightCorner = this.buildRect(new Vertex(b.topRight.x - cornerSize.width, b.topRight.y), cornerSize, cornerColor);
        this.topRightCorner.hoverColor = hoverColor;
        this.topRightCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topRightBottomLeftCornerHover(e, this.topRightCorner);
        });

        // bottom Right corner
        this.bottomRightCorner = this.buildRect(new Vertex(b.bottomRight.x - cornerSize.width, b.bottomRight.y - cornerSize.height), cornerSize, cornerColor);
        this.bottomRightCorner.hoverColor = hoverColor;
        this.bottomRightCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topLeftBottomRightCornerHover(e, this.bottomRightCorner);
        });

        // bottom left corner
        this.bottomLeftCorner = this.buildRect(new Vertex(b.bottomLeft.x, b.bottomLeft.y - cornerSize.height), cornerSize, cornerColor);
        this.bottomLeftCorner.hoverColor = hoverColor;
        this.bottomLeftCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topRightBottomLeftCornerHover(e, this.bottomLeftCorner);
        });

        // left center rectangle
        this.leftMidRect = this.leftCenterRect(b, cornerSize, straightColor);
        this.leftMidRect.hoverColor = hoverColor;
        this.leftMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.verticalHovered(e, this.leftMidRect);
        });

        // right center rectangle
        this.rightMidRect = this.rightCenterRect(b, cornerSize, straightColor);
        this.rightMidRect.hoverColor = hoverColor;
        this.rightMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.verticalHovered(e, this.rightMidRect);
        });

        // top center rectangle
        this.topMidRect = this.topCenterRect(b, cornerSize, straightColor);
        this.topMidRect.hoverColor = hoverColor;
        this.topMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.horizontalHovered(e, this.topMidRect);
        });


        // bottom center rectangle
        this.bottomMidRect = this.bottomCenterRect(b, cornerSize, straightColor);
        this.bottomMidRect.hoverColor = hoverColor;
        this.bottomMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.horizontalHovered(e, this.bottomMidRect);
        });
    }

    mouseMove(e) {
        // check top left
        if (this.topLeftCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.topLeftCorner.elementMouseHover(e);
        }
        else {
            this.topLeftCorner.elementMouseOut(e);
        }

        // check top middle
        if (this.topMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.topMidRect.elementMouseHover(e);
        }
        else {
            this.topMidRect.elementMouseOut(e);
        }

        // check top right
        if (this.topRightCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.topRightCorner.elementMouseHover(e);
        }
        else {
            this.topRightCorner.elementMouseOut(e);
        }

        // check right middle
        if (this.rightMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.rightMidRect.elementMouseHover(e);
        }
        else {
            this.rightMidRect.elementMouseOut(e);
        }

        // check bottom right
        if (this.bottomRightCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.bottomRightCorner.elementMouseHover(e);
        }
        else {
            this.bottomRightCorner.elementMouseOut(e);
        }

        // check bottom middle
        if (this.bottomMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.bottomMidRect.elementMouseHover(e);
        }
        else {
            this.bottomMidRect.elementMouseOut(e);
        }

        // check bottom left
        if (this.bottomLeftCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.bottomLeftCorner.elementMouseHover(e);
        }
        else {
            this.bottomLeftCorner.elementMouseOut(e);
        }

        // check left middle
        if (this.leftMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.leftMidRect.elementMouseHover(e);
        }
        else {
            this.leftMidRect.elementMouseOut(e);
        }
    }

    mouseDown(e) {
        // TODO: I don't like this. needs to at least use elseif

        // check top left
        if (this.topLeftCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.topLeftCorner.elementMouseDown(e);
        }

        // check top middle
        if (this.topMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.topMidRect.elementMouseDown(e);
        }

        // check top right
        if (this.topRightCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.topRightCorner.elementMouseDown(e);
        }

        // check right middle
        if (this.rightMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.rightMidRect.elementMouseDown(e);
        }

        // check bottom right
        if (this.bottomRightCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.bottomRightCorner.elementMouseDown(e);
        }

        // check bottom middle
        if (this.bottomMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.bottomMidRect.elementMouseDown(e);
        }

        // check bottom left
        if (this.bottomLeftCorner.shape.pointWithinBounds(e.mousePosition)) {
            this.bottomLeftCorner.elementMouseDown(e);
        }

        // check left middle
        if (this.leftMidRect.shape.pointWithinBounds(e.mousePosition)) {
            this.leftMidRect.elementMouseDown(e);
        }
    }

    private buildRect(position: Vertex, size: Size, color: Color): ElementBase {
        let rect = new Rectangle(position);
        rect.color = color;
        rect.size = size;
        rect.color.setAlpha(.35);

        let eb = new ElementBase();
        eb.shape = rect;

        return eb;
    }

    private topCenterRect(bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vertex(bounds.topLeft.x + cornerSize.width, bounds.topLeft.y);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(p, s, color);
    }

    private bottomCenterRect(bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vertex(bounds.bottomLeft.x + cornerSize.width, bounds.bottomLeft.y - cornerSize.height);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(p, s, color);
    }

    private leftCenterRect(bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vertex(bounds.topLeft.x, bounds.topLeft.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(p, s, color);
    }

    private rightCenterRect(bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vertex(bounds.topRight.x - cornerSize.width, bounds.topRight.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(p, s, color);
    }

    private topLeftBottomRightCornerHover(e: MouseData, element: ElementBase) {

    }

    private topRightBottomLeftCornerHover(e: MouseData, element: ElementBase) {

    }

    private horizontalHovered(e: MouseData, element: ElementBase) {

    }

    private verticalHovered(e: MouseData, element: ElementBase) {

    }
}
