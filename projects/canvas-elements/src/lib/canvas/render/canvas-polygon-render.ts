import { Edge } from "../geometry/edge";
import { Face } from "../geometry/face";
import { Polygon } from "../geometry/polygon";
import { PolygonRenderReference } from "./polygon-render-reference";
import { CanvasShader } from "./shaders/canvas-api/canvas-shader";

export class CanvasPolygonRender {

    async drawMany(context: CanvasRenderingContext2D, polygons: Polygon[], renderReferences: PolygonRenderReference[]) {
        for (let i = 0; i < renderReferences.length; i++) {
            let polygon = polygons[renderReferences[i].polygonIndex];

            context.save();

            if (renderReferences[i].shader.drawFace) {
                this.drawFaces(context, polygon);
                context.globalAlpha = renderReferences[i].shader.faceColor.alpha;
                context.fillStyle = renderReferences[i].shader.faceColor.shade;
                context.fill();
            }

            if (renderReferences[i].shader.drawEdge) {
                if (!renderReferences[i].shader.drawFace) this.drawEdges(context, polygon);
                context.lineWidth = renderReferences[i].shader.edgeWidth;
                context.globalAlpha = renderReferences[i].shader.edgeColor.alpha;
                context.strokeStyle = renderReferences[i].shader.edgeColor.shade;
                context.stroke();
            }

            context.restore();
        }
    }

    async drawSingle(context: CanvasRenderingContext2D, polygon: Polygon, renderReference: PolygonRenderReference) {
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

}