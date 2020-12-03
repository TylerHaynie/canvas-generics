export class GradientUtility {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    createLinearGradient(x1: number, y1: number, x2: number, y2: number): CanvasGradient {
        return this.context.createLinearGradient(x1, y1, x2, y2);
    }

    createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): CanvasGradient {
        return this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }
}
