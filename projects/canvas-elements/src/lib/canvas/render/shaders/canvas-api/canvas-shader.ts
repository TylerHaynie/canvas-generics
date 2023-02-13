import { Color } from "../../../models/color";

export class CanvasShader{
    public drawEdge: boolean = true;
    public edgeWidth: number = 1;
    public edgeColor: Color = new Color();

    public drawFace: boolean = true;
    public faceColor: Color = new Color();
}