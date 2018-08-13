export declare class GradientUtility {
    private context;
    constructor(context: CanvasRenderingContext2D);
    createLinearGradient(x1: number, y1: number, x2: number, y2: number): CanvasGradient;
    createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): CanvasGradient;
}
