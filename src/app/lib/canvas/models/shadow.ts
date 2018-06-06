export class Shadow {
    shadowBlur: number;
    shadowColor: string;
    offsetX: number;
    offsetY: number;

    constructor(blur: number = 1, color: string = '#151515') {
        this.shadowBlur = blur;
        this.shadowColor = color;
        this.offsetX = 0;
        this.offsetY = 0;
    }
}
