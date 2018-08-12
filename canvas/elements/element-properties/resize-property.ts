import { Bounds } from 'canvas/objects/bounds';
import { Size } from 'canvas/models/size';
import { Color } from 'canvas/models/color';
import { Vector2D } from 'canvas/objects/vector';
import { Rectangle } from 'canvas/shapes/rectangle';
import { ElementBase } from 'canvas/elements/element-base';
import { UI_EVENT_TYPE } from 'canvas/events/canvas-event-types';
import { MouseData } from 'canvas/events/event-data';

export class ResizeProperty {
    private context: CanvasRenderingContext2D;
    private position: Vector2D;
    private size: Size;

    private topLeftCorner: ElementBase;
    private topRightCorner: ElementBase;
    private bottomRightCorner: ElementBase;
    private bottomLeftCorner: ElementBase;
    private leftMidRect: ElementBase;
    private rightMidRect: ElementBase;
    private topMidRect: ElementBase;
    private bottomMidRect: ElementBase;

    constructor(context: CanvasRenderingContext2D, position: Vector2D, size: Size) {
        this.context = context;
        this.position = position;
        this.size = size;

        this.buildMenu();
    }

    draw() {
        this.topLeftCorner.draw();
        this.topRightCorner.draw();
        this.bottomRightCorner.draw();
        this.bottomLeftCorner.draw();

        this.leftMidRect.draw();
        this.rightMidRect.draw();
        this.topMidRect.draw();
        this.bottomMidRect.draw();
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
        hoverColor.alpha = 1;

        // top left corner
        this.topLeftCorner = this.buildRect(this.context, b.topLeft, cornerSize, cornerColor);
        this.topLeftCorner.hoverColor = hoverColor;
        this.topLeftCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topLeftBottomRightCornerHover(e, this.topLeftCorner);
        });

        // top Right corner
        this.topRightCorner = this.buildRect(this.context, new Vector2D(b.topRight.x - cornerSize.width, b.topRight.y), cornerSize, cornerColor);
        this.topRightCorner.hoverColor = hoverColor;
        this.topRightCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topRightBottomLeftCornerHover(e, this.topRightCorner);
        });

        // bottom Right corner
        this.bottomRightCorner = this.buildRect(this.context, new Vector2D(b.bottomRight.x - cornerSize.width, b.bottomRight.y - cornerSize.height), cornerSize, cornerColor);
        this.bottomRightCorner.hoverColor = hoverColor;
        this.bottomRightCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topLeftBottomRightCornerHover(e, this.bottomRightCorner);
        });

        // bottom left corner
        this.bottomLeftCorner = this.buildRect(this.context, new Vector2D(b.bottomLeft.x, b.bottomLeft.y - cornerSize.height), cornerSize, cornerColor);
        this.bottomLeftCorner.hoverColor = hoverColor;
        this.bottomLeftCorner.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.topRightBottomLeftCornerHover(e, this.bottomLeftCorner);
        });

        // left center rectangle
        this.leftMidRect = this.leftCenterRect(this.context, b, cornerSize, straightColor);
        this.leftMidRect.hoverColor = hoverColor;
        this.leftMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.verticalHovered(e, this.leftMidRect);
        });

        // right center rectangle
        this.rightMidRect = this.rightCenterRect(this.context, b, cornerSize, straightColor);
        this.rightMidRect.hoverColor = hoverColor;
        this.rightMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.verticalHovered(e, this.rightMidRect);
        });

        // top center rectangle
        this.topMidRect = this.topCenterRect(this.context, b, cornerSize, straightColor);
        this.topMidRect.hoverColor = hoverColor;
        this.topMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.horizontalHovered(e, this.topMidRect);
        });


        // bottom center rectangle
        this.bottomMidRect = this.bottomCenterRect(this.context, b, cornerSize, straightColor);
        this.bottomMidRect.hoverColor = hoverColor;
        this.bottomMidRect.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
            this.horizontalHovered(e, this.bottomMidRect);
        });
    }

    mouseMove(e) {
        // check top left
        if (this.topLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topLeftCorner.elementMouseHover(e);
        }
        else {
            this.topLeftCorner.elementMouseOut(e);
        }

        // check top middle
        if (this.topMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topMidRect.elementMouseHover(e);
        }
        else {
            this.topMidRect.elementMouseOut(e);
        }

        // check top right
        if (this.topRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topRightCorner.elementMouseHover(e);
        }
        else {
            this.topRightCorner.elementMouseOut(e);
        }

        // check right middle
        if (this.rightMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.rightMidRect.elementMouseHover(e);
        }
        else {
            this.rightMidRect.elementMouseOut(e);
        }

        // check bottom right
        if (this.bottomRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomRightCorner.elementMouseHover(e);
        }
        else {
            this.bottomRightCorner.elementMouseOut(e);
        }

        // check bottom middle
        if (this.bottomMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomMidRect.elementMouseHover(e);
        }
        else {
            this.bottomMidRect.elementMouseOut(e);
        }

        // check bottom left
        if (this.bottomLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomLeftCorner.elementMouseHover(e);
        }
        else {
            this.bottomLeftCorner.elementMouseOut(e);
        }

        // check left middle
        if (this.leftMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.leftMidRect.elementMouseHover(e);
        }
        else {
            this.leftMidRect.elementMouseOut(e);
        }
    }

    mouseDown(e) {

        // check top left
        if (this.topLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topLeftCorner.elementMouseDown(e);
        }

        // check top middle
        if (this.topMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topMidRect.elementMouseDown(e);
        }

        // check top right
        if (this.topRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.topRightCorner.elementMouseDown(e);
        }

        // check right middle
        if (this.rightMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.rightMidRect.elementMouseDown(e);
        }

        // check bottom right
        if (this.bottomRightCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomRightCorner.elementMouseDown(e);
        }

        // check bottom middle
        if (this.bottomMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomMidRect.elementMouseDown(e);
        }

        // check bottom left
        if (this.bottomLeftCorner.baseElement.pointWithinBounds(e.mousePosition)) {
            this.bottomLeftCorner.elementMouseDown(e);
        }

        // check left middle
        if (this.leftMidRect.baseElement.pointWithinBounds(e.mousePosition)) {
            this.leftMidRect.elementMouseDown(e);
        }
    }

    private buildRect(context: CanvasRenderingContext2D, position: Vector2D, size: Size, color: Color): ElementBase {
        let rect = new Rectangle(context, position);
        rect.color = color;
        rect.size = size;
        rect.color.alpha = .35;

        let eb = new ElementBase(context);
        eb.baseElement = rect;

        return eb;
    }

    private topCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vector2D(bounds.topLeft.x + cornerSize.width, bounds.topLeft.y);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(context, p, s, color);
    }

    private bottomCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let w = bounds.width - (cornerSize.width * 2);
        let p = new Vector2D(bounds.bottomLeft.x + cornerSize.width, bounds.bottomLeft.y - cornerSize.height);
        let s = new Size(w, cornerSize.height);

        return this.buildRect(context, p, s, color);
    }

    private leftCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vector2D(bounds.topLeft.x, bounds.topLeft.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(context, p, s, color);
    }

    private rightCenterRect(context: CanvasRenderingContext2D, bounds: Bounds, cornerSize: Size, color: Color): ElementBase {
        let h = bounds.height - (cornerSize.height * 2);
        let p = new Vector2D(bounds.topRight.x - cornerSize.width, bounds.topRight.y + cornerSize.height);
        let s = new Size(cornerSize.width, h);

        return this.buildRect(context, p, s, color);
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
