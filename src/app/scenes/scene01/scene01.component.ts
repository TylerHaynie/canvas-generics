import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { Vector } from '@canvas/objects/vector';
import { MOUSE_EVENT_TYPE } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Size } from '@canvas/models/size';
import { Color } from '@canvas/models/color';
import { Bounds } from '@canvas/objects/bounds';
import { ParticleBase } from '@canvas/objects/particle/particle-base';
import { Velocity } from '@canvas/models/velocity';
import { QuadTree, Boundary, QuadVector } from '@quadtree/quad-tree';
import { GradientUtility } from '@canvas/utilities/gradient-utility';
import { RandomUtility } from '@canvas/utilities/random-utility';
import { ColorUtility } from '@canvas/utilities/color-utility';
import { FadableParticle } from '@canvas/objects/particle/fadable-particle';

@Component({
  selector: 'app-scene01',
  templateUrl: './scene01.component.html',
  styleUrls: ['./scene01.component.css']
})
export class scene01Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  //#region Variables

  private cw: CanvasWrapper;
  private _foregroundGradient: CanvasGradient;
  private _random: RandomUtility = new RandomUtility();
  private _color: ColorUtility = new ColorUtility;

  private debugParticles = false;

  // points-of-interest
  // private pointsOfIntrest: FloatingParticle[] = [];

  // quads
  private particleQuad: QuadTree;

  // particles
  private floatingParticles: FadableParticle[] = [];

  //#endregion

  //#region Configuration

  // pointer
  private pointerRadius = 55;

  // background and foreground
  private backgroundColor: string = '#0C101E';
  private foregroundColorStartColor: string = 'rgba(12, 16, 30, 0.000)';
  private foregroundColorEndColor: string = 'rgba(0, 0, 0, 0.750)';
  private foregroundStart1: number = .250; // where the top gradient starts
  private foregroundEnd1: number = 0.000; // where the top gradient ends
  private foregroundStart2: number = .750; // where the bottom gradient starts
  private foregroundEnd2: number = 1.000; // where the bottom gradient ends

  // particles
  private maxParticles: number = 4500; // play with the amount
  private colorArray: string[] = ['#165572', '#87DAFF', '#33447E'];
  private particleSpeedModifier: number = .05;
  private particleCornerRadius: number = 2; // check code below for optimization when using this on a large scale
  private particleMaxRadius: number = 4.25;
  private particleMinRadius: number = 0.15;
  private maxParticleLifespan: number = 325;
  private minParticleLifespan: number = 175;
  private particleFadeTime: number = 100;

  private maxOpacity: number = .35;
  private particleHighlightColor: string = '#ff2dd4';

  // mouse
  private mouseOnCanvas: boolean = false;
  private mousePosition: Vector;

  //#endregion

  //#region Init

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;
    this.cw.panZoomManager.scalingAllowed = false;
    this.cw.enableGrid = false;
    this.cw.trackMouse = false;

    this.registerEvents();


    // set up quad trees
    let boundary: Boundary = new Boundary(0, 0, this.cw.width, this.cw.height);
    this.particleQuad = new QuadTree(boundary, 1);
    this._foregroundGradient = this.createGradient();

    // start the draw loop
    this.cw.start();
  }

  private registerEvents() {
    this.cw.mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e: MouseData) => {
      this.mouseOnCanvas = true;
      this.mousePosition = e.translatedPosition ? e.translatedPosition : e.mousePosition;
    });


    this.cw.mouseManager.on(MOUSE_EVENT_TYPE.OUT, (e: MouseData) => {
      this.mouseOnCanvas = false;
    });
  }

  //#endregion

  //#region Drawing

  draw() {
    this.cw.saveContext();

    this.drawBackground();

    // do some hover stuff
    this.checkParticleHover();

    // update and draw particles
    this.drawParticles();

    // drawing the gradient on the top
    this.drawForeground();

    // debug
    if (this.debugParticles) {
      this.particleQuad.debugQuad(this.cw.drawingContext, '#777');
    }

    this.cw.restoreContext();
  }

  private drawBackground() {
    let bounds = this.cw.bounds;
    let p = new Vector(bounds.left, bounds.top);
    let b = new Rectangle(this.cw.drawingContext, p);
    b.size = new Size(bounds.width, bounds.height);
    b.color = new Color(this.backgroundColor);

    b.draw();
  }

  private drawForeground() {
    let bounds = this.cw.bounds;

    let p = new Vector(bounds.left, bounds.top);
    let f = new Rectangle(this.cw.drawingContext, p);
    f.size = new Size(bounds.width, bounds.height);
    f.color = new Color(this._foregroundGradient);

    f.draw();
  }

  private createGradient(): CanvasGradient {
    let bounds = this.cw.bounds;
    let gradUtil = new GradientUtility(this.cw.drawingContext);
    // Create gradient
    let grd = gradUtil.createLinearGradient(bounds.height / 2, 0.000, bounds.height / 2, bounds.height);

    // Top Color
    grd.addColorStop(this.foregroundEnd1, this.foregroundColorEndColor);
    grd.addColorStop(this.foregroundStart1, this.foregroundColorStartColor);

    // bottom color
    grd.addColorStop(this.foregroundStart2, this.foregroundColorStartColor);
    grd.addColorStop(this.foregroundEnd2, this.foregroundColorEndColor);

    return grd;
  }

  private drawParticles() {
    // replace particles that have died off
    if (this.floatingParticles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    this.drawFloatingParticle(this.floatingParticles, this.particleQuad);
  }

  private drawFloatingParticle(particles: FadableParticle[], trackingTree: QuadTree = undefined) {
    if (trackingTree) {
      // clear the quad
      trackingTree.reset(this.cw.width, this.cw.height);
    }

    let bp = new Vector(0, 0);
    let bs = new Size(this.cw.width, this.cw.height);
    let particleBounds = new Bounds(bp, bs);

    for (let x = particles.length - 1; x > 0; x--) {
      let fp = particles[x];

      if (fp.isAlive) {
        // move particle
        fp.move(particleBounds);

        // update particle
        fp.tick();

        if (trackingTree) {
          // insert particle
          let pPosition = fp.getPosition();
          trackingTree.insert({ x: pPosition.x, y: pPosition.y, data: fp });
        }

        // draw particle
        fp.draw();
      }
      else {
        // remove it
        particles.splice(x, 1);
      }
    }
  }

  //#endregion

  //#region Generation

  generateMissingParticles() {

    for (let x = this.floatingParticles.length; x < this.maxParticles; x++) {

      let pLocation = new Vector(
        Math.fround(Math.random() * (this.cw.width - this.particleMaxRadius)),
        Math.fround(Math.random() * (this.cw.height - this.particleMaxRadius))
      );

      let rect = new Rectangle(this.cw.drawingContext, pLocation);
      let rad = this._random.randomNumberBetween(this.particleMinRadius, this.particleMaxRadius);

      // if they are too small we can skip the corners. corner calculations are expensive
      if (rad > 3 && rad > 3) {
        rect.endGap = this.particleCornerRadius;
      }

      rect.size = new Size(Math.fround(rad * 2), rad * Math.fround(2));
      rect.color = new Color(this._color.randomColorFromArray(this.colorArray));

      let v = new Velocity(
        this._random.randomWithNegative() * this.particleSpeedModifier,
        this._random.randomWithNegative() * this.particleSpeedModifier
      );

      let fp = new FadableParticle(rect, v);

      fp.maximumLifeTime = this._random.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan);
      fp.currentLifeTime = 0;
      fp.maximumAlpha = this._random.randomNumberBetween(0, this.maxOpacity * 100) / 100;
      fp.fadeSpan = this.particleFadeTime;

      this.floatingParticles.push(fp);
    }
  }

  //#endregion

  //#region Interaction

  checkParticleHover() {
    if (this.mouseOnCanvas) {
      // current mouse location
      let mx = this.mousePosition.x;
      let my = this.mousePosition.y;

      // boundary around mouse
      let b: Boundary = new Boundary(mx - (this.pointerRadius / 2), my - (this.pointerRadius / 2), this.pointerRadius, this.pointerRadius);

      // check particles
      let particlesInRange: QuadVector[] = this.particleQuad.searchBoundary(b);

      // update particles in range
      if (particlesInRange.length > 0) {
        particlesInRange.forEach(p => {
          let fp = <FadableParticle>(p.data);
          fp.maximumAlpha = 1;
          fp.changeColor(new Color(this.particleHighlightColor));
        });
      }
    }

  }

  //#endregion

}
