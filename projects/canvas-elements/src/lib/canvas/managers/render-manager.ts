import { ElementBase } from '../elements/element-base';
import { MOUSE_EVENT_TYPE } from '../events/canvas-enums';
import { MouseData } from '../events/event-data';
import { IDrawable } from '../models/interfaces/idrawable';
import { Vector } from '../objects/vector';
import { Circle } from '../shapes/circle';
import { Rectangle } from '../shapes/rectangle';
import { MouseManager } from './mouse-manager';

class RenderObjectReference {
    private _posZ: number;
    private _index: number = -1;
    private _shapeId: string = '';
    public get id(): string { return this._shapeId; }
    public get renderIndex(): number { return this._index }
    public get zPosition(): number { return this._posZ }

    constructor(index: number, shapeId: string, zPosition: number) {
        this._index = index;
        this._shapeId = shapeId;
        this._posZ = zPosition;
    }
}

export class RenderManager {
    private _drawCalls: number = 0;

    private needsSort: boolean = false;
    private drawableShapes: IDrawable[] = [];
    //TODO: Need to clean up base shapes to make single reference array for a common base type
    private shapeReferences: RenderObjectReference[] = [];

    public get shapeCount(): number { return this.drawableShapes.length; }
    public get drawCalls(): number { return this._drawCalls; }

    addShape(shape: Rectangle | Circle) {
        var newIndex = this.drawableShapes.length;
        this.drawableShapes.push(shape);
        this.shapeReferences.push(new RenderObjectReference(newIndex, shape.id, shape.position.z));
        this.needsSort = true;
    }

    findShape(id: string) {
        var ref = this.shapeReferences.find(c => c.id === id);
        if (ref != null)
            return this.drawableShapes[ref.renderIndex];
    }

    render(context: CanvasRenderingContext2D) {
        this._drawCalls = 0;

        if (this.needsSort) {
            this.shapeReferences.sort((a, b) => b.zPosition - a.zPosition);
            this.needsSort = false;
        }

        for (const ref of this.shapeReferences) {
            this.drawableShapes[ref.renderIndex].draw(context);
            this._drawCalls += 1;
        }
    }
}






// export class RenderManager {
//     public get uiEnabled(): boolean { return this._uiEnabled; }
//     public set uiEnabled(v: boolean) { this._uiEnabled = v; }
//     public get debugEnabled(): boolean { return this._debugEnabled; }
//     public set debugEnabled(v: boolean) { this._debugEnabled = v; }

//     //#region Private Properites
//     private mouseManager: MouseManager;

//     // elements
//     private uiElements: ElementBase[] = [];

//     private _uiEnabled: boolean = true;
//     private _uiBuffer: [{ drawCallBack: () => void }];
//     public get uiBuffer() { return this._uiBuffer; }

//     private _mainBuffer: [{ drawCallBack: (context: CanvasRenderingContext2D) => void }];
//     public get mainBuffer() { return this._mainBuffer; }

//     private _debugEnabled: boolean = false;
//     private _debugBuffer: [{ drawCallBack: () => void }];
//     public get debugBuffer() { return this._debugBuffer; }

//     //#endregion

//     //#region Init


//     // TODO: need to fire off UI events and refactor a bit after that.
//     // TODO: QuadTree needs to live here

//     constructor(mouseManager: MouseManager) {
//         this.mouseManager = mouseManager;
//         this.registerEvents();
//     }

//     private registerEvents() {
//         this.mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e: MouseData) => {
//             if (this._uiEnabled) {
//                 this.pointerMoved(e);
//             }
//         });

//         this.mouseManager.on(MOUSE_EVENT_TYPE.DOWN, (e: MouseData) => {
//             if (this._uiEnabled) {
//                 this.checkPointerDown(e);
//             }
//         });

//         this.mouseManager.on(MOUSE_EVENT_TYPE.UP, (e: MouseData) => {
//             if (this._uiEnabled) {
//                 this.checkPointerUp(e);
//             }
//         });

//         this.mouseManager.on(MOUSE_EVENT_TYPE.OUT, (e: MouseData) => {
//             this.uiElements.forEach(element => {
//                 element.elementMouseOut(e);
//             });
//         });
//     }

//     //#endregion

//     //#region Public UI Element Functions

//     addUIElement(context: CanvasRenderingContext2D, element: ElementBase) {
//         this.uiElements.push(element);
//         this.addToUiBuffer(() => element.draw(context));
//     }

//     addUIElements(context: CanvasRenderingContext2D, elements: ElementBase[]) {
//         if (elements) {
//             elements.forEach(element => {
//                 this.addUIElement(context, element);
//             });
//         }
//     }

//     removeUIElement(element: ElementBase) {
//         let bi = this.uiElements.indexOf(element);
//         this.uiElements.splice(bi, 1);
//     }

//     removeUIElements(elements: ElementBase[]) {
//         if (elements) {
//             elements.forEach(element => {
//                 let bi = this.uiElements.indexOf(element);
//                 if (bi) {
//                     this.uiElements.splice(bi, 1);
//                 }
//             });
//         }
//     }

//     //#endregion

//     //#region Public Buffer Functions

//     addToMainBuffer(cb: () => void) {
//         if (!this._mainBuffer) {
//             this._mainBuffer = [{ drawCallBack: cb }];
//         }
//         else {
//             this._mainBuffer.push({ drawCallBack: cb });
//         }
//     }

//     drawMainBuffer(context: CanvasRenderingContext2D) {
//         if (this._mainBuffer) {
//             this._mainBuffer.forEach(buffer => {
//                 buffer.drawCallBack(context);
//             });
//         }
//     }

//     clearMainBuffer() {
//         this._mainBuffer = <any>[];
//     }

//     addToUiBuffer(cb: () => void) {
//         if (!this._uiBuffer) {
//             this._uiBuffer = [{ drawCallBack: cb }];
//         }
//         else {
//             this._uiBuffer.push({ drawCallBack: cb });
//         }
//     }

//     drawUiBuffer() {
//         if (this._uiBuffer) {
//             this._uiBuffer.forEach(buffer => {
//                 buffer.drawCallBack();
//             });
//         }
//     }

//     clearUiBuffer() {
//         this._uiBuffer = <any>[];
//     }

//     addToDeubgBuffer(cb: () => void) {
//         if (!this._debugBuffer) {
//             this._debugBuffer = [{ drawCallBack: cb }];
//         }
//         else {
//             this._debugBuffer.push({ drawCallBack: cb });
//         }
//     }

//     drawDebugBuffer() {
//         if (this._debugBuffer) {
//             this._debugBuffer.forEach(buffer => {
//                 buffer.drawCallBack();
//             });
//         }
//     }

//     clearDebugBuffer() {
//         this._debugBuffer = <any>[];
//     }

//     //#endregion

//     //#region User Interaction

//     private pointerMoved(e: MouseData) {
//         this.uiElements.forEach(element => {

//             element.childElements.forEach(element => {
//                 element.elementMouseMove(e);
//             });

//             element.elementMouseMove(e);

//             if (element.shape.pointWithinBounds(e.mousePosition)) {
//                 element.elementMouseHover(e);
//             }
//             else {
//                 element.elementMouseOut(e);
//             }
//         });
//     }

//     private checkPointerDown(e: MouseData) {
//         this.uiElements.forEach(element => {
//             if (element.shape.pointWithinBounds(e.mousePosition)) {
//                 element.elementMouseDown(e);

//                 element.childElements.forEach(element => {
//                     element.elementMouseDown(e);
//                 });
//             }
//         });
//     }

//     private checkPointerUp(e: MouseData) {
//         this.uiElements.forEach(element => {
//             if (element.shape.pointWithinBounds(e.mousePosition)) {
//                 element.elementMouseUp(e);

//                 element.childElements.forEach(element => {
//                     element.elementMouseUp(e);
//                 });
//             }
//         });
//     }

//     //#endregion

// }
