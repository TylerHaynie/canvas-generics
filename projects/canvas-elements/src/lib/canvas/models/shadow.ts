export class Shadow {
    blur: number;
    shade: string;
    offsetX: number;
    offsetY: number;

    constructor(blur: number = 1, color: string = '#151515') {
        this.blur = blur;
        this.shade = color;
        this.offsetX = 0;
        this.offsetY = 0;
    }
}
