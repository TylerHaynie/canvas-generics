import { FONT_SIZE, LENGTH_UNIT, ALIGNMENT, BASELINE, DIRECTION, FONT_STYLE, FONT_VARIANT, FONT_WEIGHT } from '../../events/canvas-enums';

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

export class TextOptions {
    text: string = 'TEXT';
    fontProperties: FontProperties = new FontProperties();
    textProperties: TextProperties = new TextProperties();
    maxWidth?: number;

    constructor(text?: string) {
        this.text = text ? text : 'TEXT';
    }
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
