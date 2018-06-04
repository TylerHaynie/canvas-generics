export class Shadow {
    shadowBlur: number;
    shadowColor: string;

    constructor(blur: number = 1, color: string = '#151515') {
        this.shadowBlur = blur;
        this.shadowColor = color;
    }
}
