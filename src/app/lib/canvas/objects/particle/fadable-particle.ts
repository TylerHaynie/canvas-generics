import { Particle } from '../particle';
import { Vector } from '../vector';
import { Rectangle } from '../../shapes/rectangle';
import { Circle } from '../../shapes/circle';
import { Line } from '../../shapes/line/line';

export class FadableParticle extends Particle {

    maximumAlpha: number = 1;
    currentLifeTime: number = 0;
    maximumLifeTime: number = 30;
    fadeSpan: number = 10;
    alive: boolean = true;

    private shape: Rectangle | Circle | Line;

    constructor(position: Vector, shape: Rectangle | Circle | Line) {
        super(position);

        this.shape = shape;
    }

    tick() {
        // add to lifetime
        this.currentLifeTime += 1;

        if (this.currentLifeTime < this.maximumLifeTime) {

            // fade in particle
            if (this.currentLifeTime <= this.fadeSpan) {
                let step = this.maximumAlpha / this.fadeSpan;
                let a = (step * this.currentLifeTime);
                this.setAlpha(a);
            }

            // fade out particle
            else if (this.maximumLifeTime - this.currentLifeTime <= this.fadeSpan) {
                let step = this.maximumAlpha / this.fadeSpan;
                let a = step * (this.maximumLifeTime - this.currentLifeTime);
                this.setAlpha(a);
            }
            else {
                this.setAlpha(this.maximumAlpha);
            }
        }
        else {
            this.alive = false;
        }
    }

    private setAlpha(a: number) {
        if ((<Line>this.shape).style) {
            (<Line>this.shape).style.alpha = a;
        }
        else {
            (<Circle | Rectangle>this.shape).color.alpha = a;
        }
    }
}
