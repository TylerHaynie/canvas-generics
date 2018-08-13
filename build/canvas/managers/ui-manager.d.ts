import { MouseManager } from 'canvas/managers/mouse-manager';
import { ElementBase } from 'canvas/elements/element-base';
export declare class UIManager {
    uiEnabled: boolean;
    debugEnabled: boolean;
    private context;
    private mouseManager;
    private uiElements;
    private _uiEnabled;
    private _uiBuffer;
    readonly uiBuffer: [{
            callback: () => void;
        }];
    private _mainBuffer;
    readonly mainBuffer: [{
            callback: () => void;
        }];
    private _debugEnabled;
    private _debugBuffer;
    readonly debugBuffer: [{
            callback: () => void;
        }];
    constructor(context: CanvasRenderingContext2D, mouseManager: MouseManager);
    private registerEvents();
    addUIElement(element: ElementBase): void;
    addUIElements(elements: ElementBase[]): void;
    removeUIElement(element: ElementBase): void;
    removeUIElements(elements: ElementBase[]): void;
    addToMainBuffer(drawCallback: () => void): void;
    drawMainBuffer(): void;
    clearMainBuffer(): void;
    addToUiBuffer(drawCallback: () => void): void;
    drawUiBuffer(): void;
    clearUiBuffer(): void;
    addToDeubgBuffer(drawCallback: () => void): void;
    drawDebugBuffer(): void;
    clearDebugBuffer(): void;
    private pointerMoved(e);
    private checkPointerDown(e);
    private checkPointerUp(e);
}
