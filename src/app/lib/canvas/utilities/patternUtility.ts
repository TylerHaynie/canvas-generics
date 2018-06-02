export class PatternUtility {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    createPattern(image: any, repeat: string): CanvasPattern {
        return this.context.createPattern(image, repeat);
    }
}
