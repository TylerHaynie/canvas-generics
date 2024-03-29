export class WindowManager {
    private _canvas: HTMLCanvasElement;
    private _pixelRatio: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._pixelRatio = window.devicePixelRatio || 1;
        this.registerEvents();
    }

    public fit() {
        this.fitCanvasToContainer();
    }

    public setCursorStyle(style: string) {
        this._canvas.style.cursor = style;
    }

    private registerEvents() {
        window.onresize = () => {
            this.fitCanvasToContainer();
        };
    }

    private fitCanvasToContainer() {
        // visually fill the parent
        this._canvas.style.width = '100%';
        this._canvas.style.height = '100%';

        // set the internal size to match
        this._canvas.width = this._canvas.offsetWidth * this._pixelRatio;
        this._canvas.height = this._canvas.offsetHeight * this._pixelRatio;
    }
}
