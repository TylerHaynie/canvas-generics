import { iPoint } from './iPoint';
export class Utils {

    constructor() { }

    //#region Drawing

    drawCircle(context, x: number, y: number, r: number, c: string, a: number = 1, lw: number = 0, lc: string = '') {
        context.save();
        context.globalAlpha = a;
        context.beginPath();
        context.fillStyle = c;
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fill();
        if (lw > 0) {
            context.strokeStyle = lc;
            context.stroke();
        }

        context.restore();
    }

    drawRectangle(context, x: number, y: number, w: number, h: number, c: string, a: number = 1, lw: number = 0, lc: string = '', sblur: number = 0, sc: string = '#fff') {
        context.save();
        context.globalAlpha = a;
        context.fillStyle = c;

        if (sblur > 0) {
            context.shadowBlur = sblur;
            context.shadowColor = sc;
        }

        context.fillRect(x, y, w, h);

        if (lw > 0) {
            context.strokeStyle = lc;
            context.strokeRect(x, y, w, h);
        }

        context.restore();
    }

    //#endregion

    //#region Collision

    pointOnCircle(point: { x: number, y: number, r: number }, circle: { x: number, y: number, r: number }): boolean {
        let withinBounds: boolean = false;

        // change radius if you want a wider range
        let pointerPoint = { radius: point.r, x: point.x, y: point.y };

        let circle2 = { radius: circle.r, x: circle.x, y: circle.y };

        let dx = pointerPoint.x - circle2.x;
        let dy = pointerPoint.y - circle2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pointerPoint.radius + circle2.radius) {
            withinBounds = true;
        }

        return withinBounds;
    }

    //#endregion

    //#region Movement

    movepoints(bounds, points: iPoint[]) {
        points.forEach((point) => {
            let posX = point.x + Math.random() * 5;
            let posY = point.y + Math.random() * 5;

            if (posX + point.r >= bounds.right) {
                point.vx = -point.vx;
            }
            else if (posX <= bounds.left) {
                point.vx = Math.abs(point.vx);
            }

            if (posY + point.r >= bounds.bottom) {
                point.vy = -point.vy;
            }
            else if (posY <= bounds.top) {
                point.vy = Math.abs(point.vy);
            }

            point.x = point.x + point.vx;
            point.y = point.y + point.vy;
        });
    }

    wigglePoints(points: iPoint[]) {
        points.forEach(point => {
            point.x = point.x + this.randomWithNegative();
            point.y = point.y + this.randomWithNegative();
        });
    }

    //#endregion

    //#region Colors

    randomColorFromArray(colorArray: string[]) {
        return colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    randomColor(min = '0', max = 'f'): string {
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

    randomGray(min = '0', max = 'f'): string {
        let a = '0123456789abcdef';

        let minIndex = a.indexOf(min);
        let maxIndex = a.indexOf(max);
        let range = a.substring(minIndex, maxIndex + 1);
        let c = range[Math.floor(Math.random() * range.length)];
        return `#${c}${c}${c}`;
    }

    //#endregion

    //#region Random

    // returns number from -1 to 1
    randomWithNegative() {
        return (((Math.random() * 200) - 100) / 100);
    }

    randomNumberBetween(n1, n2) {
        return Math.floor(Math.random() * Math.max(n1, n2)) + Math.min(n1, n2);
    }

    //#endregion
}
