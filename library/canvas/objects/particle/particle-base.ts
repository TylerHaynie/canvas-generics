import { Velocity } from '@canvas/models/velocity';
import { RandomUtility } from '@canvas/utilities/random-utility';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Circle } from '@canvas/shapes/circle';
import { Vector2D } from '@canvas/objects/vector';
import { Color } from '@canvas/models/color';
import { Size } from '@canvas/models/size';
import { Bounds } from '@canvas/objects/bounds';

export class ParticleBase {
    private velocity: Velocity;
    protected shape: Rectangle | Circle;
    protected alive: boolean = true;
    public get isAlive(): boolean { return this.alive; }

    private randomUtil: RandomUtility = new RandomUtility();

    constructor(shape: Rectangle | Circle, v: Velocity) {
        this.shape = shape;
        this.velocity = v;
    }

    setPosition(p: Vector2D) {
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

    getSize() {
        if ((<Rectangle>this.shape).size) {
             return (<Rectangle>this.shape).size;
        }
        else {
            return new Size((<Circle>this.shape).radius / 2, (<Circle>this.shape).radius / 2);
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
        this.shape.position = new Vector2D(
            this.shape.position.x + this.velocity.vx,
            this.shape.position.y + this.velocity.vy
        );
    }

    wiggle() {
        let nx = this.shape.position.x + this.randomUtil.randomWithNegative();
        let ny = this.shape.position.y + this.randomUtil.randomWithNegative();
        this.shape.position = new Vector2D(nx, ny);
    }

    draw() {
        if (this.alive && this.shape) {
            this.shape.draw();
        }
    }

}
