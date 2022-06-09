import { Vector2D } from '../../objects/vector';
import { ShapeBase } from '../shape-base';
import { TextOptions } from './models';

export class TextObject extends ShapeBase {
    public set textOptions(v: TextOptions) {
        this._textOptions = v;
        // this.isDirty = true;
    }
    public get textOptions(): TextOptions { return this._textOptions; }
    private _textOptions: TextOptions = new TextOptions();

    public get textWidth(): number {
        // I *think* I need to change font to get an accurate measurement
        // RESEARCH
        super.context.save();
        super.context.font = this._textOptions.fontProperties.asString;
        let width = super.context.measureText(this._textOptions.text).width;
        super.context.restore();

        return width;
    }

    constructor(context: CanvasRenderingContext2D, position: Vector2D, options?: TextOptions) {
        super(context, position);
        this._textOptions = options ? options : new TextOptions();
    }

    public draw() {
        super.context.save();

        super.context.globalAlpha = 0;
        super.context.font = this._textOptions.fontProperties.asString;
        super.context.textAlign = this._textOptions.textProperties.textAlign;
        super.context.textBaseline = this._textOptions.textProperties.baseLine;

        // Very new as of AUGUST 2018. not supported very well.
        // super.context.direction = this._textProperties.direction;

        // does it have a shadow
        if (this.shadow !== undefined) {
            super.context.shadowBlur = this.shadow.blur;
            super.context.shadowColor = this.shadow.shade;
            super.context.shadowOffsetX = this.shadow.offsetX;
            super.context.shadowOffsetY = this.shadow.offsetY;
        }

        // draw it as solid
        if (this.color !== undefined) {
            super.context.globalAlpha = this.color.alpha;
            super.context.fillStyle = this.color.shade;

            super.context.fillText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        // does it have an outline
        if (this.outline !== undefined) {
            super.context.lineWidth = this.outline.width;
            super.context.globalAlpha = this.outline.alpha;
            super.context.strokeStyle = this.outline.shade;

            // outline it
            super.context.strokeText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        super.context.restore();
    }
}
