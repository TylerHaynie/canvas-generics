import { ParticleBase } from '@canvas/particles/particle-base';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Velocity } from '@canvas/models/velocity';
import { Circle } from '@canvas/shapes/circle';

export class FadableParticle extends ParticleBase {

    maximumAlpha: number = 1;
    currentLifeTime: number = 0;
    maximumLifeTime: number = 30;
    fadeSpan: number = 10;

    constructor(shape: Rectangle, v: Velocity) {
        super(shape, v);
    }

    tick() {
        if (this.currentLifeTime < this.maximumLifeTime) {
            let step = this.maximumAlpha / this.fadeSpan;
            let a = this.maximumAlpha;

            // fade in particle
            if (this.currentLifeTime < this.fadeSpan) {
                a = (step * this.currentLifeTime);
            }
            // fade out particle
            else if (this.currentLifeTime > this.maximumLifeTime - this.fadeSpan) {
                a = step * (this.maximumLifeTime - this.currentLifeTime);
            }

            this.setAlpha(a);
        }

        if (this.currentLifeTime > this.maximumLifeTime) {
            this.alive = false;
        }

        // add to lifetime
        this.currentLifeTime += 1;
    }

    private setAlpha(a: number) {
        this.shape.color.alpha = a;
    }

}
