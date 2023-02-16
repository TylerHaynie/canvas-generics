import { ITickable } from '../../models/interfaces/itickable';
import { Velocity } from '../../models/velocity';
import { Rectangle } from '../../shapes/rectangle';
import { ParticleBase } from './particle-base';

export class FadableParticle extends ParticleBase implements ITickable {
    maximumAlpha: number = 1;
    currentLifeTime: number = 0;
    maximumLifeTime: number = 30;
    fadeSpan: number = 10;

    constructor(shape: Rectangle, v: Velocity) {
        super(shape, v);
    }

    tick(delta: number) {
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

            this.shape.color.setAlpha(a);
        }

        if (this.currentLifeTime > this.maximumLifeTime) {
            this.alive = false;
        }

        // add to lifetime
        this.currentLifeTime += delta;
    }
}
