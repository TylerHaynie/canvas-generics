import { Color } from '@canvas/models/color';

export class LineStyle extends Color {
    width: number;

    constructor(lineWidth: number = 1) {
        super();
        this.width = lineWidth;
    }
}
