import { UI_EVENT_TYPE, MOUSE_STATE } from '../events/canvas-enums';
import { CanvasEvent } from '../events/canvas-event';
import { MouseData } from '../events/event-data';
import { Color } from '../models/color';
import { IDrawable } from '../models/interfaces/idrawable';
import { LineStyle } from '../models/line-style';
import { Shadow } from '../models/shadow';
import { Vertex } from '../objects/vertex';
import { Circle } from '../shapes/circle';
import { Rectangle } from '../shapes/rectangle';
import { ResizeProperty } from './element-properties/resize-property';


//TODO: This need full redesign


export class ElementBase implements IDrawable  {
    private _shape: Rectangle | Circle;
    public get shape(): Rectangle | Circle { return this._shape; }
    public set shape(v: Rectangle | Circle) {
        this._shape = v;
        this.defaultColor = v.color;
        this.defaultOutline = v.outline;
        this.defaultShadow = v.shadow;
    }

    private _isDraggable: boolean = false;
    public get isDraggable(): boolean { return this._isDraggable; }
    public set isDraggable(v: boolean) { this._isDraggable = v; }

    private _isResizable: boolean = false;
    public get isResizable(): boolean { return this._isResizable; }
    public set isResizable(v: boolean) { this._isResizable = v; }
    protected resizeMenu: ResizeProperty;

    // styles
    hoverColor: Color;
    hoverOutline: LineStyle;
    hoverShadow: Shadow;

    downColor: Color;
    downOutline: LineStyle;
    downShadow: Shadow;

    // TODO: define a base and build content types off of that
    // content: any;
    childElements: ElementBase[] = [];

    // hover menu
    private hoverMenuEnabled: boolean = false;
    protected hoverMenu: (context: CanvasRenderingContext2D) => void;

    // styles
    private _defaultColor: Color;
    public set defaultColor(v: Color) {
        this._defaultColor = v;
        this.activeColor = v;
    }

    private _defaultOutline: LineStyle;
    public set defaultOutline(v: LineStyle) {
        this._defaultOutline = v;
        this.activeOutline = v;
    }

    private _defaultShadow: Shadow;
    public set defaultShadow(v: Shadow) {
        this._defaultShadow = v;
        this.activeShadow = v;
    }

    protected activeColor: Color;
    protected activeOutline: LineStyle;
    protected activeShadow: Shadow;

    private previousEventType: UI_EVENT_TYPE;

    // dragging
    private _dragging = false;
    public set isDragging(v: boolean) { this._dragging = v; }
    public get isDragging(): boolean { return this._dragging; }

    private dragOffset: Vertex = new Vertex(0, 0, 0);

    // event
    private _eventType: UI_EVENT_TYPE;
    private canvasEvent = new CanvasEvent<MouseData>();
    on(on: UI_EVENT_TYPE, callback: (e: MouseData) => void) {
        this.canvasEvent.subscribe(on, callback);
    }

    constructor() {
        this.previousEventType = UI_EVENT_TYPE.UP;

        this.activeColor = new Color();
        this.activeOutline = new LineStyle();
        this.activeShadow = new Shadow();

        this._defaultColor = new Color();
    }

    private fireEvent(e: MouseData) {
        // to avoid spamming events
        // if ((this._eventType !== this.previousEventType) || this._eventType === UI_EVENT_TYPE.MOVE) {
        this.canvasEvent.fireEvent(this._eventType, e);
        this.previousEventType = this._eventType;

        // update child objects with event
        this.childElements.forEach(childElement => {
            childElement.fireEvent(e);
        });

        // }
    }

    elementMouseDown(e: MouseData) {
        this._eventType = UI_EVENT_TYPE.DOWN;
        e.uiMouseState = MOUSE_STATE.DEFAULT;

        if (this._isDraggable) {
            this.startDrag(e);
        }

        this.fireEvent(e);
    }

    elementMouseUp(e: MouseData) {
        // so you dont have to wait for the mouse to move to get hover event
        if (this.previousEventType === UI_EVENT_TYPE.DOWN) {
            this._eventType = UI_EVENT_TYPE.HOVER;
        }
        else {
            this._eventType = UI_EVENT_TYPE.UP;
        }

        this._dragging = false;
        e.uiMouseState = MOUSE_STATE.DEFAULT;

        this.fireEvent(e);
    }

    elementMouseHover(e: MouseData) {
        if (this.previousEventType !== UI_EVENT_TYPE.DOWN) {
            // we won't fire hover while mouse is down
            this._eventType = UI_EVENT_TYPE.HOVER;
            this.hoverMenuEnabled = true;
        }

        this.fireEvent(e);
    }

    elementMouseMove(e: MouseData) {
        this._eventType = UI_EVENT_TYPE.MOVE;

        if (this._dragging) {
            this.dragElement(e);
        }

        this.fireEvent(e);
    }

    elementMouseOut(e: MouseData) {
        this._eventType = UI_EVENT_TYPE.OUT;

        this._dragging = false;
        e.uiMouseState = MOUSE_STATE.DEFAULT;

        this.hoverMenuEnabled = false;

        this.fireEvent(e);
    }

    setPosition(x: number, y: number) {
        this.shape.setPosition(x, y, this.shape.position.z);
    }

    getposition() {
        return this.shape.position;
    }

    async draw(context: CanvasRenderingContext2D) {
        this.styleElement();
        this._shape.draw(context);

        // now draw children
        // TODO: need to index children to draw in correct order
        this.childElements.forEach(childElement => {
            childElement.draw(context);
        });

        // draw menu(s)
        if (this.hoverMenuEnabled) {
            if (this.resizeMenu) {
                this.resizeMenu.draw(context);
            }
        }
    }

    private styleElement() {
        this.applyColors();
    }

    private applyColors() {
        this.activeColor = this._defaultColor;
        this.activeOutline = this._defaultOutline;
        this.activeShadow = this._defaultShadow;

        switch (this._eventType) {
            case UI_EVENT_TYPE.DOWN:
                if (this.downColor) { this.activeColor = this.downColor; }
                if (this.downOutline) { this.activeOutline = this.downOutline; }
                if (this.downShadow) { this.activeShadow = this.downShadow; }
                break;
            case UI_EVENT_TYPE.HOVER:
                if (this.hoverColor) { this.activeColor = this.hoverColor; }
                if (this.hoverOutline) { this.activeOutline = this.hoverOutline; }
                if (this.hoverShadow) { this.activeShadow = this.hoverShadow; }
        }

        this._shape.color = this.activeColor;
        this._shape.outline = this.activeOutline;
        this._shape.shadow = this.activeShadow;
    }

    private startDrag(e: MouseData) {
        if (!this._dragging) { this._dragging = true; }
        e.uiMouseState = MOUSE_STATE.GRAB;

        let elementPosition = this.getposition();
        let dx = e.mousePosition.x - elementPosition.x;
        let dy = e.mousePosition.y - elementPosition.y;

        this.dragOffset.setValues(dx, dy, 0);
    }

    private dragElement(e: MouseData) {
        e.uiMouseState = MOUSE_STATE.GRAB;
        // let p = new Vector2D(e.mousePosition.x - this.dragOffset.x, e.mousePosition.y - this.dragOffset.y);
        this.setPosition(e.mousePosition.x - this.dragOffset.x, e.mousePosition.y - this.dragOffset.y);
    }
}
