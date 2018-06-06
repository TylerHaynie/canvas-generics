import { Vector } from '@canvas/objects/vector';

export class RandomUtility {
    /// returns a random number between -1 and 1
    randomWithNegative() {
        return Math.fround(((Math.random() * 200) - 100) / 100);
    }

    /// returns a random number between n1 and n2
    randomNumberBetween(n1, n2) {
        return Math.floor(Math.random() * Math.max(n1, n2)) + Math.min(n1, n2);
    }

    randomVectorInBounds(w: number, h: number): Vector {
        let rx = Math.fround(Math.random() * w);
        let ry = Math.fround(Math.random() * h);
        return <Vector>{ x: rx, y: ry };
    }
}
