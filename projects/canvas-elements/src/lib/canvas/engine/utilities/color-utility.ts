export abstract class ColorUtility {
    public static randomColorFromArray(colorArray: string[]) {
        return colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    public static randomColor(min = '0', max = 'f'): string {
        let a = '0123456789abcdef';

        let minIndex = a.indexOf(min);
        let maxIndex = a.indexOf(max);
        let range = a.substring(minIndex, maxIndex);

        let color: string = '#';
        for (let x = 0; x < 6; x++) {
            color += range[Math.floor(Math.random() * range.length)];
        }

        return color;
    }

    public static randomGray(min = '0', max = 'f'): string {
        let a = '0123456789abcdef';

        let minIndex = a.indexOf(min);
        let maxIndex = a.indexOf(max);
        let range = a.substring(minIndex, maxIndex + 1);
        let c = range[Math.floor(Math.random() * range.length)];
        return `#${c}${c}${c}`;
    }
}
