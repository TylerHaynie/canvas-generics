import { Polygon } from '../geometry/polygon';
import { CanvasPolygonRender } from '../render/canvas-polygon-render';
import { PolygonRenderReference } from '../render/polygon-render-reference';
import { CanvasShader } from '../render/shaders/canvas-api/canvas-shader';

export class RenderManager {
    private _bitmapContext: ImageBitmapRenderingContext;
    private _context: CanvasRenderingContext2D;

    private _drawCalls: number = 0;
    private _needsSort: boolean = false;

    private _polygons: Polygon[] = [];
    private _polyRenderRefs: PolygonRenderReference[] = [];

    public get polygonCount(): number { return this._polygons.length; }
    public get drawCalls(): number { return this._drawCalls; }

    private _polyRender: CanvasPolygonRender;

    private _zDepthMin = 1;
    private _zDepthMax = 11;

    private _readyForFrameRender: boolean = true;

    constructor(canvas: HTMLCanvasElement) {
        this._bitmapContext = canvas.getContext('bitmaprenderer');
        //this._context = canvas.getContext('2d');
        this._polyRender = new CanvasPolygonRender(canvas, (image) => this.renderComplete(image));
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

    renderPolygons() {
        this._drawCalls = 0;

        if (this._needsSort) {
            this._polyRenderRefs.sort((a, b) => this._polygons[b.polygonIndex].position.z - this._polygons[a.polygonIndex].position.z);
            this._needsSort = false;
        }

        for (let i = 0; i < this._polyRenderRefs.length; i++) {
            let poly = this._polygons[this._polyRenderRefs[i].polygonIndex];
            let alpha = 1 - (poly.position.z - this._zDepthMin) / (this._zDepthMax - this._zDepthMin);

            this._polyRenderRefs[i].shader.edgeColor.setAlpha(alpha);
            this._polyRenderRefs[i].shader.faceColor.setAlpha(alpha);
        }

        if (this._readyForFrameRender) {
            this._readyForFrameRender = false;
            this._polyRender.drawPolygonsWorker(this._polygons, this._polyRenderRefs);
        }

        // this._polyRender.drawMany(this._context, this._polygons, this._polyRenderRefs);
    }

    renderComplete(image: ImageBitmap): void {
        this._bitmapContext.transferFromImageBitmap(image);
        this._readyForFrameRender = true;

    }
}