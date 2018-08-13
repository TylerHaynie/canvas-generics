import { Color } from 'canvas/models/color';
export declare class LineStyle extends Color {
    width: number;
    constructor(shade?: string | CanvasGradient | CanvasPattern, lineWidth?: number);
}
