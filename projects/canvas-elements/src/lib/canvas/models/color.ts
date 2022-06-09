// this will eventually be a shader or part of one
export class Color {
    private _shade : string | CanvasGradient | CanvasPattern;
    public get shade() : string | CanvasGradient | CanvasPattern {
        return this._shade;
    }
    public set shade(v : string | CanvasGradient | CanvasPattern) {
        this._shade = v;
    }

    alpha: number = 1;

    constructor(color: string | CanvasGradient | CanvasPattern = '#888') {
        this.shade = color;
    }
}
