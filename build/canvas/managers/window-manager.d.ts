export declare class WindowManager {
    private context;
    constructor(context: CanvasRenderingContext2D);
    fit(): void;
    private registerEvents();
    private fitCanvasToContainer();
}
