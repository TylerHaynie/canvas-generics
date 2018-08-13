"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MOUSE_STATE;
(function (MOUSE_STATE) {
    MOUSE_STATE["MOVING"] = "move";
    MOUSE_STATE["TLBR_CORNER_RESIZE"] = "tlbr-corner-resize";
    MOUSE_STATE["TRBL_CORNER_RESIZE"] = "trbl-corner-resize";
    MOUSE_STATE["HORIZONTAL_RESIZE"] = "horizontal-resize";
    MOUSE_STATE["VERTICAL_RESIZE"] = "vertical-resize";
    MOUSE_STATE["GRAB"] = "grab";
    MOUSE_STATE["DEFAULT"] = "default";
})(MOUSE_STATE = exports.MOUSE_STATE || (exports.MOUSE_STATE = {}));
var MOUSE_EVENT_TYPE;
(function (MOUSE_EVENT_TYPE) {
    MOUSE_EVENT_TYPE["MOVE"] = "move";
    MOUSE_EVENT_TYPE["DOWN"] = "down";
    MOUSE_EVENT_TYPE["UP"] = "up";
    MOUSE_EVENT_TYPE["WHEEL"] = "wheel";
    MOUSE_EVENT_TYPE["OUT"] = "out";
})(MOUSE_EVENT_TYPE = exports.MOUSE_EVENT_TYPE || (exports.MOUSE_EVENT_TYPE = {}));
var PAN_ZOOM_EVENT_TYPE;
(function (PAN_ZOOM_EVENT_TYPE) {
    PAN_ZOOM_EVENT_TYPE["ZOOM"] = "zoom";
    PAN_ZOOM_EVENT_TYPE["PAN"] = "pan";
    PAN_ZOOM_EVENT_TYPE["RESET"] = "reset";
})(PAN_ZOOM_EVENT_TYPE = exports.PAN_ZOOM_EVENT_TYPE || (exports.PAN_ZOOM_EVENT_TYPE = {}));
var UI_EVENT_TYPE;
(function (UI_EVENT_TYPE) {
    UI_EVENT_TYPE["DOWN"] = "down";
    UI_EVENT_TYPE["UP"] = "up";
    UI_EVENT_TYPE["HOVER"] = "hover";
    UI_EVENT_TYPE["MOVE"] = "move";
    UI_EVENT_TYPE["OUT"] = "out";
    UI_EVENT_TYPE["CLICK"] = "click";
})(UI_EVENT_TYPE = exports.UI_EVENT_TYPE || (exports.UI_EVENT_TYPE = {}));
//# sourceMappingURL=canvas-event-types.js.map