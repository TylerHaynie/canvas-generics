import { Color } from './color';

export class LineStyle extends Color {
    lineWidth: number;

    constructor(lineWidth: number = 1) {
        super();
        this.lineWidth = lineWidth;
    }
}
