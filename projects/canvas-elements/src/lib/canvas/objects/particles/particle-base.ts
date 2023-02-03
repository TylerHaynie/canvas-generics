import { Color } from '../../models/color';
import { IDrawable } from '../../models/interfaces/idrawable';
import { Size } from '../../models/size';
import { Velocity } from '../../models/velocity';
import { Circle } from '../../shapes/circle';
import { Rectangle } from '../../shapes/rectangle';
import { RandomUtility } from '../../utilities/random-utility';
import { Bounds } from '../bounds';
import { Vector } from '../vector';

export class ParticleBase implements IDrawable {
    private velocity: Velocity;
    protected shape: Rectangle | Circle;
    protected alive: boolean = true;
    public get isAlive(): boolean { return this.alive; }

    private randomUtil: RandomUtility = new RandomUtility();

    constructor(shape: Rectangle | Circle, v: Velocity) {
        this.shape = shape;
        this.velocity = v;
    }

    setPosition(p: Vector) {
        this.shape.setPosition(p.x, p.y, p.z);
    }

    getPosition() {
        return this.shape.position;
    }

    setColor(color: Color) {
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

    move(bounds: Bounds, delta: number) {
        // let posX = this.shape.position.x + this.velocity.vx;
        // let posY = this.shape.position.y + this.velocity.vy;

        let xMovement: number = this.velocity.vx * delta;
        let yMovement: number = this.velocity.vy * delta;

        let newPosX = this.shape.position.x + xMovement;
        let newPosY = this.shape.position.y + yMovement;

        let w = (<Rectangle>this.shape).size ? (<Rectangle>this.shape).size.width : (<Circle>this.shape).radius * 2;
        let h = (<Rectangle>this.shape).size ? (<Rectangle>this.shape).size.height : (<Circle>this.shape).radius * 2;

        // reverse x direction (bounce off edge)
        if (newPosX + w >= bounds.width) {
            this.velocity.vx = -this.velocity.vx;
        }
        else if (newPosX <= bounds.x) {
            this.velocity.vx = Math.abs(this.velocity.vx);
        }

        // reverse y direction (bounce off edge)
        if (newPosY + h >= bounds.height) {
            this.velocity.vy = -this.velocity.vy;
        }
        else if (newPosY <= bounds.y) {
            this.velocity.vy = Math.abs(this.velocity.vy);
        }

        // update vector with speed
        this.shape.setPosition(
            this.shape.position.x + (this.velocity.vx * delta),
            this.shape.position.y + (this.velocity.vy * delta),
            this.shape.position.z
        );
    }

    wiggle() {
        let nx = this.shape.position.x + this.randomUtil.randomWithNegative();
        let ny = this.shape.position.y + this.randomUtil.randomWithNegative();
        this.shape.setPosition(nx, ny, this.shape.position.z);
    }

    async draw(context: CanvasRenderingContext2D) {
        if (this.alive && this.shape) {
            this.shape.draw(context);
        }
    }

}
