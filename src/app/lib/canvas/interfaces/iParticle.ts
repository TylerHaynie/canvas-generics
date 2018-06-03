import { iSpeed } from './iSpeed';
import { iShadow } from './iShadow';
import { iColor } from './iColor';
import { iVector } from './iVector';

export interface iParticle extends iSpeed {
    vector: iVector;
    radius: number;
    color: iColor;

    currentLifeTime: number;
    maximumLifeTime: number;

    speed?: iSpeed;
    outlineWidth?: number;
    outlineColor?: iColor;
    shadow?: iShadow;
}
