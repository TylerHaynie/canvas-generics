"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("canvas/enums");
const enums_2 = require("canvas/enums");
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
class TextOptions {
    constructor(text) {
        this.text = 'TEXT';
        this.fontProperties = new FontProperties();
        this.textProperties = new TextProperties();
        this.text = text ? text : 'TEXT';
    }
}
exports.TextOptions = TextOptions;
class TextProperties {
    constructor() {
        this.textAlign = enums_2.ALIGNMENT.START;
        this.baseLine = enums_2.BASELINE.MIDDLE;
        this.direction = enums_2.DIRECTION.INHERIT;
    }
}
exports.TextProperties = TextProperties;
class FontProperties {
    constructor() {
        this.style = enums_2.FONT_STYLE.NORMAL;
        this.variant = enums_2.FONT_VARIANT.NORMAL;
        this.weight = enums_2.FONT_WEIGHT.NORMAL;
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
//# sourceMappingURL=models.js.map