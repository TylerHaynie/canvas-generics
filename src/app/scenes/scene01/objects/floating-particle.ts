import { Particle } from '../../../lib/canvas/objects/particle';
import { Circle } from '../../../lib/canvas/shapes/circle';
import { Rectangle } from '../../../lib/canvas/shapes/rectangle';
import { Vector } from '../../../lib/canvas/objects/vector';
import { Bounds } from '../../../lib/canvas/objects/bounds';
import { Color } from '../../../lib/canvas/models/color';

export class FloatingParticle {

    // public properties
    public get position(): Vector { return this.pos; }
    public get floatingObject(): Rectangle | Circle { return this.object; }

    maximumAlpha: number = 1;
    currentLifeTime: number;
    maximumLifeTime: number;
    fadeSpan: number = 1;
    fadeable: boolean = false;

    private context: CanvasRenderingContext2D;
    private pos: Vector;

    private particle: Particle;
    private object: Circle | Rectangle;
    private modifiedAlpha: number;
    private alive: boolean = true;

    public get isAlive(): boolean { return this.alive; }

    constructor(context: CanvasRenderingContext2D, position: Vector, particle: Particle, floatingObject: Circle | Rectangle) {
        this.pos = position;
        this.context = context;
        this.particle = particle;
        this.object = floatingObject;

        this.particle.position = this.pos;
        this.object.position = this.pos;

        this.currentLifeTime = -1;
        this.maximumLifeTime = -1;
    }

    move(b: Bounds) {
        this.particle.move(b);
        this.pos = this.particle.position;
        this.object.position = this.particle.position;
    }

    changeColor(color: Color) {
        this.floatingObject.color = color;
    }

    update() {
        if (this.fadeable && (this.currentLifeTime > -1 && this.maximumLifeTime > -1)) {
            // add to lifetime
            this.currentLifeTime += 1;

            if (this.currentLifeTime < this.maximumLifeTime) {

                // fade in particle
                if (this.currentLifeTime <= this.fadeSpan) {
                    let step = this.maximumAlpha / this.fadeSpan;
                    this.object.color.alpha = (step * this.currentLifeTime);
                }

                // fade out particle
                else if (this.maximumLifeTime - this.currentLifeTime <= this.fadeSpan) {
                    let step = this.maximumAlpha / this.fadeSpan;
                    this.object.color.alpha = step * (this.maximumLifeTime - this.currentLifeTime);
                }
                else {
                    this.object.color.alpha = this.maximumAlpha;
                }
            }
            else {
                this.alive = false;
            }
        }
    }

    draw() {
        if (this.alive && this.object) {
            this.object.draw();
        }
    }
}
