import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { CollisionUtility } from '@canvas/utilities/collision-utility';
import { QuadTree, QuadVector } from '../../quadtree/quad-tree';
import { CanvasUIElement } from '@canvas/user-interface/canvas-ui-element';
import { MouseManager } from '@canvas/managers/mouse-manager';
import { MouseEventType, UIEventType } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { LineStyle } from '@canvas/models/line-style';
import { Vector } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';

export class UIManager {
    public get uiEnabled(): boolean { return this._uiEnabled; }
    public set enableUI(v: boolean) { this._uiEnabled = v; }
    public get debugEnabled(): boolean { return this._debugEnabled; }
    public set enableDebug(v: boolean) { this._debugEnabled = v; }

    //#region Private Properites

    private context: CanvasRenderingContext2D;
    private mouseManager: MouseManager;
    private collision: CollisionUtility;

    // elements
    private uiElements: CanvasUIElement[] = [];

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

        this.collision = new CollisionUtility();

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

    addUIElement(element: CanvasUIElement) {
        this.uiElements.push(element);
        this.addToUiBuffer(() => element.draw());
    }

    addUIElements(elements: CanvasUIElement[]) {
        if (elements) {
            elements.forEach(element => {
                this.addUIElement(element);
            });
        }
    }

    removeUIElement(element: CanvasUIElement) {
        let bi = this.uiElements.indexOf(element);
        this.uiElements.splice(bi, 1);
    }

    removeUIElements(elements: CanvasUIElement[]) {
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

            // TODO: only clear UI buffer when it not being shown
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
        let cu = this.collision;

        // TODO: Add rectangle search
        this.uiElements.forEach(element => {
            if (cu.checkRadiusCollision(mp, 1, element.position, element.radius)) {
                element.buttonHover();
            }
            else {
                element.buttonleave();
            }
        });
    }

    private checkPointerDown(e: MouseData) {
        let mp = e.mousePosition;
        let cu = this.collision;

        // TODO: Add rectangle search
        this.uiElements.forEach(element => {
            if (cu.checkRadiusCollision(mp, 1, element.position, element.radius)) {
                element.buttonDown();
            }
        });
    }

    private checkPointerUp(e: MouseData) {
        let mp = e.mousePosition;
        let cu = this.collision;

        // TODO: Add rectangle search
        this.uiElements.forEach(element => {
            if (cu.checkRadiusCollision(mp, 1, element.position, element.radius)) {
                element.buttonUp();
            }
        });
    }

    //#endregion

}
