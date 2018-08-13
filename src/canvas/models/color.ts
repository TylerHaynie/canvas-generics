// this will eventually be a shader or part of one
export class Color {
    shade: string | CanvasGradient | CanvasPattern;
    alpha: number;

    constructor(shade?: string | CanvasGradient | CanvasPattern, alpha?: number) {
        this.shade = shade || '#888';
        this.alpha = alpha || 1;
    }
}
