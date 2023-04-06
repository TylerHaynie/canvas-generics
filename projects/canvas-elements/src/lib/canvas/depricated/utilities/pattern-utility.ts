export abstract class PatternUtility {
    public static createPattern(context: CanvasRenderingContext2D, image: any, repeat: string): CanvasPattern {
        return context.createPattern(image, repeat);
    }
}
