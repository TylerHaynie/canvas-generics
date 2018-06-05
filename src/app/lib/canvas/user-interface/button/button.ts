import { ButtonEventType } from '../../events/canvas-event-types';
import { Vector } from '../../objects/vector';
import { Color } from '../../models/color';
import { LineStyle } from '../../models/line-style';
import { CanvasEvent } from '../../events/canvas-event';

export class CanvasButton {
    private context: CanvasRenderingContext2D;
    private color: Color;
    private outline: LineStyle;

    position: Vector;
    radius: number;
    icon?: HTMLImageElement;
    text?: string;

    // styles
    defaultColor: Color;
    defaultOutline: LineStyle;

    hoverColor?: Color;
    hoverOutline: LineStyle;

    downColor?: Color;
    downOutline: LineStyle;

    private downCallbackList: () => void[];
    private upCallbackList: () => void[];
    private hoverCallbackList: () => void[];
    private leaveCallbackList: () => void[];

    // event
    private eventType: ButtonEventType;
    private buttonEvent = new CanvasEvent();
    on(on: ButtonEventType, callback: () => void) {
        this.buttonEvent.subscribe(on, callback);
    }

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        this.context = context;
        this.position = position;

        this.color = new Color();
        this.outline = new LineStyle();

        this.defaultColor = this.color;
        this.defaultOutline = this.outline;
    }

    private fireEvent(type: ButtonEventType) {
        this.buttonEvent.fireEvent(type, null);
    }

    buttonDown() {
        this.color = this.defaultColor;
        this.outline = this.defaultOutline;

        if (this.downColor) { this.color = this.downColor; }
        if (this.downOutline) { this.outline = this.downOutline; }

        this.fireEvent(ButtonEventType.DOWN);
    }

    buttonUp() {
        this.color = this.defaultColor;
        this.outline = this.defaultOutline;

        this.fireEvent(ButtonEventType.UP);
    }

    buttonHover() {
        this.color = this.defaultColor;
        this.outline = this.defaultOutline;

        if (this.hoverColor) { this.color = this.hoverColor; }
        if (this.hoverOutline) { this.outline = this.hoverOutline; }

        this.fireEvent(ButtonEventType.HOVER);
    }

    buttonleave() {
        this.color = this.defaultColor;
        this.outline = this.defaultOutline;

        this.fireEvent(ButtonEventType.LEAVE);
    }

    draw() {

    }
}
