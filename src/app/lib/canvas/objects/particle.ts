import { Vector } from '../objects/vector';
import { RandomUtility } from '../utilities/random-utility';
import { Bounds } from './bounds';
import { Size } from '../models/size';
import { Color } from '../models/color';
import { Velocity } from '../models/velocity';
import { Shadow } from '../models/shadow';

export class Particle {
    position: Vector;
    size: Size;
    velocity: Velocity;

    private randomUtil: RandomUtility = new RandomUtility();

    constructor(point: Vector) {
        this.position = point;
        this.size = new Size(1, 1);
        this.velocity = new Velocity(0, 0);
    }

    move(bounds: Bounds) {
        let posX = this.position.x + Math.random() * 5;
        let posY = this.position.y + Math.random() * 5;

        // reverse x direction
        if (posX + this.size.width >= bounds.width) {
            this.velocity.vx = -this.velocity.vx;
        }
        else if (posX <= bounds.x) {
            this.velocity.vx = Math.abs(this.velocity.vx);
        }

        // reverse y direction
        if (posY + this.size.height >= bounds.height) {
            this.velocity.vy = -this.velocity.vy;
        }
        else if (posY <= bounds.y) {
            this.velocity.vy = Math.abs(this.velocity.vy);
        }

        // update vector with speed
        this.position = new Vector(this.position.x + this.velocity.vx, this.position.y + this.velocity.vy);
    }

    wiggle() {
        this.position.x = this.position.x + this.randomUtil.randomWithNegative();
        this.position.y = this.position.y + this.randomUtil.randomWithNegative();
    }

}
