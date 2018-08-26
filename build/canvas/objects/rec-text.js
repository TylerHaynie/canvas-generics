"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_1 = require("canvas/shapes/rectangle");
const vector_1 = require("canvas/objects/vector");
const line_style_1 = require("canvas/models/line-style");
const shadow_1 = require("canvas/models/shadow");
const size_1 = require("canvas/models/size");
const color_1 = require("canvas/models/color");
const text_object_1 = require("canvas/shapes/text/text-object");
const models_1 = require("canvas/shapes/text/models");
const draw_base_1 = require("canvas/shapes/draw-base");
class RecTextOptions {
    constructor() {
        this.textColor = new color_1.Color('#eee');
        this.recStyle = { startColor: '#888', endColor: '#252525', alpha: 1, outline: new line_style_1.LineStyle('#000', 2) };
        this.paddingLeft = 8;
        this.paddingRight = 0;
        this.upperCaseFirstLetter = false;
        this.splitOnUpperCaseLetter = false;
    }
    changeStyle(startColor, endColor, alpha, outline) {
        this.recStyle.startColor = startColor;
        this.recStyle.endColor = endColor;
        if (outline) {
            this.recStyle.outline = outline;
        }
        if (alpha) {
            this.recStyle.alpha = alpha;
        }
    }
}
exports.RecTextOptions = RecTextOptions;
class RecText extends draw_base_1.DrawBase {
    get id() { return this._id; }
    set text(v) { this._text = v; this.isDirty = true; }
    set size(v) { this._size = v; this.isDirty = true; }
    set options(v) { this._options = v; this.isDirty = true; }
    get rectangle() { return this._rectangle; }
    get textObject() { return this._textObject; }
    constructor(context, pos, size, text, uid, options) {
        super(context, pos, () => this.draw());
        this._size = size;
        this._text = text;
        this._id = uid;
        this._options = options;
    }
    draw() {
        this.update();
        this._rectangle.draw();
        this._textObject.draw();
    }
    update() {
        if (!this._options) {
            this._options = new RecTextOptions();
        }
        if (typeof this._text === 'string') {
            this._text = new models_1.TextOptions(this._text);
        }
        let t = this.createText(this.position, this._text, this._options);
        let rec = this.createRectangle(this.position, this._size, this._options);
        t.textOptions.maxWidth = t.textOptions.maxWidth ? rec.size.width - this._options.paddingLeft - this._options.paddingRight : undefined;
        t.position = new vector_1.Vector2D(rec.topLeft.x + this._options.paddingLeft, rec.center.y);
        if (!this.id) {
            this._id = t.textOptions.text;
        }
        this._rectangle = rec;
        this._textObject = t;
    }
    createText(pos, options, recTextOptions) {
        let t = new text_object_1.TextObject(this._context, pos, options);
        t.color = recTextOptions.textColor;
        t.shadow = new shadow_1.Shadow();
        t.shadow.offsetX = 2;
        t.shadow.offsetY = 2;
        t.shadow.shade = '#000';
        if (recTextOptions.upperCaseFirstLetter) {
            t.textOptions.text = t.textOptions.text.charAt(0).toUpperCase() + t.textOptions.text.substr(1);
        }
        if (recTextOptions.splitOnUpperCaseLetter) {
            t.textOptions.text = t.textOptions.text.split(/(?=[A-Z])/).join(' ');
        }
        return t;
    }
    createRectangle(pos, size, options) {
        let rec = new rectangle_1.Rectangle(this._context, pos);
        rec.size = new size_1.Size(size.width + options.paddingLeft + options.paddingRight, size.height);
        rec.outline = options ? options.recStyle.outline : new line_style_1.LineStyle();
        let g = this._context.createLinearGradient(rec.center.x, rec.topLeft.y, rec.center.x, rec.bottomRight.y);
        g.addColorStop(0, options.recStyle.startColor);
        g.addColorStop(1, options.recStyle.endColor);
        rec.color.shade = g;
        rec.color.alpha = options.recStyle.alpha;
        return rec;
    }
}
exports.RecText = RecText;
//# sourceMappingURL=rec-text.js.map