import { Rectangle } from '@canvas/shapes/rectangle';
import { Circle } from '@canvas/shapes/circle';
import { Line } from '@canvas/shapes/line/line';
import { Vector } from '@canvas/objects/vector';
import { ParticleBase } from '@canvas/objects/particle/particle-base';
import { Color } from '@canvas/models/color';
import { Velocity } from '@canvas/models/velocity';

export class FadableParticle extends ParticleBase {

    maximumAlpha: number = 1;
    currentLifeTime: number = 0;
    maximumLifeTime: number = 30;
    fadeSpan: number = 10;

    constructor(shape: Rectangle, v: Velocity) {
        super(shape, v);
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
        (<Circle | Rectangle>this.shape).color.alpha = a;
    }

}
