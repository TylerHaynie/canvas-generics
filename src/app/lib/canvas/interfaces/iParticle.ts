import { iSpeed } from './iSpeed';
import { iShadow } from './iShadow';
import { iColor } from './iColor';
import { iPoint } from './iPoint';

export interface iParticle extends iSpeed {
    point: iPoint;
    radius: number;
    color: iColor;

    currentLifeTime: number;
    maximumLifeTime: number;

    speed?: iSpeed;
    outlineWidth?: number;
    outlineColor?: iColor;
    shadow?: iShadow;
}
