import { Vector2D } from 'canvas/objects/vector';
import { UI_EVENT_TYPE } from 'canvas/events/canvas-event-types';
import { Color } from 'canvas/models/color';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { Rectangle } from 'canvas/shapes/rectangle';
import { Circle } from 'canvas/shapes/circle';
import { MouseData } from 'canvas/events/event-data';
import { ResizeProperty } from 'canvas/elements/element-properties/resize-property';
export declare class ElementBase {
    private _baseElement;
    baseElement: Rectangle | Circle;
    private _isDraggable;
    isDraggable: boolean;
    private _isResizable;
    isResizable: boolean;
    protected resizeMenu: ResizeProperty;
    hoverColor: Color;
    hoverOutline: LineStyle;
    hoverShadow: Shadow;
    downColor: Color;
    downOutline: LineStyle;
    downShadow: Shadow;
    childElements: ElementBase[];
    private hoverMenuEnabled;
    protected hoverMenu: (context: CanvasRenderingContext2D) => void;
    private _defaultColor;
    defaultColor: Color;
    private _defaultOutline;
    defaultOutline: LineStyle;
    private _defaultShadow;
    defaultShadow: Shadow;
    protected activeColor: Color;
    protected activeOutline: LineStyle;
    protected activeShadow: Shadow;
    protected _context: CanvasRenderingContext2D;
    private previousEventType;
    private _dragging;
    isDragging: boolean;
    private dragOffset;
    private _eventType;
    private canvasEvent;
    on(on: UI_EVENT_TYPE, callback: (e: MouseData) => void): void;
    constructor(context: CanvasRenderingContext2D);
    private fireEvent(e);
    elementMouseDown(e: MouseData): void;
    elementMouseUp(e: MouseData): void;
    elementMouseHover(e: MouseData): void;
    elementMouseMove(e: MouseData): void;
    elementMouseOut(e: MouseData): void;
    setPosition(position: Vector2D): void;
    getposition(): Vector2D;
    draw(): void;
    private styleElement();
    private applyColors();
    private startDrag(e);
    private dragElement(e);
}
