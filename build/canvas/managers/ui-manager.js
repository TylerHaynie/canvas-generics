"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_event_types_1 = require("canvas/events/canvas-event-types");
class UIManager {
    constructor(context, mouseManager) {
        this.uiElements = [];
        this._uiEnabled = true;
        this._debugEnabled = false;
        this.context = context;
        this.mouseManager = mouseManager;
        this.registerEvents();
    }
    get uiEnabled() { return this._uiEnabled; }
    set uiEnabled(v) { this._uiEnabled = v; }
    get debugEnabled() { return this._debugEnabled; }
    set debugEnabled(v) { this._debugEnabled = v; }
    get uiBuffer() { return this._uiBuffer; }
    get mainBuffer() { return this._mainBuffer; }
    get debugBuffer() { return this._debugBuffer; }
    registerEvents() {
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.MOVE, (e) => {
            if (this._uiEnabled) {
                this.pointerMoved(e);
            }
        });
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.DOWN, (e) => {
            if (this._uiEnabled) {
                this.checkPointerDown(e);
            }
        });
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.UP, (e) => {
            if (this._uiEnabled) {
                this.checkPointerUp(e);
            }
        });
        this.mouseManager.on(canvas_event_types_1.MOUSE_EVENT_TYPE.OUT, (e) => {
            this.uiElements.forEach(element => {
                element.elementMouseOut(e);
            });
        });
    }
    addUIElement(element) {
        this.uiElements.push(element);
        this.addToUiBuffer(() => element.draw());
    }
    addUIElements(elements) {
        if (elements) {
            elements.forEach(element => {
                this.addUIElement(element);
            });
        }
    }
    removeUIElement(element) {
        let bi = this.uiElements.indexOf(element);
        this.uiElements.splice(bi, 1);
    }
    removeUIElements(elements) {
        if (elements) {
            elements.forEach(element => {
                let bi = this.uiElements.indexOf(element);
                if (bi) {
                    this.uiElements.splice(bi, 1);
                }
            });
        }
    }
    addToMainBuffer(drawCallback) {
        if (!this._mainBuffer) {
            this._mainBuffer = [{ callback: drawCallback }];
        }
        else {
            this._mainBuffer.push({ callback: drawCallback });
        }
    }
    drawMainBuffer() {
        if (this._mainBuffer) {
            this._mainBuffer.forEach(buffer => {
                buffer.callback();
            });
        }
    }
    clearMainBuffer() {
        this._mainBuffer = [];
    }
    addToUiBuffer(drawCallback) {
        if (!this._uiBuffer) {
            this._uiBuffer = [{ callback: drawCallback }];
        }
        else {
            this._uiBuffer.push({ callback: drawCallback });
        }
    }
    drawUiBuffer() {
        if (this._uiBuffer) {
            this._uiBuffer.forEach(buffer => {
                buffer.callback();
            });
        }
    }
    clearUiBuffer() {
        this._uiBuffer = [];
    }
    addToDeubgBuffer(drawCallback) {
        if (!this._debugBuffer) {
            this._debugBuffer = [{ callback: drawCallback }];
        }
        else {
            this._debugBuffer.push({ callback: drawCallback });
        }
    }
    drawDebugBuffer() {
        if (this._debugBuffer) {
            this._debugBuffer.forEach(buffer => {
                buffer.callback();
            });
        }
    }
    clearDebugBuffer() {
        this._debugBuffer = [];
    }
    pointerMoved(e) {
        this.uiElements.forEach(element => {
            element.childElements.forEach(element => {
                element.elementMouseMove(e);
            });
            element.elementMouseMove(e);
            if (element.baseElement.pointWithinBounds(e.mousePosition)) {
                element.elementMouseHover(e);
            }
            else {
                element.elementMouseOut(e);
            }
        });
    }
    checkPointerDown(e) {
        this.uiElements.forEach(element => {
            if (element.baseElement.pointWithinBounds(e.mousePosition)) {
                element.elementMouseDown(e);
                element.childElements.forEach(element => {
                    element.elementMouseDown(e);
                });
            }
        });
    }
    checkPointerUp(e) {
        this.uiElements.forEach(element => {
            if (element.baseElement.pointWithinBounds(e.mousePosition)) {
                element.elementMouseUp(e);
                element.childElements.forEach(element => {
                    element.elementMouseUp(e);
                });
            }
        });
    }
}
exports.UIManager = UIManager;
//# sourceMappingURL=ui-manager.js.map