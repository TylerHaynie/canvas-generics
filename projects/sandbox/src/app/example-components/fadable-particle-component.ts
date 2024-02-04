import {
    CanvasEngine, CanvasShader, ICanvasComponent, PolyRenderReference, RandomUtility, Rectangle, Vector
} from 'canvas-elements';

class PoolItem {
    private _ref: PolyRenderReference;
    private _isAvailable: boolean = true;

    public get polyReference(): PolyRenderReference { return this._ref; }

    public set available(value: boolean) { this._isAvailable = value; }
    public isAvailable(): boolean { return this._isAvailable; }

    constructor(polyRef: PolyRenderReference) {
        this._ref = polyRef;
    }
}

export class PoolComponent {
    private _pool: PoolItem[] = [];
    private _poolSize: number = 0;
    private _engine: CanvasEngine;

    constructor(engine: CanvasEngine, poolSize: number = 1) {
        this._engine = engine;
        this._poolSize = poolSize;

        this.createRectanglePool();
    }

    private createRectanglePool() {
        for (let i = 0; i < this._poolSize; i++) {
            let poly = new Rectangle(new Vector(0, 0, 0));
            let ref = this._engine.renderManager.addPolygon(poly);
            ref.visible = false;

            let poolItem = new PoolItem(ref);
            poolItem.available = true;

            this._pool.push(poolItem);
        }
    }

    public useItem(): PoolItem {
        // basic start to end search. will need to be optimized for large pools
        for (let i = 0; i < this._pool.length; i++) {
            let item = this._pool[i];
            if (item.isAvailable()) {
                item.polyReference.visible = true;
                return item;
            }
        }
        return undefined;
    }

    public returnItem(item: PoolItem) {
        item.polyReference.visible = false;
        item.available = true;
    }
}



// one level higher
// let testShader = new CanvasShader();
// testShader.edgeColor.setShade("#00dd00");
// testShader.faceColor.setShade("#333");

// public _maxSize: number = 50;
// public _minSize: number = 10;

// let size = new Vector(
//     RandomUtility.randomNumberBetween(this._minSize, this._maxSize),
//     RandomUtility.randomNumberBetween(this._minSize, this._maxSize));

// let pos = new Vector(
//     RandomUtility.randomNumberBetween(size.x / 2, this._engine.canvasWidth - size.x / 2),
//     RandomUtility.randomNumberBetween(size.y / 2, this._engine.canvasHeight - size.y / 2),
//     RandomUtility.randomNumberBetween(1, 10));