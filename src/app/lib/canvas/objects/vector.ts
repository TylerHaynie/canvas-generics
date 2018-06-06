export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    slope(other: Vector) {
        return (other.y - this.y) / (other.x - this.x);
    }

    rotate(angle: number) {
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);

        return <Vector>{ x: x, y: y };
    }

    distance(other: Vector): number {
        let d2 = Math.pow((other.x - this.x), 2) + Math.pow((other.y - this.y), 2);
        return Math.sqrt(Math.pow((other.x - this.x), 2) + Math.pow((other.y - this.y), 2));
    }

}
