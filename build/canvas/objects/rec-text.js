"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_1 = require("canvas/shapes/rectangle");
const text_object_1 = require("canvas/shapes/text-object");
const vector_1 = require("canvas/objects/vector");
const line_style_1 = require("canvas/models/line-style");
const shadow_1 = require("canvas/models/shadow");
const size_1 = require("canvas/models/size");
const color_1 = require("canvas/models/color");
class RecTextElement {
}
exports.RecTextElement = RecTextElement;
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
class RecText {
    constructor(context) {
        this.context = context;
    }
    create(pos, size, text, recTextOptions) {
        if (!recTextOptions) {
            recTextOptions = new RecTextOptions();
        }
        if (typeof text === 'string') {
            text = new text_object_1.TextOptions(text);
        }
        let element = new RecTextElement();
        let t = this.createText(pos, text, recTextOptions);
        let rec = this.createRectangle(pos, size, recTextOptions);
        t.textOptions.maxWidth = t.textOptions.maxWidth ? rec.size.width - recTextOptions.paddingLeft - recTextOptions.paddingRight : undefined;
        t.position = new vector_1.Vector2D(rec.topLeft.x + recTextOptions.paddingLeft, rec.center.y);
        element.name = t.textOptions.text;
        element.RectangleObject = rec;
        element.textObject = t;
        return element;
    }
    createText(pos, options, recTextOptions) {
        let t = new text_object_1.TextObject(this.context, pos, options);
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
        let rec = new rectangle_1.Rectangle(this.context, pos);
        rec.size = new size_1.Size(size.width + options.paddingLeft + options.paddingRight, size.height);
        rec.outline = options ? options.recStyle.outline : new line_style_1.LineStyle();
        let g = this.context.createLinearGradient(rec.center.x, rec.topLeft.y, rec.center.x, rec.bottomRight.y);
        g.addColorStop(0, options.recStyle.startColor);
        g.addColorStop(1, options.recStyle.endColor);
        rec.color.shade = g;
        rec.color.alpha = options.recStyle.alpha;
        return rec;
    }
}
exports.RecText = RecText;
//# sourceMappingURL=rec-text.js.map