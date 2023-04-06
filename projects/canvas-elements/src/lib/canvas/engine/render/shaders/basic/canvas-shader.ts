import { Color } from "../../../models/color";

export class CanvasShader {
    public drawEdge: boolean = true;
    public drawFace: boolean = true;

    public edgeWidth: number = 1;
    public edgeColor: Color;
    public faceColor: Color;

    constructor() {
        this.edgeColor = new Color();
        this.faceColor = new Color();
    }

}