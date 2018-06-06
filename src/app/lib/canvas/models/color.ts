// this will eventually be a shader or part of one
export class Color {
    shade: string | CanvasGradient | CanvasPattern;
    alpha: number = 1;

    constructor(color: string | CanvasGradient | CanvasPattern = '#888') {
        this.shade = color;
    }
}
