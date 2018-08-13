"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ColorUtility {
    randomColorFromArray(colorArray) {
        return colorArray[Math.floor(Math.random() * colorArray.length)];
    }
    randomColor(min = '0', max = 'f') {
        let a = '0123456789abcdef';
        let minIndex = a.indexOf(min);
        let maxIndex = a.indexOf(max);
        let range = a.substring(minIndex, maxIndex);
        let color = '#';
        for (let x = 0; x < 6; x++) {
            color += range[Math.floor(Math.random() * range.length)];
        }
        return color;
    }
    randomGray(min = '0', max = 'f') {
        let a = '0123456789abcdef';
        let minIndex = a.indexOf(min);
        let maxIndex = a.indexOf(max);
        let range = a.substring(minIndex, maxIndex + 1);
        let c = range[Math.floor(Math.random() * range.length)];
        return `#${c}${c}${c}`;
    }
}
exports.ColorUtility = ColorUtility;
//# sourceMappingURL=color-utility.js.map