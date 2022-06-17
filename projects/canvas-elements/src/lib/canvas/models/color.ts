// this will eventually be a shader or part of one
export class Color {
    private _shade: string | CanvasGradient | CanvasPattern;
    public get shade(): string | CanvasGradient | CanvasPattern {
        return this._shade;
    }

    private _alpha: number = 1;
    public get alpha(): number { return this._alpha; }

    constructor(shade: string | CanvasGradient | CanvasPattern = '#888') {
        this._shade = shade;
    }

    setShade(shade: string | CanvasGradient | CanvasPattern) {
        this._shade = shade;
    }

    setAlpha(alpha: number): void {
        this._alpha = alpha;
    }
}
