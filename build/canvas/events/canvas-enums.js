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
var ALIGNMENT;
(function (ALIGNMENT) {
    ALIGNMENT["START"] = "start";
    ALIGNMENT["END"] = "end";
    ALIGNMENT["LEFT"] = "left";
    ALIGNMENT["RIGHT"] = "right";
    ALIGNMENT["CENTER"] = "center";
})(ALIGNMENT = exports.ALIGNMENT || (exports.ALIGNMENT = {}));
var BASELINE;
(function (BASELINE) {
    BASELINE["TOP"] = "top";
    BASELINE["HANGING"] = "hanging";
    BASELINE["MIDDLE"] = "middle";
    BASELINE["ALPHABETIC"] = "alphabetic";
    BASELINE["IDEOGRAPHIC"] = "ideographic";
    BASELINE["BOTTOM"] = "bottom";
})(BASELINE = exports.BASELINE || (exports.BASELINE = {}));
(function (DIRECTION) {
    DIRECTION["LTR"] = "ltr";
    DIRECTION["RTL"] = "rtl";
    DIRECTION["INHERIT"] = "inherit";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
var FONT_STYLE;
(function (FONT_STYLE) {
    FONT_STYLE["NORMAL"] = "normal";
    FONT_STYLE["ITALIC"] = "italic";
    FONT_STYLE["OBLIQUE"] = "oblique";
})(FONT_STYLE = exports.FONT_STYLE || (exports.FONT_STYLE = {}));
var FONT_VARIANT;
(function (FONT_VARIANT) {
    FONT_VARIANT["NORMAL"] = "normal";
    FONT_VARIANT["SMALL_CAPS"] = "small-caps";
    FONT_VARIANT["INITIAL"] = "initial";
    FONT_VARIANT["INHERIT"] = "inherit";
})(FONT_VARIANT = exports.FONT_VARIANT || (exports.FONT_VARIANT = {}));
var FONT_WEIGHT;
(function (FONT_WEIGHT) {
    FONT_WEIGHT["NORMAL"] = "normal";
    FONT_WEIGHT["BOLD"] = "bold";
    FONT_WEIGHT["BOLDER"] = "bolder";
    FONT_WEIGHT["LIGHTER"] = "lighter";
    FONT_WEIGHT["INITIAL"] = "initial";
    FONT_WEIGHT["INHERIT"] = "inherit";
    FONT_WEIGHT["*100"] = "100";
    FONT_WEIGHT["*200"] = "200";
    FONT_WEIGHT["*300"] = "300";
    FONT_WEIGHT["*400"] = "400";
    FONT_WEIGHT["*500"] = "500";
    FONT_WEIGHT["*600"] = "600";
    FONT_WEIGHT["*700"] = "700";
    FONT_WEIGHT["*800"] = "800";
    FONT_WEIGHT["*900"] = "900";
})(FONT_WEIGHT = exports.FONT_WEIGHT || (exports.FONT_WEIGHT = {}));
var FONT_SIZE;
(function (FONT_SIZE) {
    FONT_SIZE["MEDIUM"] = "medium";
    FONT_SIZE["XX_SMALL"] = "xx-small";
    FONT_SIZE["X_SMALL"] = "x-small";
    FONT_SIZE["SMALL"] = "small";
    FONT_SIZE["LARGE"] = "large";
    FONT_SIZE["X_LARGE"] = "x-large";
    FONT_SIZE["XX_LARGE"] = "xx-large";
    FONT_SIZE["SMALLER"] = "smaller";
    FONT_SIZE["LARGER"] = "larger";
    FONT_SIZE["LENGTH"] = "length";
    FONT_SIZE["PERCENT"] = "%";
    FONT_SIZE["INITIAL"] = "initial";
    FONT_SIZE["INHERIT"] = "inherit";
})(FONT_SIZE = exports.FONT_SIZE || (exports.FONT_SIZE = {}));
var LENGTH_UNIT;
(function (LENGTH_UNIT) {
    LENGTH_UNIT["EM"] = "em";
    LENGTH_UNIT["EX"] = "ex";
    LENGTH_UNIT["PERCENT"] = "%";
    LENGTH_UNIT["PX"] = "px";
    LENGTH_UNIT["CM"] = "cm";
    LENGTH_UNIT["MM"] = "mm";
    LENGTH_UNIT["IN"] = "in";
    LENGTH_UNIT["PT"] = "pt";
    LENGTH_UNIT["PC"] = "pc";
})(LENGTH_UNIT = exports.LENGTH_UNIT || (exports.LENGTH_UNIT = {}));
//# sourceMappingURL=canvas-enums.js.map