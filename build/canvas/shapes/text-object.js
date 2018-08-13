"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_base_1 = require("canvas/shapes/shape-base");
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
var DIRECTION;
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
class FontSize {
    constructor() {
        this.size = FONT_SIZE.LENGTH;
        this.length = 18;
        this.unit = LENGTH_UNIT.PX;
    }
    get asString() {
        return this.size === FONT_SIZE.LENGTH ? `${this.length || ''}${this.unit || ''}` : this.size;
    }
}
exports.FontSize = FontSize;
class TextProperties {
    constructor() {
        this.textAlign = ALIGNMENT.START;
        this.baseLine = BASELINE.MIDDLE;
        this.direction = DIRECTION.INHERIT;
    }
}
exports.TextProperties = TextProperties;
class FontProperties {
    constructor() {
        this.style = FONT_STYLE.NORMAL;
        this.variant = FONT_VARIANT.NORMAL;
        this.weight = FONT_WEIGHT.NORMAL;
        this.fontSize = new FontSize();
        this.fontFamily = ['sans-serif'];
    }
    get asString() {
        let ff = [];
        this.fontFamily.forEach(f => {
            ff.push(f.includes(' ') ? `"${f}"` : `${f}`);
        });
        return `${this.style} ${this.variant} ${this.weight} ${this.fontSize.asString} ${ff.join(', ')}`
            .replace(/\s+/g, ' ').trim();
    }
}
exports.FontProperties = FontProperties;
class TextOptions {
    constructor(text) {
        this.text = 'TEXT';
        this.fontProperties = new FontProperties();
        this.textProperties = new TextProperties();
        this.text = text ? text : 'TEXT';
    }
}
exports.TextOptions = TextOptions;
class TextObject extends shape_base_1.ShapeBase {
    constructor(context, position, options) {
        super(context, position, () => { this.drawText(); });
        this._textOptions = new TextOptions();
        this._textOptions = options ? options : new TextOptions();
    }
    set textOptions(v) { this._textOptions = v; }
    get textOptions() { return this._textOptions; }
    get textWidth() {
        this.context.save();
        this.context.font = this._textOptions.fontProperties.asString;
        let width = this.context.measureText(this._textOptions.text).width * 2.2;
        this.context.restore();
        return width;
    }
    drawText() {
        this.context.save();
        this.context.globalAlpha = 0;
        this.context.font = this._textOptions.fontProperties.asString;
        this.context.textAlign = this._textOptions.textProperties.textAlign;
        this.context.textBaseline = this._textOptions.textProperties.baseLine;
        if (this.shadow !== undefined) {
            this.context.shadowBlur = this.shadow.blur;
            this.context.shadowColor = this.shadow.shade;
            this.context.shadowOffsetX = this.shadow.offsetX;
            this.context.shadowOffsetY = this.shadow.offsetY;
        }
        if (this.color !== undefined) {
            this.context.globalAlpha = this.color.alpha;
            this.context.fillStyle = this.color.shade;
            this.context.fillText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }
        if (this.outline !== undefined) {
            this.context.lineWidth = this.outline.width;
            this.context.globalAlpha = this.outline.alpha;
            this.context.strokeStyle = this.outline.shade;
            this.context.strokeText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }
        this.context.restore();
    }
}
exports.TextObject = TextObject;
//# sourceMappingURL=text-object.js.map