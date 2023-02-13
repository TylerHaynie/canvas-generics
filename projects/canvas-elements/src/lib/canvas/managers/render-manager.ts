import { Polygon } from '../geometry/polygon';
import { CanvasPolygonRender } from '../render/canvas-polygon-render';
import { PolygonRenderReference } from '../render/polygon-render-reference';
import { CanvasShader } from '../render/shaders/canvas-api/canvas-shader';

export class RenderManager {
    private _drawCalls: number = 0;
    private _needsSort: boolean = false;

    private _polygons: Polygon[] = [];
    private _polyRenderRefs: PolygonRenderReference[] = [];

    public get polygonCount(): number { return this._polygons.length; }
    public get drawCalls(): number { return this._drawCalls; }

    private _polyRender: CanvasPolygonRender = new CanvasPolygonRender();

    private _zDepthMin = 1;
    private _zDepthMax = 11;

    private _renderWorker: Worker;

    constructor() {
        // let blob = new Blob([this.getWorkerBody()], { type: 'application/javascript' });
        // this._renderWorker = new Worker(URL.createObjectURL(blob));

        // this._renderWorker.onmessage = (e) => this.handleWorkerMessage(e);
    }

    addPolygon(polygon: Polygon, shader: CanvasShader): PolygonRenderReference {
        let newIndex = this._polygons.length;
        let polyRef = new PolygonRenderReference(newIndex, polygon.id, shader);

        this._polygons.push(polygon);
        this._polyRenderRefs.push(polyRef);
        this._needsSort = true;

        return polyRef;
    }

    getPolygonById(id: string): Polygon | undefined {
        let ref = this._polyRenderRefs.find(c => c.polygonId === id);
        if (ref == null) return undefined;

        return this._polygons[ref.polygonIndex];
    }

    getPolygonByIndex(index: number): Polygon | undefined {
        if (index < 0) return undefined;
        return this._polygons[index];
    }

    getPolygonByRenderRef(renderRef: PolygonRenderReference): Polygon | undefined {
        if (renderRef == undefined || renderRef.polygonIndex < 0) return undefined;
        return this._polygons[renderRef.polygonIndex];
    }

    // This needs to execute on a worker thread
    // 1. start worker
    // 2. draw to an offscreen canvas
    // 3. once all drawing operations are done, copy offscreen canvas to render canvas for display
    renderPolygons(context: CanvasRenderingContext2D) {
        this._drawCalls = 0;

        if (this._needsSort) {
            this._polyRenderRefs.sort((a, b) => this._polygons[b.polygonIndex].position.z - this._polygons[a.polygonIndex].position.z);
            this._needsSort = false;
        }

        for (let i = 0; i < this._polyRenderRefs.length; i++) {
            let alpha = 1.0 - (this._polygons[this._polyRenderRefs[i].polygonIndex].position.z - this._zDepthMin) / (this._zDepthMax - this._zDepthMin);
            this._polyRenderRefs[i].shader.edgeColor.setAlpha(alpha);
            this._polyRenderRefs[i].shader.faceColor.setAlpha(alpha);

            // this._polyRender.drawSingle(context, poly, ref);
        }

        for (let i = 0; i < this._polyRenderRefs.length; i++) {
            this._polyRender.drawSingle(context, this._polygons[this._polyRenderRefs[i].polygonIndex], this._polyRenderRefs[i]);
        }

        // this._polyRender.drawMany(context, this._polygons, this._polyRenderRefs);

        // let offscreen = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        // let message = {
        //     canvas: offscreen,
        //     polyRender: this._polyRender,
        //     polygons: this._polygons,
        //     references: this._polyReferences,
        //     zDepthMax: this._zDepthMax,
        //     zDepthMIn: this._zDepthMin
        // }

        // this._renderWorker.postMessage(message, [offscreen]);
    }

    // private handleWorkerMessage(e) {
    //     console.log(`page got message:`, e);
    // }

    // private getWorkerBody(): string {
    //     return `
    //     self.onmessage = function (e) {
    //         console.log('Rendering', e.data);

    //         offscreen = new OffscreenCanvas(e.data.canvas.width, e.data.canvas.height);
    //         ctx = offscreen.getContext('2d');

    //         for (let i = 0; i < e.data.references.length; i++) {
    //             var ref = e.data.references[i];
    //             var poly = e.data.polygons[ref.polygonIndex];

    //             console.log('Working on poly', e.data.poly);

    //             // TODO: apply to a plane at the zdepth, not the polygons. increase alpha as you go deeper
    //             let alpha = 1.0 - (poly.getPosition().z - e.data.zDepthMin) / (e.data.zDepthMax - e.data.zDepthMin);
    //             ref.shader.edgeColor.setAlpha(alpha);
    //             ref.shader.faceColor.setAlpha(alpha);

    //             e.data.polyRender.draw(ctx, poly, ref.shader);
    //         }

    //         var image = offscreen.transferToImageBitmap();
    //         self.postMessage({ image: image }, [image]);
    //     };
    //     `;
    // }
}