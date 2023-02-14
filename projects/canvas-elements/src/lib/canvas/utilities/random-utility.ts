import { Vertex } from '../objects/vertex';

export class RandomUtility {
    /// returns a random number between -1 and 1
    randomWithNegative() {
        return Math.fround(((Math.random() * 200) - 100) / 100);
    }

    /// returns a random number between n1 and n2
    randomNumberBetween(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    randomVectorInBounds(w: number, h: number): Vertex {
        let rx = Math.fround(Math.random() * w);
        let ry = Math.fround(Math.random() * h);
        return new Vertex(rx, ry);
    }
}
