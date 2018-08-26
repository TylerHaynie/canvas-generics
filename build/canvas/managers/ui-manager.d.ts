import { MouseManager } from 'canvas/managers/mouse-manager';
import { ElementBase } from 'canvas/elements/element-base';
export declare class UIManager {
    uiEnabled: boolean;
    debugEnabled: boolean;
    private mouseManager;
    private uiElements;
    private _uiEnabled;
    private _uiBuffer;
    readonly uiBuffer: [{
        drawCallBack: () => void;
    }];
    private _mainBuffer;
    readonly mainBuffer: [{
        drawCallBack: () => void;
    }];
    private _debugEnabled;
    private _debugBuffer;
    readonly debugBuffer: [{
        drawCallBack: () => void;
    }];
    constructor(mouseManager: MouseManager);
    private registerEvents;
    addUIElement(element: ElementBase): void;
    addUIElements(elements: ElementBase[]): void;
    removeUIElement(element: ElementBase): void;
    removeUIElements(elements: ElementBase[]): void;
    addToMainBuffer(cb: () => void): void;
    drawMainBuffer(): void;
    clearMainBuffer(): void;
    addToUiBuffer(cb: () => void): void;
    drawUiBuffer(): void;
    clearUiBuffer(): void;
    addToDeubgBuffer(cb: () => void): void;
    drawDebugBuffer(): void;
    clearDebugBuffer(): void;
    private pointerMoved;
    private checkPointerDown;
    private checkPointerUp;
}
