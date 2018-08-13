"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyboardManager {
    constructor(context) {
        this.hasChanges = false;
        this.isKeyDown = true;
        this.keyPressed = '';
        this.controlKeyPressed = false;
        this.shiftKeyPressed = false;
        this.altKeyPressed = false;
        this.context = context;
        this.registerEvents();
    }
    get isDirty() { return this.hasChanges; }
    get hasKeyDown() { return this.isKeyDown; }
    get key() { return this.keyPressed; }
    get controlPressed() { return this.controlKeyPressed; }
    get shiftPressed() { return this.shiftKeyPressed; }
    get altPressed() { return this.altKeyPressed; }
    update() {
        if (this.hasChanges) {
            this.hasChanges = false;
            this.reset();
        }
    }
    registerEvents() {
        let cv = this.context.canvas;
        cv.onkeydown = (e) => {
            this.isKeyDown = true;
            this.keyPressed = e.key;
            this.shiftKeyPressed = e.shiftKey;
            this.controlKeyPressed = e.ctrlKey;
            this.altKeyPressed = e.altKey;
            this.hasChanges = true;
        };
        cv.onkeyup = (e) => {
            this.isKeyDown = false;
            this.hasChanges = true;
        };
    }
    reset() {
        this.keyPressed = '';
        this.shiftKeyPressed = false;
        this.controlKeyPressed = false;
        this.altKeyPressed = false;
        this.isKeyDown = false;
    }
}
exports.KeyboardManager = KeyboardManager;
//# sourceMappingURL=keyboard-manager.js.map