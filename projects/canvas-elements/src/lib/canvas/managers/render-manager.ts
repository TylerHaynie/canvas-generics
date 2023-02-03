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

    // render(WebGPUContent) {
    //    ...
    // }
}