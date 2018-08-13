"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_utility_1 = require("canvas/utilities/random-utility");
const vector_1 = require("canvas/objects/vector");
const size_1 = require("canvas/models/size");
class ParticleBase {
    constructor(shape, v) {
        this.alive = true;
        this.randomUtil = new random_utility_1.RandomUtility();
        this.shape = shape;
        this.velocity = v;
    }
    get isAlive() { return this.alive; }
    setPosition(p) {
        this.shape.position = p;
    }
    getPosition() {
        return this.shape.position;
    }
    changeColor(color) {
        this.shape.color = color;
    }
    setVelocity(v) {
        this.velocity = v;
    }
    changeSize(sr) {
        if (sr.width) {
            this.shape.size = sr;
        }
        else {
            this.shape.radius = sr;
        }
    }
    getSize() {
        if (this.shape.size) {
            return this.shape.size;
        }
        else {
            return new size_1.Size(this.shape.radius / 2, this.shape.radius / 2);
        }
    }
    move(bounds) {
        let posX = this.shape.position.x + this.velocity.vx;
        let posY = this.shape.position.y + this.velocity.vy;
        let w = this.shape.size ? this.shape.size.width : this.shape.radius * 2;
        let h = this.shape.size ? this.shape.size.height : this.shape.radius * 2;
        if (posX + w >= bounds.width) {
            this.velocity.vx = -this.velocity.vx;
        }
        else if (posX <= bounds.x) {
            this.velocity.vx = Math.abs(this.velocity.vx);
        }
        if (posY + h >= bounds.height) {
            this.velocity.vy = -this.velocity.vy;
        }
        else if (posY <= bounds.y) {
            this.velocity.vy = Math.abs(this.velocity.vy);
        }
        this.shape.position = new vector_1.Vector2D(this.shape.position.x + this.velocity.vx, this.shape.position.y + this.velocity.vy);
    }
    wiggle() {
        let nx = this.shape.position.x + this.randomUtil.randomWithNegative();
        let ny = this.shape.position.y + this.randomUtil.randomWithNegative();
        this.shape.position = new vector_1.Vector2D(nx, ny);
    }
    draw() {
        if (this.alive && this.shape) {
            this.shape.draw();
        }
    }
}
exports.ParticleBase = ParticleBase;
//# sourceMappingURL=particle-base.js.map