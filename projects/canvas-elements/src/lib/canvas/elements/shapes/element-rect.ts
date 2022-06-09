// This will grow in to a lot more than just a rectangle wrapper...

import { UI_EVENT_TYPE, MOUSE_STATE } from '../../events/canvas-enums';
import { MouseData } from '../../events/event-data';
import { Size } from '../../models/size';
import { Vector2D } from '../../objects/vector';
import { Rectangle } from '../../shapes/rectangle';
import { ElementBase } from '../element-base';
import { ResizeProperty } from '../element-properties/resize-property';

export class ElementRect extends ElementBase {
    private allowResize: boolean = true;

    public set endGap(v: number) { (<Rectangle>this.baseElement).endGap = v; }
    public get size(): Size { return (<Rectangle>this.baseElement).size; }
    public set size(v: Size) {
        (<Rectangle>this.baseElement).size = v;
        this.buildMenus();
    }

    constructor(context: CanvasRenderingContext2D, position: Vector2D) {
        super(context);
        this.setupBaseElement(context, position);
        this.on(UI_EVENT_TYPE.MOVE, (e: MouseData) => {
            this.elementMoved(e);
        });
    }

    private setupBaseElement(context: CanvasRenderingContext2D, position: Vector2D) {
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
            // this.on(UI_EVENT_TYPE.DOWN, (e: MouseData) => {
            //     this.resizeMenu.mouseDown(e);

            // });

            this.resizeMenu = resizeMenu;
        }
    }
}