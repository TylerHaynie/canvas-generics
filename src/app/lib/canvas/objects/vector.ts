export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // subtract(amount: number) {
    //     return <Vector>{
    //         x: this.x - amount, y: this.y - amount
    //     };
    // }

    // subtractVector(other: Vector) {
    //     let n = <Vector>{
    //         x: this.x + other.x,
    //         y: this.y + other.y
    //     };
    // }

    // add(amount: number) {
    //     return <Vector>{
    //         x: this.x + amount,
    //         y: this.y + amount
    //     };
    // }

    // addVector(other: Vector) {
    //     return <Vector>{
    //         x: this.x + other.x,
    //         y: this.y + other.y
    //     };
    // }

    // divide(amount: number) {
    //     return <Vector>{
    //         x: this.x / amount,
    //         y: this.y / amount
    //     };
    // }

    // divideVector(other: Vector) {
    //     return <Vector>{
    //         x: this.x / other.x,
    //         y: this.y / other.y
    //     };
    // }

    // multiply(amount: number) {
    //     return <Vector>{
    //         x: this.x * amount,
    //         y: this.y * amount
    //     };
    // }

    // multiplyVector(other: Vector) {
    //     return <Vector>{
    //         x: this.x * other.x,
    //         y: this.y * other.y
    //     };
    // }

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
