import { Color } from '../models/color';
import { LineStyle } from '../models/line-style';
import { Shadow } from '../models/shadow';
import { Size } from '../models/size';
import { DrawBase } from '../shapes/draw-base';
import { Rectangle } from '../shapes/rectangle';
import { TextOptions } from '../shapes/text/models';
import { TextObject } from '../shapes/text/text-object';
import { Vector2D } from './vector';

export class RecTextOptions {
    textColor: Color = new Color('#eee');
    recStyle: {
        startColor: string,
        endColor: string,
        alpha: number,
        outline: LineStyle
    } =
        {
            startColor: '#888',
            endColor: '#252525',
            alpha: 1,
            outline: new LineStyle('#000', 2)
        };

    paddingLeft: number = 8;
    paddingRight: number = 8;
    upperCaseFirstLetter: boolean = false;
    splitOnUpperCaseLetter: boolean = false;
    autoWidth: boolean = true;

    constructor() { }

    changeStyle(startColor: string, endColor: string, alpha?: number, outline?: LineStyle) {
        this.recStyle.startColor = startColor;
        this.recStyle.endColor = endColor;
        if (outline) { this.recStyle.outline = outline; }
        if (alpha) { this.recStyle.alpha = alpha; }
    }
}

export class RecText extends DrawBase {
    private _text: TextOptions;
    public get text(): TextOptions { return this._text; }
    public set text(v: TextOptions) { this._text = v; this.isDirty = true; }

    private _size: Size;
    public get size(): Size { return this._size; }
    public set size(v: Size) { this._size = v; this.isDirty = true; }

    private _options: RecTextOptions;
    public get options(): RecTextOptions { return this._options; }
    public set options(v: RecTextOptions) { this._options = v; this.isDirty = true; }

    private _rectangle: Rectangle;
    public get rectangle() { return this._rectangle; }

    private _textObject: TextObject;
    public get textObject() { return this._textObject; }

    constructor(context: CanvasRenderingContext2D, pos: Vector2D, size: Size, text: TextOptions | string, options?: RecTextOptions) {
        super(context, pos, () => this.draw());
        this._size = size;
        this._text = typeof text === 'string' ? new TextOptions(<string>text) : text;
        this._options = options || new RecTextOptions();

        this.update();
    }

    draw() {
        // draw is called only when base properties are dirty
        // so we update the rectangle and text before drawing the object
        this.update();

        this._rectangle.draw();
        this._textObject.draw();
    }

    private update() {
        let t = this.createText(this.position, this._text, this._options);

        if (this._options.autoWidth) {
            this._size.setSize(t.textWidth, this._size.height);
        }
        let rec = this.createRectangle(this.position, this._size, this._options);

        // set text width including rectangle padding
        t.textOptions.maxWidth = t.textOptions.maxWidth ? rec.size.width - this._options.paddingLeft - this._options.paddingRight : undefined;

        // reposition text so it is in the correct position
        t.setPosition(rec.topLeft.x + this._options.paddingLeft, rec.center.y);

        this._rectangle = rec;
        this._textObject = t;
    }

    private createText(pos: Vector2D, options: TextOptions, recTextOptions: RecTextOptions) {
        let t = new TextObject(this._context, pos, options);
        t.color = recTextOptions.textColor;

        // adding a little shadow
        t.shadow = new Shadow();
        t.shadow.offsetX = 2;
        t.shadow.offsetY = 2;
        t.shadow.shade = '#000';

        // upper-case first letter
        if (recTextOptions.upperCaseFirstLetter) {
            t.textOptions.text = t.textOptions.text.charAt(0).toUpperCase() + t.textOptions.text.substr(1);
        }

        // split on uppercase letter
        if (recTextOptions.splitOnUpperCaseLetter) {
            t.textOptions.text = t.textOptions.text.split(/(?=[A-Z])/).join(' ');
        }

        return t;
    }

    private createRectangle(pos: Vector2D, size: Size, options: RecTextOptions) {

        // create the rectangle (this could auto size to text width if we want)
        let rec = new Rectangle(this._context, pos);

        rec.size.setSize(size.width + options.paddingLeft + options.paddingRight, size.height);
        rec.outline = options ? options.recStyle.outline : new LineStyle();

        // create the graident
        let g = this._context.createLinearGradient(rec.center.x, rec.topLeft.y, rec.center.x, rec.bottomRight.y);

        // background
        g.addColorStop(0, options.recStyle.startColor);
        g.addColorStop(1, options.recStyle.endColor);

        rec.color.setShade(g);
        rec.color.setAlpha(options.recStyle.alpha);

        return rec;
    }
}
