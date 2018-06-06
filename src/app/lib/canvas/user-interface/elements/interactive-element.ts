import { Vector } from '@canvas/objects/vector';
import { UI_EVENT_TYPE, MOUSE_STATE } from '@canvas/events/canvas-event-types';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { CanvasEvent } from '@canvas/events/canvas-event';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Circle } from '@canvas/shapes/circle';
import { MouseData } from '@canvas/events/event-data';

export class InteractiveElement {

    private _baseElement: Rectangle | Circle;
    public get baseElement(): Rectangle | Circle { return this._baseElement; }
    public set baseElement(v: Rectangle | Circle) { this._baseElement = v; }

    draggable = false;
    resizable = false;

    // styles
    hoverColor?: Color;
    hoverOutline?: LineStyle;
    hoverShadow?: Shadow;

    downColor?: Color;
    downOutline?: LineStyle;
    downShadow?: Shadow;

    // styles
    private _defaultColor: Color;
    public set defaultColor(v: Color) {
        this._defaultColor = v;
        this._activeColor = v;
    }

    private _defaultOutline: LineStyle;
    public set defaultOutline(v: LineStyle) {
        this._defaultOutline = v;
        this._activeOutline = v;
    }

    private _defaultShadow: Shadow;
    public set defaultShadow(v: Shadow) {
        this._defaultShadow = v;
        this._activeShadow = v;
    }

    private _activeColor: Color;
    public set activeColor(v: Color) { this._activeColor = v; }
    public get activeColor(): Color { return this._activeColor; }

    private _activeOutline: LineStyle;
    public set activeOutline(v: LineStyle) { this._activeOutline = v; }
    public get activeOutline(): LineStyle { return this._activeOutline; }

    private _activeShadow: Shadow;
    public set activeShadow(v: Shadow) { this._activeShadow = v; }
    public get activeShadow(): Shadow { return this._activeShadow; }

    private _context: CanvasRenderingContext2D;
    public get context(): CanvasRenderingContext2D { return this._context; }

    private previousEventType: UI_EVENT_TYPE;

    // event
    public get eventType(): UI_EVENT_TYPE { return this._eventType; }
    private _eventType: UI_EVENT_TYPE;
    private canvasEvent = new CanvasEvent<MouseData>();
    on(on: UI_EVENT_TYPE, callback: (e: MouseData) => void) {
        this.canvasEvent.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this.previousEventType = UI_EVENT_TYPE.UP;

        this._activeColor = new Color();
        this._activeOutline = new LineStyle();
        this._activeShadow = new Shadow();

        this.defaultColor = new Color();
        this.hoverOutline = new LineStyle();
        this.hoverOutline.lineWidth = 1;
        this.hoverOutline.shade = '#54ff5f';
    }

    private fireEvent(e: MouseData) {
        if ((this._eventType !== this.previousEventType) || this._eventType === UI_EVENT_TYPE.MOVE) {
            this.canvasEvent.fireEvent(this._eventType, e);
            this.previousEventType = this._eventType;
        }
    }

    elementMouseDown(e: MouseData) {
        this._eventType = UI_EVENT_TYPE.DOWN;

        this.fireEvent(e);
    }

    elementMouseUp(e: MouseData) {
        if (this.previousEventType === UI_EVENT_TYPE.DOWN) {
            this._eventType = UI_EVENT_TYPE.HOVER;
        }
        else {
            this._eventType = UI_EVENT_TYPE.UP;
        }

        this.fireEvent(e);
    }

    elementMouseHover(e: MouseData) {
        if (this.previousEventType !== UI_EVENT_TYPE.DOWN) {
            this._eventType = UI_EVENT_TYPE.HOVER;
        }

        this.fireEvent(e);
    }

    elementMouseMove(e: MouseData) {
        this._eventType = UI_EVENT_TYPE.MOVE;

        this.fireEvent(e);
    }

    elementMouseleave(e: MouseData) {
        this._eventType = UI_EVENT_TYPE.LEAVE;
        this.fireEvent(e);
    }

    elementMouseOut(e: MouseData) {
        this._eventType = UI_EVENT_TYPE.OUT;
        this.fireEvent(e);
    }

    draw() {
        this._baseElement.draw();
        this.styleElement();
    }

    private styleElement() {
        this.applyColors();
    }

    private applyColors() {
        this._activeColor = this._defaultColor;
        this._activeOutline = this._defaultOutline;
        this._activeShadow = this._defaultShadow;

        switch (this.eventType) {
            case UI_EVENT_TYPE.MOVE:
                break;
            case UI_EVENT_TYPE.DOWN:
                if (this.downColor) { this._activeColor = this.downColor; }
                if (this.downOutline) { this._activeOutline = this.downOutline; }
                if (this.downShadow) { this._activeShadow = this.downShadow; }
                break;
            case UI_EVENT_TYPE.HOVER:
                if (this.hoverColor) { this._activeColor = this.hoverColor; }
                if (this.hoverOutline) { this._activeOutline = this.hoverOutline; }
                if (this.hoverShadow) { this._activeShadow = this.hoverShadow; }
        }

        this._baseElement.color = this._activeColor;
        this._baseElement.outline = this._activeOutline;
        this._baseElement.shadow = this._activeShadow;
    }
}
