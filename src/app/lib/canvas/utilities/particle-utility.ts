import { iParticle } from '../interfaces/iParticle';
import { RandomUtility } from './random-utility';

export class ParticleUtility {
    private randomUtil: RandomUtility;

    constructor() {
        this.randomUtil = new RandomUtility();
    }

    moveParticles(bounds: ClientRect | DOMRect, particles: iParticle[]) {
        particles.forEach(p => {
            let posX = p.point.x + Math.random() * 5;
            let posY = p.point.y + Math.random() * 5;

            // reverse x direction
            if (posX + p.radius >= bounds.right) {
                p.speed.vx = -p.speed.vx;
            }
            else if (posX <= bounds.left) {
                p.speed.vx = Math.abs(p.speed.vx);
            }

            // reverse y direction
            if (posY + p.radius >= bounds.bottom) {
                p.speed.vy = -p.speed.vy;
            }
            else if (posY <= bounds.top) {
                p.speed.vy = Math.abs(p.speed.vy);
            }

            // update point with speed
            p.point.x = p.point.x + p.speed.vx;
            p.point.y = p.point.y + p.speed.vy;
        });
    }

    wiggleParticles(particles: iParticle[]) {
        particles.forEach(p => {
            p.point.x = p.point.x + this.randomUtil.randomWithNegative();
            p.point.y = p.point.y + this.randomUtil.randomWithNegative();
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
