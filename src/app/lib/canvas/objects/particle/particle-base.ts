import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { Velocity } from '@canvas/models/velocity';
import { RandomUtility } from '@canvas/utilities/random-utility';
import { Bounds } from '@canvas/objects/bounds';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Circle } from '@canvas/shapes/circle';
import { Color } from '@canvas/models/color';

export class ParticleBase {
    private velocity: Velocity;
    private _random: RandomUtility = new RandomUtility();
    protected shape: Rectangle | Circle;
    protected alive: boolean = true;
    public get isAlive(): boolean { return this.alive; }

    private randomUtil: RandomUtility = new RandomUtility();

    constructor(shape: Rectangle | Circle, v: Velocity) {
        this.shape = shape;
        this.velocity = v;
    }

    setPosition(p: Vector) {
        this.shape.position = p;
    }

    getPosition() {
        return this.shape.position;
    }

    changeColor(color: Color) {
        this.shape.color = color;
    }

    setVelocity(v: Velocity) {
        this.velocity = v;
    }

    changeSize(sr: Size | number) {
        if ((<Size>sr).width) {
            (<Rectangle>this.shape).size = <Size>sr;
        }
        else {
            (<Circle>this.shape).radius = <number>sr;
        }
    }

    move(bounds: Bounds) {
        let posX = this.shape.position.x + this.velocity.vx;
        let posY = this.shape.position.y + this.velocity.vy;


        let w = (<Rectangle>this.shape).size ? (<Rectangle>this.shape).size.width : (<Circle>this.shape).radius * 2;
        let h = (<Rectangle>this.shape).size ? (<Rectangle>this.shape).size.height : (<Circle>this.shape).radius * 2;

        // reverse x direction
        if (posX + w >= bounds.width) {
            this.velocity.vx = -this.velocity.vx;
        }
        else if (posX <= bounds.x) {
            this.velocity.vx = Math.abs(this.velocity.vx);
        }

        // reverse y direction
        if (posY + h >= bounds.height) {
            this.velocity.vy = -this.velocity.vy;
        }
        else if (posY <= bounds.y) {
            this.velocity.vy = Math.abs(this.velocity.vy);
        }

        // update vector with speed
        this.shape.position = new Vector(this.shape.position.x + this.velocity.vx, this.shape.position.y + this.velocity.vy);
    }

    wiggle() {
        this.shape.position.x = this.shape.position.x + this.randomUtil.randomWithNegative();
        this.shape.position.y = this.shape.position.y + this.randomUtil.randomWithNegative();
    }

    draw() {
        if (this.alive && this.shape) {
            this.shape.draw();
        }
    }

}
