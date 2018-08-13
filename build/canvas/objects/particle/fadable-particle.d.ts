import { ParticleBase } from 'canvas/objects/particle/particle-base';
import { Rectangle } from 'canvas/shapes/rectangle';
import { Velocity } from 'canvas/models/velocity';
export declare class FadableParticle extends ParticleBase {
    maximumAlpha: number;
    currentLifeTime: number;
    maximumLifeTime: number;
    fadeSpan: number;
    constructor(shape: Rectangle, v: Velocity);
    tick(): void;
    private setAlpha;
}
//# sourceMappingURL=fadable-particle.d.ts.map