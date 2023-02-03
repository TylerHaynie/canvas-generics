export class WindowManager {
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.registerEvents();
    }

    public fit(){
        this.fitCanvasToContainer();
    }

    public setCursorStyle(style: string){
        this.canvas.style.cursor = style;
    }

    private registerEvents() {
        window.onresize = () => {
            this.fitCanvasToContainer();
        };
    }

    private fitCanvasToContainer() {
        // Make it visually fill the positioned parent
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';

        // ...then set the internal size to match
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
}
