export class WindowManager {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.registerEvents();
    }

    public fit(){
        this.fitCanvasToContainer();
    }

    public setCursorStyle(style: string){
        this.context.canvas.style.cursor = style;
    }

    private registerEvents() {
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
