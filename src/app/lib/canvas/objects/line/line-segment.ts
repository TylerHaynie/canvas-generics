import { iVector } from '../../interfaces/iVector';

export class LineSegment {
    startVector: iVector;
    vectors: iVector[];

    constructor(startVector: iVector) {
        this.startVector = startVector;
        this.vectors = [];
    }

    addVector(vector: iVector) {
        this.vectors.push(vector);
    }
}
