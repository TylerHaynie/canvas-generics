import { Vector2D } from 'canvas/objects/vector';
import { ShapeBase } from 'canvas/shapes/shape-base';
import { Color } from 'canvas/models/color';

export enum ALIGNMENT {
    'START' = 'start',
    'END' = 'end',
    'LEFT' = 'left',
    'RIGHT' = 'right',
    'CENTER' = 'center'
}

export enum BASELINE {
    'TOP' = 'top',
    'HANGING' = 'hanging',
    'MIDDLE' = 'middle',
    'ALPHABETIC' = 'alphabetic',
    'IDEOGRAPHIC' = 'ideographic',
    'BOTTOM' = 'bottom'
}

export enum DIRECTION {
    'LTR' = 'ltr',
    'RTL' = 'rtl',
    'INHERIT' = 'inherit'
}

export enum FONT_STYLE {
    'NORMAL' = 'normal',
    'ITALIC' = 'italic',
    'OBLIQUE' = 'oblique'
}

export enum FONT_VARIANT {
    'NORMAL' = 'normal',
    'SMALL_CAPS' = 'small-caps',
    'INITIAL' = 'initial',
    'INHERIT' = 'inherit'
}

export enum FONT_WEIGHT {
    'NORMAL' = 'normal',
    'BOLD' = 'bold',
    'BOLDER' = 'bolder',
    'LIGHTER' = 'lighter',
    'INITIAL' = 'initial',
    'INHERIT' = 'inherit',
    '*100' = '100',
    '*200' = '200',
    '*300' = '300',
    '*400' = '400',
    '*500' = '500',
    '*600' = '600',
    '*700' = '700',
    '*800' = '800',
    '*900' = '900',
}

export enum FONT_SIZE {
    'MEDIUM' = 'medium',
    'XX_SMALL' = 'xx-small',
    'X_SMALL' = 'x-small',
    'SMALL' = 'small',
    'LARGE' = 'large',
    'X_LARGE' = 'x-large',
    'XX_LARGE' = 'xx-large',
    'SMALLER' = 'smaller',
    'LARGER' = 'larger',
    'LENGTH' = 'length',
    'PERCENT' = '%',
    'INITIAL' = 'initial',
    'INHERIT' = 'inherit',
}

export enum LENGTH_UNIT {
    'EM' = 'em',
    'EX' = 'ex',
    'PERCENT' = '%',
    'PX' = 'px',
    'CM' = 'cm',
    'MM' = 'mm',
    'IN' = 'in',
    'PT' = 'pt',
    'PC' = 'pc',
}

export class FontSize {
    // default values
    size: FONT_SIZE = FONT_SIZE.LENGTH;
    length?: number = 18;
    unit?: LENGTH_UNIT = LENGTH_UNIT.PX;

    public get asString(): string {
        return this.size === FONT_SIZE.LENGTH ? `${this.length || ''}${this.unit || ''}` : this.size;
    }

    constructor() { }
}

export class TextProperties {
    // default values
    textAlign: ALIGNMENT = ALIGNMENT.START;
    baseLine: BASELINE = BASELINE.MIDDLE;
    direction: DIRECTION = DIRECTION.INHERIT;

    constructor() { }
}

export class FontProperties {
    // default values
    style: FONT_STYLE = FONT_STYLE.NORMAL;
    variant: FONT_VARIANT = FONT_VARIANT.NORMAL;
    weight: FONT_WEIGHT = FONT_WEIGHT.NORMAL;
    fontSize: FontSize = new FontSize();
    fontFamily: string[] = ['sans-serif'];

    public get asString(): string {
        let ff: string[] = [];
        this.fontFamily.forEach(f => {
            // wrapping families with spaces in double quotes ex: 'sans-serif, "times new roman"'
            ff.push(f.includes(' ') ? `"${f}"` : `${f}`);
        });
        return `${this.style} ${this.variant} ${this.weight} ${this.fontSize.asString} ${ff.join(', ')}`
            .replace(/\s+/g, ' ').trim(); // removing any extra saces
    }

    constructor() { }
}

export class TextOptions {
    text: string = 'TEXT';
    fontProperties: FontProperties = new FontProperties();
    textProperties: TextProperties = new TextProperties();
    maxWidth?: number;

    constructor(text?: string) {
        this.text = text ? text : 'TEXT';
    }
}

export class TextObject extends ShapeBase {
    public set textOptions(v: TextOptions) { this._textOptions = v; }
    public get textOptions(): TextOptions { return this._textOptions; }
    private _textOptions: TextOptions = new TextOptions();

    public get textWidth(): number {
        // I *think* I need to change font to get an accurate measurement
        // RESEARCH
        this.context.save();
        this.context.font = this._textOptions.fontProperties.asString;
        let width = this.context.measureText(this._textOptions.text).width * 2.2;
        this.context.restore();

        return width;
    }

    constructor(context: CanvasRenderingContext2D, position: Vector2D, options?: TextOptions) {
        super(context, position, () => { this.drawText(); });
        this._textOptions = options ? options : new TextOptions();
    }

    private drawText() {
        this.context.save();

        this.context.globalAlpha = 0;
        this.context.font = this._textOptions.fontProperties.asString;
        this.context.textAlign = this._textOptions.textProperties.textAlign;
        this.context.textBaseline = this._textOptions.textProperties.baseLine;

        // Very new as of AUGUST 2018. not supported very well.
        // this.context.direction = this._textProperties.direction;

        // does it have a shadow
        if (this.shadow !== undefined) {
            this.context.shadowBlur = this.shadow.blur;
            this.context.shadowColor = this.shadow.shade;
            this.context.shadowOffsetX = this.shadow.offsetX;
            this.context.shadowOffsetY = this.shadow.offsetY;
        }

        // draw it as solid
        if (this.color !== undefined) {
            this.context.globalAlpha = this.color.alpha;
            this.context.fillStyle = this.color.shade;

            this.context.fillText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        // does it have an outline
        if (this.outline !== undefined) {
            this.context.lineWidth = this.outline.width;
            this.context.globalAlpha = this.outline.alpha;
            this.context.strokeStyle = this.outline.shade;

            // outline it
            this.context.strokeText(this._textOptions.text, this.position.x, this.position.y, this._textOptions.maxWidth);
        }

        this.context.restore();
    }
}
