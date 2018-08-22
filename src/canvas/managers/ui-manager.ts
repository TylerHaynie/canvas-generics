import { MouseManager } from 'canvas/managers/mouse-manager';
import { MOUSE_EVENT_TYPE } from 'canvas/events/canvas-enums';
import { MouseData } from 'canvas/events/event-data';
import { ElementBase } from 'canvas/elements/element-base';

export class UIManager {
    public get uiEnabled(): boolean { return this._uiEnabled; }
    public set uiEnabled(v: boolean) { this._uiEnabled = v; }
    public get debugEnabled(): boolean { return this._debugEnabled; }
    public set debugEnabled(v: boolean) { this._debugEnabled = v; }

    //#region Private Properites

    private context: CanvasRenderingContext2D;
    private mouseManager: MouseManager;

    // elements
    private uiElements: ElementBase[] = [];

    private _uiEnabled: boolean = true;
    private _uiBuffer: [{ callback: () => void }];
    public get uiBuffer() { return this._uiBuffer; }

    private _mainBuffer: [{ callback: () => void }];
    public get mainBuffer() { return this._mainBuffer; }

    private _debugEnabled: boolean = false;
    private _debugBuffer: [{ callback: () => void }];
    public get debugBuffer() { return this._debugBuffer; }

    //#endregion

    //#region Init


    // TODO: need to fire off UI events and refactor a bit after that.

    constructor(context: CanvasRenderingContext2D, mouseManager: MouseManager) {
        this.context = context;
        this.mouseManager = mouseManager;

        this.registerEvents();
    }

    private registerEvents() {
        this.mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e: MouseData) => {
            if (this._uiEnabled) {
                this.pointerMoved(e);
            }
        });

        this.mouseManager.on(MOUSE_EVENT_TYPE.DOWN, (e: MouseData) => {
            if (this._uiEnabled) {
                this.checkPointerDown(e);
            }
        });

        this.mouseManager.on(MOUSE_EVENT_TYPE.UP, (e: MouseData) => {
            if (this._uiEnabled) {
                this.checkPointerUp(e);
            }
        });

        this.mouseManager.on(MOUSE_EVENT_TYPE.OUT, (e: MouseData) => {
            this.uiElements.forEach(element => {
                element.elementMouseOut(e);
            });
        });
    }

    //#endregion

    //#region Public UI Element Functions

    addUIElement(element: ElementBase) {
        this.uiElements.push(element);
        this.addToUiBuffer(() => element.draw());
    }

    addUIElements(elements: ElementBase[]) {
        if (elements) {
            elements.forEach(element => {
                this.addUIElement(element);
            });
        }
    }

    removeUIElement(element: ElementBase) {
        let bi = this.uiElements.indexOf(element);
        this.uiElements.splice(bi, 1);
    }

    removeUIElements(elements: ElementBase[]) {
        if (elements) {
            elements.forEach(element => {
                let bi = this.uiElements.indexOf(element);
                if (bi) {
                    this.uiElements.splice(bi, 1);
                }
            });
        }
    }

    //#endregion

    //#region Public Buffer Functions

    addToMainBuffer(drawCallback: () => void) {
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
        this._mainBuffer = <any>[];
    }

    addToUiBuffer(drawCallback: () => void) {
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
        this._uiBuffer = <any>[];
    }

    addToDeubgBuffer(drawCallback: () => void) {
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
        this._debugBuffer = <any>[];
    }

    //#endregion

    //#region User Interaction

    private pointerMoved(e: MouseData) {
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

    private checkPointerDown(e: MouseData) {
        this.uiElements.forEach(element => {
            if (element.baseElement.pointWithinBounds(e.mousePosition)) {
                element.elementMouseDown(e);

                element.childElements.forEach(element => {
                    element.elementMouseDown(e);
                });
            }
        });
    }

    private checkPointerUp(e: MouseData) {
        this.uiElements.forEach(element => {
            if (element.baseElement.pointWithinBounds(e.mousePosition)) {
                element.elementMouseUp(e);

                element.childElements.forEach(element => {
                    element.elementMouseUp(e);
                });
            }
        });
    }

    //#endregion

}
