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
var EIGHTS;
(function (EIGHTS) {
    EIGHTS[EIGHTS["ONE"] = 0.125] = "ONE";
    EIGHTS[EIGHTS["TWO"] = 0.25] = "TWO";
    EIGHTS[EIGHTS["THREE"] = 0.375] = "THREE";
    EIGHTS[EIGHTS["FOUR"] = 0.5] = "FOUR";
    EIGHTS[EIGHTS["FIVE"] = 0.625] = "FIVE";
    EIGHTS[EIGHTS["SIX"] = 0.75] = "SIX";
    EIGHTS[EIGHTS["SEVEN"] = 0.875] = "SEVEN";
    EIGHTS[EIGHTS["EIGHT"] = 1] = "EIGHT";
})(EIGHTS = exports.EIGHTS || (exports.EIGHTS = {}));
var QUARTERS;
(function (QUARTERS) {
    QUARTERS[QUARTERS["ONE"] = 0.25] = "ONE";
    QUARTERS[QUARTERS["TWO"] = 0.5] = "TWO";
    QUARTERS[QUARTERS["THREE"] = 0.75] = "THREE";
    QUARTERS[QUARTERS["FOUR"] = 1] = "FOUR";
})(QUARTERS = exports.QUARTERS || (exports.QUARTERS = {}));
var DIRECTION;
(function (DIRECTION) {
    DIRECTION["NORTH"] = "north";
    DIRECTION["SOUTH"] = "south";
    DIRECTION["EAST"] = "east";
    DIRECTION["WEST"] = "west";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
//# sourceMappingURL=canvas-enums.js.map