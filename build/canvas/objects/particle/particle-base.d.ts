import { Velocity } from 'canvas/models/velocity';
import { Rectangle } from 'canvas/shapes/rectangle';
import { Circle } from 'canvas/shapes/circle';
import { Vector2D } from 'canvas/objects/vector';
import { Color } from 'canvas/models/color';
import { Size } from 'canvas/models/size';
import { Bounds } from 'canvas/objects/bounds';
export declare class ParticleBase {
    private velocity;
    protected shape: Rectangle | Circle;
    protected alive: boolean;
    readonly isAlive: boolean;
    private randomUtil;
    constructor(shape: Rectangle | Circle, v: Velocity);
    setPosition(p: Vector2D): void;
    getPosition(): Vector2D;
    changeColor(color: Color): void;
    setVelocity(v: Velocity): void;
    changeSize(sr: Size | number): void;
    getSize(): Size;
    move(bounds: Bounds): void;
    wiggle(): void;
    draw(): void;
}
//# sourceMappingURL=particle-base.d.ts.map