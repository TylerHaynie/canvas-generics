import { Vector2D } from 'canvas/objects/vector';
import { ShapeBase } from 'canvas/shapes/shape-base';
import { TextOptions } from 'canvas/shapes/text/models';

export class TextObject extends ShapeBase {
    public set textOptions(v: TextOptions) {
        this._textOptions = v;
        this.isDirty = true;
    }
    public get textOptions(): TextOptions { return this._textOptions; }
    private _textOptions: TextOptions = new TextOptions();

    public get textWidth(): number {
        // I *think* I need to change font to get an accurate measurement
        // RESEARCH
        this._context.save();
        this._context.font = this._textOptions.fontProperties.asString;
        let width = this._context.measureText(this._textOptions.text).width;
        this._context.restore();

        return width;
    }

    constructor(context: CanvasRenderingContext2D, position: Vector2D, options?: TextOptions) {
        super(context, position, () => { this.drawText(); });
        this._textOptions = options ? options : new TextOptions();
    }

    private drawText() {
        this._context.save();

        this._context.globalAlpha = 0;
        this._context.font = this._textOptions.fontProperties.asString;
        this._context.textAlign = this._textOptions.textProperties.textAlign;
        this._context.textBaseline = this._textOptions.textProperties.baseLine;

        // Very new as of AUGUST 2018. not supported very well.
        // this._context.direction = this._textProperties.direction;

        // does it have a shadow
        if (this.shadow !== undefined) {
            this._context.shadowBlur = this.shadow.blur;
            this._context.shadowColor = this.shadow.shade;
            this._context.shadowOffsetX = this.shadow.offsetX;
            this._context.shadowOffsetY = this.shadow.offsetY;
        }

        // draw it as solid
        if (this.color !== undefined) {
            this._context.globalAlpha = this.color.alpha;
            this._context.fillStyle = this.color.shade;

            this._context.fillText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        // does it have an outline
        if (this.outline !== undefined) {
            this._context.lineWidth = this.outline.width;
            this._context.globalAlpha = this.outline.alpha;
            this._context.strokeStyle = this.outline.shade;

            // outline it
            this._context.strokeText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        this._context.restore();
    }
}
