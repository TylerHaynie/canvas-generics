import { Color } from '../../engine/models/color';

export class LineStyle extends Color {
    width: number;

    constructor(shade?: string | CanvasGradient | CanvasPattern, lineWidth?: number) {
        super(shade);
        this.width = lineWidth || 1;
    }
}
