import { Vector } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';
import { UIEventType } from '@canvas/events/canvas-event-types';
import { CanvasEvent } from '@canvas/events/canvas-event';
import { Circle } from '@canvas/shapes/circle';

export class CanvasUIElement {
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
    private previousEventType: UIEventType;

    // event
    private eventType: UIEventType;
    private buttonEvent = new CanvasEvent();
    on(on: UIEventType, callback: () => void) {
        this.buttonEvent.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        this.context = context;
        this.position = position;
        this.previousEventType = UIEventType.UP;

        this.activeColor = new Color();
        this.activeOutline = new LineStyle();
        this.activeShadow = new Shadow();
    }

    private fireEvent() {
        if (this.eventType !== this.previousEventType) {
            this.buttonEvent.fireEvent(this.eventType, null);
            this.previousEventType = this.eventType;
        }
    }

    buttonDown() {
        this.eventType = UIEventType.DOWN;
    }

    buttonUp() {
        if (this.previousEventType === UIEventType.DOWN) {
            this.eventType = UIEventType.HOVER;
        }
        else {
            this.eventType = UIEventType.UP;
        }
    }

    buttonHover() {
        if (this.previousEventType !== UIEventType.DOWN) {
            this.eventType = UIEventType.HOVER;
        }
    }

    buttonleave() {
        this.eventType = UIEventType.LEAVE;
    }

    draw() {
        this.styleElement();
        this.drawElement();
        this.fireEvent();
    }

    private styleElement() {
        this.activeColor = this.defaultColor;
        this.activeOutline = this.defaultOutline;
        this.activeShadow = this.defaultShadow;

        switch (this.eventType) {
            case UIEventType.DOWN:
                if (this.downColor) { this.activeColor = this.downColor; }
                if (this.downOutline) { this.activeOutline = this.downOutline; }
                if (this.downOutline) { this.activeShadow = this.downShadow; }
                break;
            case UIEventType.HOVER:
                if (this.hoverColor) { this.activeColor = this.hoverColor; }
                if (this.hoverOutline) { this.activeOutline = this.hoverOutline; }
                if (this.hoverShadow) { this.activeShadow = this.hoverShadow; }
        }
    }

    private drawElement() {

        // testing with circle
        let c = new Circle(this.context);
        c.position = this.position;
        c.radius = this.radius;
        c.color = this.activeColor;
        c.outline = this.activeOutline;
        c.shadow = this.activeShadow;

        c.draw();
    }
}
