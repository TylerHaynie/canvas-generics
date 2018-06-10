import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Rectangle } from '@canvas/shapes/rectangle';
import { ElementBase } from '@canvas/elements/element-base';
import { UI_EVENT_TYPE, MOUSE_STATE } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { LineStyle } from '@canvas/models/line-style';
import { Color } from '@canvas/models/color';
import { Bounds } from '@canvas/objects/bounds';
import { ResizeProperty } from '@canvas/elements/element-properties/resize-property';

// This will grow in to a lot more than just a rectangle wrapper...

export class ElementRect extends ElementBase {
    private allowResize: boolean = true;

    public set cornerRadius(v: number) { (<Rectangle>this.baseElement).cornerRadius = v; }
    public get size(): Size { return (<Rectangle>this.baseElement).size; }
    public set size(v: Size) {
        (<Rectangle>this.baseElement).size = v;
        this.buildMenus();
    }

    constructor(context: CanvasRenderingContext2D, position: Vector) {
        super(context);
        this.setupBaseElement(context, position);
        this.on(UI_EVENT_TYPE.MOVE, (e: MouseData) => {
            this.elementMoved(e);
        });
    }

    private setupBaseElement(context, position) {
        let r = new Rectangle(context, position);
        this.baseElement = r;
    }

    private elementMoved(e: MouseData) {
        if (e.uiMouseState === MOUSE_STATE.GRAB) {
            this.buildMenus();
        }
    }

    buildMenus() {
        if (this.allowResize) {
            let resizeMenu = new ResizeProperty(this._context, this.getposition(), this.size);

            // passing down event
            this.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
                this.resizeMenu.mouseMove(e);
            });

            // passing down event
            this.on(UI_EVENT_TYPE.DOWN, (e: MouseData) => {
                this.resizeMenu.mouseDown(e);
            });

            this.resizeMenu = resizeMenu;
        }
    }
}
