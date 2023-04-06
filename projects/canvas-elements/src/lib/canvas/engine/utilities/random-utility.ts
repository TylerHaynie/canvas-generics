import { Vector } from '../geometry/vector';

export abstract class RandomUtility {
    /// returns a random number between -1 and 1
    public static randomWithNegative() {
        return Math.fround(((Math.random() * 200) - 100) / 100);
    }

    /// returns a random number between n1 and n2
    public static randomNumberBetween(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    public static randomVectorInBounds(w: number, h: number): Vector {
        let rx = Math.fround(Math.random() * w);
        let ry = Math.fround(Math.random() * h);
        return new Vector(rx, ry);
    }
}
