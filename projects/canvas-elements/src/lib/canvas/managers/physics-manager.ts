import { ICanvasComponent } from '../models/interfaces/icanvas-component';

class PhysicsObjectReference {
    private _index: number = -1;
    public get componentIndex(): number { return this._index }

    constructor(index: number) {
        this._index = index;
    }
}

export class PhysicsManager {
    private _componentTicks: number = 0;

    private needsSort: boolean = false;
    private components: ICanvasComponent[] = [];
    private componentReferences: PhysicsObjectReference[] = [];

    public get componentCount(): number { return this.components.length; }
    public get componentTicks(): number { return this._componentTicks; }

    addComponent(component: ICanvasComponent): PhysicsObjectReference {
        var newIndex = this.components.length;
        var objRef = new PhysicsObjectReference(newIndex);

        this.components.push(component);
        this.componentReferences.push(objRef);

        return objRef;
    }

    getComponentByIndex(index: number) {
        if (index < 0) return null;
        return this.components[index];
    }

    tick(delta: number) {
        this._componentTicks = 0;

        for (const ref of this.componentReferences) {
            this.components[ref.componentIndex].tick(delta);
            this._componentTicks += 1;
        }
    }
}