export class ImageDataUtility{
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    createImageDataBySize(w: number, h: number): ImageData{
        return this.context.createImageData(w, h);
    }

    createImageDataImageData(id: ImageData): ImageData{
        return this.context.createImageData(id);
    }
}
