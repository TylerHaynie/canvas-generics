"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_base_1 = require("canvas/shapes/shape-base");
const models_1 = require("canvas/shapes/text/models");
class TextObject extends shape_base_1.ShapeBase {
    constructor(context, position, options) {
        super(context, position, () => { this.drawText(); });
        this._textOptions = new models_1.TextOptions();
        this._textOptions = options ? options : new models_1.TextOptions();
    }
    set textOptions(v) {
        this._textOptions = v;
        this.isDirty = true;
    }
    get textOptions() { return this._textOptions; }
    get textWidth() {
        this._context.save();
        this._context.font = this._textOptions.fontProperties.asString;
        let width = this._context.measureText(this._textOptions.text).width * 2.2;
        this._context.restore();
        return width;
    }
    drawText() {
        this._context.save();
        this._context.globalAlpha = 0;
        this._context.font = this._textOptions.fontProperties.asString;
        this._context.textAlign = this._textOptions.textProperties.textAlign;
        this._context.textBaseline = this._textOptions.textProperties.baseLine;
        if (this.shadow !== undefined) {
            this._context.shadowBlur = this.shadow.blur;
            this._context.shadowColor = this.shadow.shade;
            this._context.shadowOffsetX = this.shadow.offsetX;
            this._context.shadowOffsetY = this.shadow.offsetY;
        }
        if (this.color !== undefined) {
            this._context.globalAlpha = this.color.alpha;
            this._context.fillStyle = this.color.shade;
            this._context.fillText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }
        if (this.outline !== undefined) {
            this._context.lineWidth = this.outline.width;
            this._context.globalAlpha = this.outline.alpha;
            this._context.strokeStyle = this.outline.shade;
            this._context.strokeText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }
        this._context.restore();
    }
}
exports.TextObject = TextObject;
//# sourceMappingURL=text-object.js.map