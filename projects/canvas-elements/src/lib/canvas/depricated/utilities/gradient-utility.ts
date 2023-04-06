export abstract class GradientUtility {
    static createLinearGradient(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): CanvasGradient {
        return context.createLinearGradient(x1, y1, x2, y2);
    }

    static createRadialGradient(context: CanvasRenderingContext2D, x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): CanvasGradient {
        return context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }
}
