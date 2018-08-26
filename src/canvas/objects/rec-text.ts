import { Rectangle } from 'canvas/shapes/rectangle';
import { Vector2D } from 'canvas/objects/vector';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { Size } from 'canvas/models/size';
import { Color } from 'canvas/models/color';
import { TextObject } from 'canvas/shapes/text-object';
import { TextOptions } from 'canvas/shapes/text/models';
import { ShapeBase } from 'canvas/shapes/shape-base';

export class RecTextOptions {
    textColor: Color = new Color('#eee');
    recStyle: { startColor: string, endColor: string, alpha: number, outline: LineStyle } =
        { startColor: '#888', endColor: '#252525', alpha: 1, outline: new LineStyle('#000', 2) };

    paddingLeft: number = 8;
    paddingRight: number = 0;
    upperCaseFirstLetter: boolean = false;
    splitOnUpperCaseLetter: boolean = false;

    constructor() { }

    changeStyle(startColor: string, endColor: string, alpha?: number, outline?: LineStyle) {
        this.recStyle.startColor = startColor;
        this.recStyle.endColor = endColor;
        if (outline) { this.recStyle.outline = outline; }
        if (alpha) { this.recStyle.alpha = alpha; }
    }
}

export class RecText extends ShapeBase {

    id: string;

    _text: TextOptions | string;
    public set text(v: TextOptions | string) { this._text = v; this.isDirty = true; }

    _size: Size;
    public set size(v: Size) { this._size = v; this.isDirty = true; }

    _options: RecTextOptions;
    public set options(v: RecTextOptions) { this._options = v; this.isDirty = true; }

    public set position(position: Vector2D) {
    }

    private isDirty: boolean = true;

    public get rectangle() { return this._rectangle; }
    private _rectangle: Rectangle;

    public get textObject() { return this._textObject; }
    private _textObject: TextObject;

    constructor(context: CanvasRenderingContext2D, pos: Vector2D, size: Size, text: TextOptions | string, id?: string, options?: RecTextOptions) {
        super(context, pos, () => this.draw());
        this._size = size;
        this._text = text;
        this.id = id;
        this._options = options;

        this.create();
    }

    draw() {
        if (this.isDirty) {
            this.create();
            this.isDirty = false;
        }



    }

    private create() {
        if (!this._options) { this._options = new RecTextOptions(); }
        if (typeof this._text === 'string') { this._text = new TextOptions(this._text); }

        let t = this.createText(this.position, this._text, this._options);
        let rec = this.createRectangle(this.position, this._size, this._options);

        // set text width including rectangle padding
        t.textOptions.maxWidth = t.textOptions.maxWidth ? rec.size.width - this._options.paddingLeft - this._options.paddingRight : undefined;

        // reposition text so it is in the correct position
        t.position = new Vector2D(rec.topLeft.x + this._options.paddingLeft, rec.center.y);

        if (!this.id) { this.id = t.textOptions.text; }
        this._rectangle = rec;
        this._textObject = t;
    }

    private createText(pos: Vector2D, options: TextOptions, recTextOptions: RecTextOptions) {
        let t = new TextObject(this.context, pos, options);
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
        let rec = new Rectangle(this.context, pos);

        rec.size = new Size(size.width + options.paddingLeft + options.paddingRight, size.height);
        rec.outline = options ? options.recStyle.outline : new LineStyle();

        // create the graident
        let g = this.context.createLinearGradient(rec.center.x, rec.topLeft.y, rec.center.x, rec.bottomRight.y);

        // background
        g.addColorStop(0, options.recStyle.startColor);
        g.addColorStop(1, options.recStyle.endColor);

        rec.color.shade = g;
        rec.color.alpha = options.recStyle.alpha;

        return rec;
    }
}
