"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WindowManager {
    constructor(context) {
        this.context = context;
        this.registerEvents();
    }
    fit() {
        this.fitCanvasToContainer();
    }
    registerEvents() {
        const cv = this.context.canvas;
        window.onresize = () => {
            this.fitCanvasToContainer();
        };
    }
    fitCanvasToContainer() {
        this.context.canvas.style.width = '100%';
        this.context.canvas.style.height = '100%';
        this.context.canvas.width = this.context.canvas.offsetWidth;
        this.context.canvas.height = this.context.canvas.offsetHeight;
    }
}
exports.WindowManager = WindowManager;
//# sourceMappingURL=window-manager.js.map