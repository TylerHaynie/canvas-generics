export declare class KeyboardManager {
    readonly isDirty: boolean;
    readonly hasKeyDown: boolean;
    readonly key: string;
    readonly controlPressed: boolean;
    readonly shiftPressed: boolean;
    readonly altPressed: boolean;
    private context;
    private hasChanges;
    private isKeyDown;
    private keyPressed;
    private controlKeyPressed;
    private shiftKeyPressed;
    private altKeyPressed;
    constructor(context: CanvasRenderingContext2D);
    update(): void;
    private registerEvents;
    private reset;
}
//# sourceMappingURL=keyboard-manager.d.ts.map