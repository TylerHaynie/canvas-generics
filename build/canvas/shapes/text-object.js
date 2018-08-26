"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_base_1 = require("canvas/shapes/shape-base");
const enums_1 = require("canvas/enums");
class FontSize {
    constructor() {
        this.size = enums_1.FONT_SIZE.LENGTH;
        this.length = 18;
        this.unit = enums_1.LENGTH_UNIT.PX;
    }
    get asString() {
        return this.size === enums_1.FONT_SIZE.LENGTH ? `${this.length || ''}${this.unit || ''}` : this.size;
    }
}
exports.FontSize = FontSize;
class TextProperties {
    constructor() {
        this.textAlign = enums_1.ALIGNMENT.START;
        this.baseLine = enums_1.BASELINE.MIDDLE;
        this.direction = enums_1.DIRECTION.INHERIT;
    }
}
exports.TextProperties = TextProperties;
class FontProperties {
    constructor() {
        this.style = enums_1.FONT_STYLE.NORMAL;
        this.variant = enums_1.FONT_VARIANT.NORMAL;
        this.weight = enums_1.FONT_WEIGHT.NORMAL;
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