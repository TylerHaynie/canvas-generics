import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { QuadTree, QuadVector } from '../../quadtree/quad-tree';
import { MouseManager } from '@canvas/managers/mouse-manager';
import { MouseEventType, UIEventType } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { LineStyle } from '@canvas/models/line-style';
import { Vector } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';
import { Circle } from '@canvas/shapes/circle';
import { CircularUIElement } from '@canvas/user-interface/elements/circular-element';
import { InteractiveElement } from '@canvas/user-interface/elements/interactive-element';
import { RectangularUIElement } from '@canvas/user-interface/elements/rectangular-element';

export class UIManager {
    public get uiEnabled(): boolean { return this._uiEnabled; }
    public set enableUI(v: boolean) { this._uiEnabled = v; }
    public get debugEnabled(): boolean { return this._debugEnabled; }
    public set enableDebug(v: boolean) { this._debugEnabled = v; }

    //#region Private Properites

    private context: CanvasRenderingContext2D;
    private mouseManager: MouseManager;

    // elements
    private uiElements: InteractiveElement[] = [];

    private _uiEnabled: boolean = true;
    private _uiBuffer: [{ callback: () => void }];
    public get uiBuffer() { return this._uiBuffer; }

    private _mainBuffer: [{ callback: () => void }];
    public get mainBuffer() { return this._mainBuffer; }

    private _debugEnabled: boolean = false;
    private _debugBuffer: [{ callback: () => void }];
    public get debugBuffer() { return this._uiBuffer; }

    //#endregion

    constructor(context: CanvasRenderingContext2D, mouseManager: MouseManager) {
        this.context = context;
        this.mouseManager = mouseManager;

        this.registerEvents();
    }

    private registerEvents() {
        this.mouseManager.on(MouseEventType.MOVE, (e: MouseData) => {
            if (this._uiEnabled) {
                this.checkPointerOver(e);
            }
        });

        this.mouseManager.on(MouseEventType.DOWN, (e: MouseData) => {
            if (this._uiEnabled) {
                this.checkPointerDown(e);
            }
        });

        this.mouseManager.on(MouseEventType.UP, (e: MouseData) => {
            if (this._uiEnabled) {
                this.checkPointerUp(e);
            }
        });
    }

    //#region Public UI Element Functions

    addUIElement(element: InteractiveElement) {
        this.uiElements.push(element);
        this.addToUiBuffer(() => element.draw());
    }

    addUIElements(elements: InteractiveElement[]) {
        if (elements) {
            elements.forEach(element => {
                this.addUIElement(element);
            });
        }
    }

    removeUIElement(element: InteractiveElement) {
        let bi = this.uiElements.indexOf(element);
        this.uiElements.splice(bi, 1);
    }

    removeUIElements(elements: InteractiveElement[]) {
        if (elements) {
            elements.forEach(element => {
                let bi = this.uiElements.indexOf(element);
                if (bi) {
                    this.uiElements.splice(bi, 1);
                }
            });
        }
    }

    clearUIElements() {
        this.uiElements = [];
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
        this._mainBuffer = undefined;
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
        this._uiBuffer = undefined;
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
        this._debugBuffer = undefined;
    }

    //#endregion

    //#region User Interaction

    private checkPointerOver(e: MouseData) {
        let mp = e.mousePosition;

        this.uiElements.forEach(element => {
            if (element.baseElement.pointWithinBounds(mp)) {
                element.buttonHover();
            }
            else {
                element.buttonleave();
            }
        });
    }

    private checkPointerDown(e: MouseData) {
        let mp = e.mousePosition;

        this.uiElements.forEach(element => {
            if (element.baseElement.pointWithinBounds(mp)) {
                element.buttonDown();
            }
        });
    }

    private checkPointerUp(e: MouseData) {
        let mp = e.mousePosition;

        this.uiElements.forEach(element => {
            if (element.baseElement.pointWithinBounds(mp)) {
                element.buttonUp();
            }
        });
    }

    //#endregion

}
