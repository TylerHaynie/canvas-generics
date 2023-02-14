import { Edge } from "../geometry/edge";
import { Face } from "../geometry/face";
import { Polygon } from "../geometry/polygon";
import { PolygonRenderReference } from "./polygon-render-reference";

export class CanvasPolygonRender {
    private _renderWorker: Worker;
    private _canvas: HTMLCanvasElement;
    private polygonRenderComplete: (image: ImageBitmap) => void;

    constructor(canvas: HTMLCanvasElement, renderComplete: (image: ImageBitmap) => void) {
        this.polygonRenderComplete = renderComplete;
        let offscreen = new OffscreenCanvas(0, 0);
        this._canvas = canvas;

        let blob = new Blob([this.getCanvasPolygonWorker()], { type: 'application/javascript' });
        this._renderWorker = new Worker(URL.createObjectURL(blob));

        this._renderWorker.onmessage = (e) => this.handleWorkerMessage(e);
        this._renderWorker.postMessage({ action: 'init', canvas: offscreen }, [offscreen]);
    }

    drawPolygonsWorker(polygons: Polygon[], renderReferences: PolygonRenderReference[]) {
        let message = {
            width: this._canvas.width,
            height: this._canvas.height,
            action: 'render',
            polygons: polygons,
            references: renderReferences,
        }

        this._renderWorker.postMessage(message);
    }

    drawMany(context: CanvasRenderingContext2D, polygons: Polygon[], renderReferences: PolygonRenderReference[]) {
        for (let i = 0; i < renderReferences.length; i++) {
            let polygon = polygons[renderReferences[i].polygonIndex];
            this.drawSingle(context, polygon, renderReferences[i]);
        }
    }

    drawSingle(context: CanvasRenderingContext2D, polygon: Polygon, renderReference: PolygonRenderReference) {
        context.save();

        if (renderReference.shader.drawFace) {
            this.drawFaces(context, polygon);
            context.globalAlpha = renderReference.shader.faceColor.alpha;
            context.fillStyle = renderReference.shader.faceColor.shade;
            context.fill();
        }

        if (renderReference.shader.drawEdge) {
            if (!renderReference.shader.drawFace) this.drawEdges(context, polygon);
            context.lineWidth = renderReference.shader.edgeWidth;
            context.globalAlpha = renderReference.shader.edgeColor.alpha;
            context.strokeStyle = renderReference.shader.edgeColor.shade;
            context.stroke();
        }

        context.restore();
    }

    private drawEdges(context: CanvasRenderingContext2D, poly: Polygon) {
        context.beginPath();

        for (let i = 0; i < poly.edges.length; i++) {
            const edge: Edge = poly.edges[i];
            let indices = edge.indices;

            let v1 = poly.getVertex(indices[0]);
            let v2 = poly.getVertex(indices[1]);

            context.moveTo(v1.x, v1.y);
            context.lineTo(v2.x, v2.y);
        }

        context.closePath();
    }

    private drawFaces(context: CanvasRenderingContext2D, poly: Polygon) {
        context.beginPath();

        for (let polyFaceIndex = 0; polyFaceIndex < poly.faces.length; polyFaceIndex++) {
            const face: Face = poly.faces[polyFaceIndex];
            if (face.indices.length < 1) return;

            let startVertex = poly.getVertex(face.indices[0]);
            context.moveTo(startVertex.x, startVertex.y);

            for (let faceVertIndex = 1; faceVertIndex < face.indices.length; faceVertIndex++) {
                let v = poly.getVertex(face.indices[faceVertIndex]);
                context.lineTo(v.x, v.y);
            }
        }

        context.closePath();
    }

    private handleWorkerMessage(e) {
        if (e.data.action && e.data.action == 'complete') {
            this.polygonRenderComplete(e.data.bitmap);
        }
    }

    private getCanvasPolygonWorker(): string {
        return `
        let ctx;
        let offscreen;

        self.onmessage = function (e) {
            let message = {
                canvas: e.data.canvas,
                polygons: e.data.polygons,
                references: e.data.references,
                action: e.data.action,
                width: e.data.width,
                height: e.data.height
            }

            if(message.action == 'init'){
                offscreen = message.canvas;
                ctx = offscreen.getContext('2d');
            }

            if(message.action == 'render'){
                offscreen.width = message.width;
                offscreen.height = message.height;

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                draw(message.polygons, message.references);

                // send image back to render canvas on main thread
                var image = offscreen.transferToImageBitmap();
                self.postMessage({ action: 'complete', bitmap: image }, [image]);
            }
        };

        function draw(polygons, polyRefs){
            if(polyRefs && polygons){
                for (let i = 0; i < polyRefs.length; i++) {
                    let polygon = polygons[polyRefs[i]._index];
                    let ref = polyRefs[i];
                    drawSingle(polygon, ref);
                }
            }
        }

        function drawSingle(polygon, renderReference) {
            ctx.save();

            if (renderReference._shader.drawFace) {
                drawFaces(polygon);
                ctx.globalAlpha = renderReference._shader.faceColor._alpha;
                ctx.fillStyle = renderReference._shader.faceColor._shade;
                ctx.fill();
            }

            if (renderReference._shader.drawEdge) {
                if (!renderReference._shader.drawFace) drawEdges(polygon);
                ctx.lineWidth = renderReference._shader.edgeWidth;
                ctx.globalAlpha = renderReference._shader.edgeColor._alpha;
                ctx.strokeStyle = renderReference._shader.edgeColor._shade;
                ctx.stroke();
            }

            ctx.restore();
        }

        function drawEdges(poly) {
            ctx.beginPath();

            for (let i = 0; i < poly._edges.length; i++) {
                const edge = poly._edges[i];
                let indices = edge._indices;

                let v1 = poly._vertices[indices[0]];
                let v2 = poly._vertices[indices[1]];

                ctx.moveTo(v1._vertex[0], v1._vertex[1]);
                ctx.lineTo(v2._vertex[0], v2._vertex[1]);
            }

            ctx.closePath();
        }

        function drawFaces(poly) {
            ctx.beginPath();

            for (let polyFaceIndex = 0; polyFaceIndex < poly._faces.length; polyFaceIndex++) {
                const face = poly._faces[polyFaceIndex];
                if (face._indices.length < 1) return;

                let startVertex = poly._vertices[face._indices[0]];
                ctx.moveTo(startVertex._vertex[0], startVertex._vertex[1]);

                for (let faceVertIndex = 1; faceVertIndex < face._indices.length; faceVertIndex++) {
                    let v = poly._vertices[face._indices[faceVertIndex]];
                    ctx.lineTo(v._vertex[0], v._vertex[1]);
                }
            }

            ctx.closePath();
        }
    `;
    }
}