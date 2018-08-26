"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const particle_base_1 = require("canvas/objects/particles/particle-base");
class FadableParticle extends particle_base_1.ParticleBase {
    constructor(shape, v) {
        super(shape, v);
        this.maximumAlpha = 1;
        this.currentLifeTime = 0;
        this.maximumLifeTime = 30;
        this.fadeSpan = 10;
    }
    tick() {
        this.currentLifeTime += 1;
        if (this.currentLifeTime < this.maximumLifeTime) {
            if (this.currentLifeTime <= this.fadeSpan) {
                let step = this.maximumAlpha / this.fadeSpan;
                let a = (step * this.currentLifeTime);
                this.setAlpha(a);
            }
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
    setAlpha(a) {
        this.shape.color.alpha = a;
    }
}
exports.FadableParticle = FadableParticle;
//# sourceMappingURL=fadable-particle.js.map