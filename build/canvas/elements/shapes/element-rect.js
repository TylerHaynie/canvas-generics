"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_1 = require("canvas/shapes/rectangle");
const element_base_1 = require("canvas/elements/element-base");
const canvas_event_types_1 = require("canvas/events/canvas-event-types");
const resize_property_1 = require("canvas/elements/element-properties/resize-property");
class ElementRect extends element_base_1.ElementBase {
    constructor(context, position) {
        super(context);
        this.allowResize = true;
        this.setupBaseElement(context, position);
        this.on(canvas_event_types_1.UI_EVENT_TYPE.MOVE, (e) => {
            this.elementMoved(e);
        });
    }
    set endGap(v) { this.baseElement.endGap = v; }
    get size() { return this.baseElement.size; }
    set size(v) {
        this.baseElement.size = v;
        this.buildMenus();
    }
    setupBaseElement(context, position) {
        let r = new rectangle_1.Rectangle(context, position);
        this.baseElement = r;
    }
    elementMoved(e) {
        if (e.uiMouseState === canvas_event_types_1.MOUSE_STATE.GRAB) {
            this.buildMenus();
        }
    }
    buildMenus() {
        if (this.allowResize) {
            let resizeMenu = new resize_property_1.ResizeProperty(this._context, this.getposition(), this.size);
            this.on(canvas_event_types_1.UI_EVENT_TYPE.HOVER, (e) => {
                this.resizeMenu.mouseMove(e);
            });
            this.resizeMenu = resizeMenu;
        }
    }
}
exports.ElementRect = ElementRect;
//# sourceMappingURL=element-rect.js.map