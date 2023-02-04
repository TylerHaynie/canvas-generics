import { IDrawable } from '../models/interfaces/idrawable';
import { Circle } from '../shapes/circle';
import { Rectangle } from '../shapes/rectangle';

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
    private drawables: IDrawable[] = [];
    private shapeReferences: RenderObjectReference[] = [];

    public get shapeCount(): number { return this.drawables.length; }
    public get drawCalls(): number { return this._drawCalls; }

    addShape(shape: Rectangle | Circle): RenderObjectReference {
        var newIndex = this.drawables.length;
        var objRef = new RenderObjectReference(newIndex, shape.id, shape.position.z);

        this.drawables.push(shape);
        this.shapeReferences.push(objRef);
        this.needsSort = true;

        return objRef;
    }

    getShapeById(id: string) {
        var ref = this.shapeReferences.find(c => c.id === id);
        if (ref != null)
            return this.drawables[ref.renderIndex];
    }

    getShapeByIndex(index: number) {
        if (index < 0) return null;
        return this.drawables[index];
    }

    render(context: CanvasRenderingContext2D) {
        this._drawCalls = 0;

        if (this.needsSort) {
            this.shapeReferences.sort((a, b) => b.zPosition - a.zPosition);
            this.needsSort = false;
        }

        for (const ref of this.shapeReferences) {
            this.drawables[ref.renderIndex].draw(context);
            this._drawCalls += 1;
        }
    }
}



//// Something like this with a worker thread...
// export class RenderManagerWithWorker {
//     private _drawCalls: number = 0;

//     private needsSort: boolean = false;
//     private drawables: IDrawable[] = [];
//     private shapeReferences: RenderObjectReference[] = [];
//     private _renderWorker: Worker;
//     private _workerContext: CanvasRenderingContext2D;
//     private _canvas: HTMLCanvasElement;
//     private _offscreenCanvas: OffscreenCanvas;

//     public get shapeCount(): number { return this.drawables.length; }
//     public get drawCalls(): number { return this._drawCalls; }

//     constructor(canvas: HTMLCanvasElement) {
//         this.buildWorker();
//     }

//     private buildWorker(): void {
//         var blob = new Blob(["self.onmessage = function(event) { postMessage(event.data); }"], { type: 'application/javascript' });
//         this._renderWorker = new Worker(URL.createObjectURL(blob));
//         this._renderWorker.onmessage = (e) => this.onWorkerMessage(e)
//     }

//     private buildRender(canvas: HTMLCanvasElement): void {
//         this._canvas = canvas;
//         this._offscreenCanvas = this._canvas.transferControlToOffscreen();
//     }

//     addShape(shape: Rectangle | Circle): RenderObjectReference {
//         var newIndex = this.drawables.length;
//         var objRef = new RenderObjectReference(newIndex, shape.id, shape.position.z);

//         this.drawables.push(shape);
//         this.shapeReferences.push(objRef);
//         this.needsSort = true;

//         return objRef;
//     }

//     getShapeById(id: string) {
//         var ref = this.shapeReferences.find(c => c.id === id);
//         if (ref != null)
//             return this.drawables[ref.renderIndex];
//     }

//     getShapeByIndex(index: number) {
//         if (index < 0) return null;
//         return this.drawables[index];
//     }

//     render() {
//         this._drawCalls = 0;

//         this._renderWorker.postMessage(
//             this._offscreenCanvas,
//             [this._offscreenCanvas]
//         );
//     }

//     private onWorkerMessage(e: MessageEvent<any>) {
//         console.log(e.data);

//         this._workerContext = (<HTMLCanvasElement>e.data).getContext('2d');

//         if (this.needsSort) {
//             this.shapeReferences.sort((a, b) => b.zPosition - a.zPosition);
//             this.needsSort = false;
//         }

//         for (const ref of this.shapeReferences) {
//             this.drawables[ref.renderIndex].draw(this._workerContext);
//             this._drawCalls += 1;
//         }
//     }

//}