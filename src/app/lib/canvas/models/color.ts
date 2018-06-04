export class Color {
    shade: string | CanvasGradient | CanvasPattern;
    alpha: number = 1;

    constructor(color: string | CanvasGradient | CanvasPattern = '#888') {
        this.shade = color;
    }
}
