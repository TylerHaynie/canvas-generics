import { iParticle } from '../interfaces/iParticle';
import { RandomUtility } from './random-utility';

export class ParticleUtility {
    private randomUtil: RandomUtility;

    constructor() {
        this.randomUtil = new RandomUtility();
    }

    moveParticles(bounds: {x: number, y: number, w: number, h: number}, particles: iParticle[]) {
        particles.forEach(p => {
            let posX = p.vector.x + Math.random() * 5;
            let posY = p.vector.y + Math.random() * 5;

            // reverse x direction
            if (posX + p.radius >= bounds.w) {
                p.speed.vx = -p.speed.vx;
            }
            else if (posX <= bounds.x) {
                p.speed.vx = Math.abs(p.speed.vx);
            }

            // reverse y direction
            if (posY + p.radius >= bounds.h) {
                p.speed.vy = -p.speed.vy;
            }
            else if (posY <= bounds.y) {
                p.speed.vy = Math.abs(p.speed.vy);
            }

            // update vector with speed
            p.vector.x = p.vector.x + p.speed.vx;
            p.vector.y = p.vector.y + p.speed.vy;
        });
    }

    wiggleParticles(particles: iParticle[]) {
        particles.forEach(p => {
            p.vector.x = p.vector.x + this.randomUtil.randomWithNegative();
            p.vector.y = p.vector.y + this.randomUtil.randomWithNegative();
        });
    }

    particleFader(fadeTime: number, particles: iParticle[]) {
        for (let x = particles.length - 1; x > 0; x--) {
            let p = particles[x];

            // add to lifetime
            p.currentLifeTime += 1;

            if (p.currentLifeTime < p.maximumLifeTime) {

                // fade in particle
                if (p.currentLifeTime <= fadeTime) {
                    let step = p.color.alpha / fadeTime;
                    p.color.modifiedAlpha = (step * p.currentLifeTime);
                }

                // fade out particle
                else if (p.maximumLifeTime - p.currentLifeTime <= fadeTime) {
                    let step = p.color.alpha / fadeTime;
                    p.color.modifiedAlpha = step * (p.maximumLifeTime - p.currentLifeTime);
                }
                else{
                    p.color.modifiedAlpha = p.color.alpha;
                }
            }
            else {
                // if the particle is too old we remove it
                particles.splice(x, 1);
            }
        }
    }
}
