import { ButtonEventType } from '../../events/canvas-event-types';
import { Vector } from '../../objects/vector';
import { Color } from '../../models/color';
import { LineStyle } from '../../models/line-style';
import { CanvasEvent } from '../../events/canvas-event';
import { Circle } from '../../shapes/circle';
import { Shadow } from '../../models/shadow';

export class CanvasButton {
    // public
    position: Vector = new Vector(0, 0);
    radius: number = 1;
    icon?: HTMLImageElement;
    text?: string;

    // styles
    hoverColor?: Color;
    hoverOutline?: LineStyle;
    hoverShadow?: Shadow;

    downColor?: Color;
    downOutline?: LineStyle;
    downShadow?: Shadow;

    // styles
    private defaultColor: Color;
    public set color(v: Color) {
        this.defaultColor = v;
        this.activeColor = v;
    }

    private defaultOutline: LineStyle;
    public set outline(v: LineStyle) {
        this.defaultOutline = v;
        this.activeOutline = v;
    }

    private defaultShadow: Shadow;
    public set shadow(v: Shadow) {
        this.defaultShadow = v;
        this.activeShadow = v;
    }

    private context: CanvasRenderingContext2D;
    private activeColor: Color;
    private activeOutline: LineStyle;
    private activeShadow: Shadow;
    private previousEventType: ButtonEventType;

    // event
    private eventType: ButtonEventType;
    private buttonEvent = new CanvasEvent();
    on(on: ButtonEventType, callback: () => void) {
        this.buttonEvent.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        this.context = context;
        this.position = position;
        this.previousEventType = ButtonEventType.UP;

        this.activeColor = new Color();
        this.activeOutline = new LineStyle();
        this.activeShadow = new Shadow();
    }

    private fireEvent(type: ButtonEventType) {
        if (this.eventType !== this.previousEventType) {
            console.log(`Button: ${this.eventType}`);
            this.buttonEvent.fireEvent(type, null);
            this.previousEventType = type;
        }
    }

    buttonDown() {
        this.eventType = ButtonEventType.DOWN;
    }

    buttonUp() {
        if (this.previousEventType === ButtonEventType.DOWN) {
            this.eventType = ButtonEventType.HOVER;
        }
        else {
            this.eventType = ButtonEventType.UP;
        }
    }

    buttonHover() {
        if (this.previousEventType !== ButtonEventType.DOWN) {
            this.eventType = ButtonEventType.HOVER;
        }
    }

    buttonleave() {
        this.eventType = ButtonEventType.LEAVE;
    }

    draw() {
        this.HandleButton();
        this.drawButton();
    }

    private HandleButton() {
        this.activeColor = this.defaultColor;
        this.activeOutline = this.defaultOutline;
        this.activeShadow = this.defaultShadow;

        switch (this.eventType) {
            case ButtonEventType.DOWN:
                if (this.downColor) { this.activeColor = this.downColor; }
                if (this.downOutline) { this.activeOutline = this.downOutline; }
                if (this.downOutline) { this.activeShadow = this.downShadow; }

                this.fireEvent(ButtonEventType.DOWN);
                break;
            case ButtonEventType.UP:
                this.fireEvent(ButtonEventType.UP);
                break;
            case ButtonEventType.LEAVE:
                this.fireEvent(ButtonEventType.LEAVE);
                break;
            case ButtonEventType.HOVER:
                if (this.hoverColor) { this.activeColor = this.hoverColor; }
                if (this.hoverOutline) { this.activeOutline = this.hoverOutline; }
                if (this.hoverShadow) { this.activeShadow = this.hoverShadow; }

                this.fireEvent(ButtonEventType.HOVER);
                break;

            default:
                break;
        }
    }

    private drawButton() {
        let c = new Circle(this.context);
        c.position = this.position;
        c.radius = this.radius;
        c.color = this.activeColor;
        c.outline = this.activeOutline;
        c.shadow = this.activeShadow;

        c.draw();
    }
}
