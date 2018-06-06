import { Vector } from '@canvas/objects/vector';
import { UIEventType } from '@canvas/events/canvas-event-types';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { CanvasEvent } from '@canvas/events/canvas-event';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Circle } from '@canvas/shapes/circle';

export class InteractiveElement {
    position: Vector = new Vector(0, 0);
    baseElement: Rectangle | Circle;

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

    private previousEventType: UIEventType;

    // event
    public get eventType(): UIEventType { return this._eventType; }
    private _eventType: UIEventType;
    private buttonEvent = new CanvasEvent();
    on(on: UIEventType, callback: () => void) {
        this.buttonEvent.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        this._context = context;
        this.position = position;
        this.previousEventType = UIEventType.UP;

        this._activeColor = new Color();
        this._activeOutline = new LineStyle();
        this._activeShadow = new Shadow();
    }

    private fireEvent() {
        if (this._eventType !== this.previousEventType) {
            this.buttonEvent.fireEvent(this._eventType, null);
            this.previousEventType = this._eventType;
        }
    }

    buttonDown() {
        this._eventType = UIEventType.DOWN;

        this.fireEvent();
    }

    buttonUp() {
        if (this.previousEventType === UIEventType.DOWN) {
            this._eventType = UIEventType.HOVER;
        }
        else {
            this._eventType = UIEventType.UP;
        }

        this.fireEvent();
    }

    buttonHover() {
        if (this.previousEventType !== UIEventType.DOWN) {
            this._eventType = UIEventType.HOVER;
        }

        this.fireEvent();
    }

    buttonleave() {
        this._eventType = UIEventType.LEAVE;
        this.fireEvent();
    }

    draw() {
        this.baseElement.draw();
        this.styleElement();
    }

    private styleElement() {
        this.applyColors();
    }

    private applyColors(){
        this._activeColor = this._defaultColor;
        this._activeOutline = this._defaultOutline;
        this._activeShadow = this._defaultShadow;

        switch (this.eventType) {
            case UIEventType.DOWN:
                if (this.downColor) { this._activeColor = this.downColor; }
                if (this.downOutline) { this._activeOutline = this.downOutline; }
                if (this.downOutline) { this._activeShadow = this.downShadow; }
                break;
            case UIEventType.HOVER:
                if (this.hoverColor) { this._activeColor = this.hoverColor; }
                if (this.hoverOutline) { this._activeOutline = this.hoverOutline; }
                if (this.hoverShadow) { this._activeShadow = this.hoverShadow; }
        }

        this.baseElement.color = this._activeColor;
        this.baseElement.outline = this._activeOutline;
        this.baseElement.shadow = this._activeShadow;
    }
}
