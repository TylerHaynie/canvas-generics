import { RENDER_EVENT_TYPE } from "../events/canvas-enums";
import { CanvasEvent } from "../events/canvas-event";
import { RenderEventData } from "../events/event-data";
import { Edge } from "../geometry/edge";
import { Face } from "../geometry/face";
import { Polygon } from "../geometry/polygon";
import { PolyRenderReference } from "./poly-render-reference";

export class PolygonRender {
    private _renderWorker: Worker;
    private _canvas: HTMLCanvasElement;

    private _renderEvent = new CanvasEvent<RenderEventData>();
    on(on: RENDER_EVENT_TYPE, callback: (e: RenderEventData) => void) {
        this._renderEvent.subscribe(on, callback);
    }

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;

        let blob = new Blob([this.getCanvasPolygonWorker()], { type: 'application/javascript' });
        this._renderWorker = new Worker(URL.createObjectURL(blob));

        this._renderWorker.onmessage = (e) => this.handleWorkerMessage(e);
        this._renderWorker.postMessage({ action: 'init' });
    }

    drawUsingOffscreen(polygons: Polygon[], renderReferences: PolyRenderReference[]) {
        let message = {
            width: this._canvas.width,
            height: this._canvas.height,
            action: 'render',
            polygons: polygons,
            references: renderReferences
        }

        this._renderWorker.postMessage(message);
    }

    // on main thread
    drawMany(context: CanvasRenderingContext2D, polygons: Polygon[], renderReferences: PolyRenderReference[]) {
        for (let i = 0; i < renderReferences.length; i++) {
            let polygon = polygons[renderReferences[i].polyIndex];
            this.drawSingle(context, polygon, renderReferences[i]);
        }
    }

    // on main thread
    drawSingle(context: CanvasRenderingContext2D, polygon: Polygon, renderReference: PolyRenderReference) {
        context.save();

        if (renderReference.shader.drawFace) {
            this.drawFaces(context, polygon);
            if (renderReference.shader.faceColor.shade == 'transparent')
                context.globalAlpha = 0;
            else {
                context.globalAlpha = renderReference.shader.faceColor.alpha;
                context.fillStyle = renderReference.shader.faceColor.shade;
            }

            context.fill();
        }

        if (renderReference.shader.drawEdge) {
            if (!renderReference.shader.drawFace) this.drawEdges(context, polygon);
            context.lineWidth = renderReference.shader.edgeWidth;

            if (renderReference.shader.edgeColor.shade == 'transparent')
                context.globalAlpha = 0;
            else {
                context.globalAlpha = renderReference.shader.edgeColor.alpha;
                context.strokeStyle = renderReference.shader.edgeColor.shade;
            }

            context.stroke();
        }

        context.restore();
    }

    private drawEdges(context: CanvasRenderingContext2D, poly: Polygon) {
        context.beginPath();

        for (let i = 0; i < poly.edges.length; i++) {
            const edge: Edge = poly.edges[i];
            let indices = edge.indices;

            let v1 = poly.getVector(indices[0]);
            let v2 = poly.getVector(indices[1]);

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

            let startVector = poly.getVector(face.indices[0]);
            context.moveTo(startVector.x, startVector.y);

            for (let faceVertIndex = 1; faceVertIndex < face.indices.length; faceVertIndex++) {
                let v = poly.getVector(face.indices[faceVertIndex]);
                context.lineTo(v.x, v.y);
            }
        }

        context.closePath();
    }

    private handleWorkerMessage(e) {
        if (!e.data || !e.data.action) return;

        switch (e.data.action) {
            case 'complete':
                let event = new RenderEventData();
                event.eventType = RENDER_EVENT_TYPE.RENDER_COMPLETE;
                event.bitmap = e.data.bitmap;
                event.drawCalls = e.data.drawCalls;

                this._renderEvent.fireEvent(event.eventType, event);
                break;
        }
    }

    // TODO: Build this from a class that can be debugged. Maybe a 'worker builder' class.
    private getCanvasPolygonWorker(): string {
        return `
        let ctx;
        let offscreen;

        self.onmessage = function (e) {
            let message = {
                // canvas: e.data.canvas,
                polygons: e.data.polygons,
                references: e.data.references,
                action: e.data.action,
                width: e.data.width,
                height: e.data.height
            }

            switch (message.action) {
                case 'init':
                    init(message);
                    break;
                case 'render':
                    render(message);
                    break;
            }
        };

        function init(message){
            offscreen = new OffscreenCanvas(0,0);
            ctx = offscreen.getContext('2d', { alpha: false });

            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
        }

        function render(message){
            offscreen.width = message.width;
            offscreen.height = message.height;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            let totalDraws = draw(message.polygons, message.references);

            // send image back to render canvas on main thread
            var image = offscreen.transferToImageBitmap();
            self.postMessage({
                action: 'complete',
                drawCalls: totalDraws,
                bitmap: image
            }, [image]);
        }

        function draw(polygons, polyRefs){
            let totalDraws = 0;
            if(polyRefs && polygons){
                for (let i = 0; i < polyRefs.length; i++) {
                    let polygon = polygons[polyRefs[i]._index];
                    let ref = polyRefs[i];
                    drawSingle(polygon, ref);
                    totalDraws = i+1;
                }
            }

            return totalDraws;
        }

        function drawSingle(polygon, renderReference) {
            ctx.save();

            if (renderReference._shader.drawFace) {
                drawFaces(polygon);
                if (renderReference._shader.faceColor.shade == 'transparent')
                    context.globalAlpha = 0;
                else {
                    ctx.globalAlpha = renderReference._shader.faceColor._alpha;
                    ctx.fillStyle = renderReference._shader.faceColor._shade;
                }
                ctx.fill();
            }

            if (renderReference._shader.drawEdge) {
                if (!renderReference._shader.drawFace) drawEdges(polygon);
                ctx.lineWidth = renderReference._shader.edgeWidth;

                if (renderReference._shader.edgeColor.shade == 'transparent')
                    context.globalAlpha = 0;
                else {
                    ctx.globalAlpha = renderReference._shader.edgeColor._alpha;
                    ctx.strokeStyle = renderReference._shader.edgeColor._shade;
                }

                ctx.stroke();
            }

            ctx.restore();
        }

        function drawEdges(poly) {
            ctx.beginPath();

            for (let i = 0; i < poly._edges.length; i++) {
                const edge = poly._edges[i];
                let indices = edge._indices;

                let v1 = poly._vectors[indices[0]];
                let v2 = poly._vectors[indices[1]];

                ctx.moveTo(v1._vector[0], v1._vector[1]);
                ctx.lineTo(v2._vector[0], v2._vector[1]);
            }

            ctx.closePath();
        }

        function drawFaces(poly) {
            ctx.beginPath();

            for (let polyFaceIndex = 0; polyFaceIndex < poly._faces.length; polyFaceIndex++) {
                const face = poly._faces[polyFaceIndex];
                if (face._indices.length < 1) return;

                let startVector = poly._vectors[face._indices[0]];
                ctx.moveTo(startVector._vector[0], startVector._vector[1]);

                for (let faceVertIndex = 1; faceVertIndex < face._indices.length; faceVertIndex++) {
                    let v = poly._vectors[face._indices[faceVertIndex]];
                    ctx.lineTo(v._vector[0], v._vector[1]);
                }
            }

            ctx.closePath();
        }
    `;
    }
}