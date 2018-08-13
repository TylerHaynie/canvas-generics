export class KeyboardManager {

    public get isDirty() { return this.hasChanges; }
    public get hasKeyDown() { return this.isKeyDown; }
    public get key() { return this.keyPressed; }
    public get controlPressed() { return this.controlKeyPressed; }
    public get shiftPressed() { return this.shiftKeyPressed; }
    public get altPressed() { return this.altKeyPressed; }

    private context: CanvasRenderingContext2D;
    private hasChanges: boolean = false;

    private isKeyDown: boolean = true;
    private keyPressed: string = '';
    private controlKeyPressed: boolean = false;
    private shiftKeyPressed: boolean = false;
    private altKeyPressed: boolean = false;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.registerEvents();
    }

    update() {
        if (this.hasChanges) {
            this.hasChanges = false;
            this.reset();
        }
    }

    private registerEvents() {
        let cv = this.context.canvas;

        cv.onkeydown = (e: KeyboardEvent) => {
            this.isKeyDown = true;

            this.keyPressed = e.key;
            this.shiftKeyPressed = e.shiftKey;
            this.controlKeyPressed = e.ctrlKey;
            this.altKeyPressed = e.altKey;

            this.hasChanges = true;
        };

        cv.onkeyup = (e: KeyboardEvent) => {
            this.isKeyDown = false;
            this.hasChanges = true;
        };

    }

    private reset() {
        this.keyPressed = '';
        this.shiftKeyPressed = false;
        this.controlKeyPressed = false;
        this.altKeyPressed = false;

        this.isKeyDown = false;
    }
}
