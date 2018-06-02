export class WindowManager {
    private context: CanvasRenderingContext2D;
    private hasChanges: boolean = true;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.registerEvents();
    }

    resize() {
        this.fitCanvasToContainer();
    }

    private registerEvents() {
        const cv = this.context.canvas;

        window.onresize = () => {
            this.fitCanvasToContainer();
        };
    }

    private fitCanvasToContainer() {
        // Make it visually fill the positioned parent
        this.context.canvas.style.width = '100%';
        this.context.canvas.style.height = '100%';

        // ...then set the internal size to match
        this.context.canvas.width = this.context.canvas.offsetWidth;
        this.context.canvas.height = this.context.canvas.offsetHeight;
    }
}