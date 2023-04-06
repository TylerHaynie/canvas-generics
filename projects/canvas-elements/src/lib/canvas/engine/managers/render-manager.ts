import { RENDER_EVENT_TYPE } from '../events/canvas-enums';
import { RenderEventData } from '../events/event-data';
import { Polygon } from '../geometry/polygon';
import { PolygonRender } from '../render/polygon-render';
import { PolyRenderReference } from '../render/poly-render-reference';
import { CanvasShader } from '../render/shaders/basic/canvas-shader';

export class RenderManager {
    private _bitmapContext: ImageBitmapRenderingContext;
    // private _context: CanvasRenderingContext2D;

    private _drawCalls: number = 0;
    private _needsSort: boolean = false;

    private _polygons: Polygon[] = [];
    private _polyRenderRefs: PolyRenderReference[] = [];

    public get polygonCount(): number { return this._polygons.length; }
    public get drawCalls(): number { return this._drawCalls; }

    private _polyRender: PolygonRender;

    private _previousRenderComplete: boolean = true;

    constructor(canvas: HTMLCanvasElement) {
        this._bitmapContext = canvas.getContext('bitmaprenderer');
        //this._context = canvas.getContext('2d');
        this.registerRenderers(canvas);
    }

    private registerRenderers(canvas): void {
        this._polyRender = new PolygonRender(canvas);
        this._polyRender.on(RENDER_EVENT_TYPE.RENDER_COMPLETE,
            (e: RenderEventData) => this.renderComplete(e));
    }

    addPolygon(polygon: Polygon, shader: CanvasShader = undefined): PolyRenderReference {
        if (!shader) shader = new CanvasShader();

        let newIndex = this._polygons.length;
        let polyRef = new PolyRenderReference(newIndex, polygon.id, shader);

        this._polygons.push(polygon);
        this._polyRenderRefs.push(polyRef);
        this._needsSort = true;

        return polyRef;
    }

    getPolygonById(id: string): Polygon | undefined {
        let ref = this._polyRenderRefs.find(c => c.polyId === id);
        if (ref == null) return undefined;

        return this._polygons[ref.polyIndex];
    }

    getPolygonByIndex(index: number): Polygon | undefined {
        if (index < 0) return undefined;
        return this._polygons[index];
    }

    getPolygonByRenderRef(renderRef: PolyRenderReference): Polygon | undefined {
        if (renderRef == undefined || renderRef.polyIndex < 0) return undefined;
        return this._polygons[renderRef.polyIndex];
    }

    renderPolygons() {
        if (this._needsSort) {
            this._polyRenderRefs.sort((a, b) =>
                this._polygons[b.polyIndex].position.z - this._polygons[a.polyIndex].position.z);
            this._needsSort = false;
        }

        // web worker
        if (this._previousRenderComplete) {
            this._previousRenderComplete = false;
            this._polyRender.drawUsingOffscreen(this._polygons, this._polyRenderRefs);
        }

        // main thread
        // this._polyRender.drawMany(this._context, this._polygons, this._polyRenderRefs);
    }

    private renderComplete(e: RenderEventData): void {
        this._bitmapContext.transferFromImageBitmap(e.bitmap);
        this._drawCalls = e.drawCalls;
        this._previousRenderComplete = true;
    }
}