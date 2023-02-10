import { IDrawable } from '../../models/interfaces/idrawable';
import { Vertex } from '../../objects/vertex';
import { ShapeBase } from '../shape-base';
import { TextOptions } from './models';

export class TextObject extends ShapeBase implements IDrawable {
    public set textOptions(v: TextOptions) {
        this._textOptions = v;
        // this.isDirty = true;
    }
    public get textOptions(): TextOptions { return this._textOptions; }
    private _textOptions: TextOptions = new TextOptions();

    constructor(position: Vertex, options?: TextOptions) {
        super(position);
        this._textOptions = options ? options : new TextOptions();
    }

    public getTextWidth(context: CanvasRenderingContext2D): number {
        // I *think* I need to change font to get an accurate measurement
        // RESEARCH
        context.save();
        context.font = this._textOptions.fontProperties.asString;
        let width = context.measureText(this._textOptions.text).width;
        context.restore();

        return width;
    }

    async draw(context: CanvasRenderingContext2D) {
        context.save();

        context.globalAlpha = 0;
        context.font = this._textOptions.fontProperties.asString;
        context.textAlign = this._textOptions.textProperties.textAlign;
        context.textBaseline = this._textOptions.textProperties.baseLine;

        // Very new as of AUGUST 2018. not supported very well.
        // context.direction = this._textProperties.direction;

        // does it have a shadow
        if (this.shadow !== undefined) {
            context.shadowBlur = this.shadow.blur;
            context.shadowColor = this.shadow.shade;
            context.shadowOffsetX = this.shadow.offsetX;
            context.shadowOffsetY = this.shadow.offsetY;
        }

        // draw it as solid
        if (this.color !== undefined) {
            context.globalAlpha = this.color.alpha;
            context.fillStyle = this.color.shade;

            context.fillText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        // does it have an outline
        if (this.outline !== undefined) {
            context.lineWidth = this.outline.width;
            context.globalAlpha = this.outline.alpha;
            context.strokeStyle = this.outline.shade;

            // outline it
            context.strokeText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        context.restore();
    }
}
