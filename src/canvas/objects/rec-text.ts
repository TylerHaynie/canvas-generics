import { Rectangle } from 'canvas/shapes/rectangle';
import { TextObject, TextOptions } from 'canvas/shapes/text-object';
import { Vector2D } from 'canvas/objects/vector';
import { DrawBase } from 'canvas/shapes/drawBase';
import { LineStyle } from 'canvas/models/line-style';
import { Shadow } from 'canvas/models/shadow';
import { Size } from 'canvas/models/size';
import { Color } from 'canvas/models/color';


export class RecTextElement {
    name: string;
    textObject: DrawBase;
    RectangleObject: DrawBase;
}

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

export class RecText {

    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    create(pos: Vector2D, size: Size, text: TextOptions | string, recTextOptions?: RecTextOptions): RecTextElement {
        if (!recTextOptions) { recTextOptions = new RecTextOptions(); }
        if (typeof text === 'string') { text = new TextOptions(text); }

        let element: RecTextElement = new RecTextElement();

        let t = this.createText(pos, text, recTextOptions);
        let rec = this.createRectangle(pos, size, recTextOptions);

        // set text width including rectangle padding
        t.textOptions.maxWidth = t.textOptions.maxWidth ? rec.size.width - recTextOptions.paddingLeft - recTextOptions.paddingRight : undefined;

        // reposition text so it is in the correct position
        t.position = new Vector2D(rec.topLeft.x + recTextOptions.paddingLeft, rec.center.y);

        element.name = t.textOptions.text;
        element.RectangleObject = rec;
        element.textObject = t;

        return element;
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
