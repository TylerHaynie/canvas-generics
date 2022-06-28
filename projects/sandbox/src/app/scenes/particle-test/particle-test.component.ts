import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  CanvasWrapper, RandomUtility, ColorUtility,
  QuadTree, FadableParticle, Vector2D, Boundary,
  MOUSE_EVENT_TYPE, MouseData, Color, Rectangle, Size,
  GradientUtility, Bounds, Velocity, QuadVector
} from 'canvas-elements';
import { IDrawable } from 'projects/canvas-elements/src/lib/canvas/models/interfaces/idrawable';
import { ITickable } from 'projects/canvas-elements/src/lib/canvas/models/interfaces/itickable';

@Component({
  selector: 'app-particle-test',
  templateUrl: './particle-test.component.html',
  styleUrls: ['./particle-test.component.css']
})
export class ParticleTestComponent implements AfterViewInit, ITickable {
  @ViewChild('c') canvasRef: ElementRef;
  //#region Variables

  private _cw: CanvasWrapper;
  private _foregroundGradient: CanvasGradient;
  private _random: RandomUtility = new RandomUtility();
  private _color: ColorUtility = new ColorUtility;

  private debugParticles = false;

  // quads
  private particleQuad: QuadTree;

  // particles
  private floatingParticles: FadableParticle[] = [];

  //#endregion

  //#region Configuration

  // pointer
  private pointerRadius = 40;

  // background and foreground
  private backgroundColor: string = '#0e1123';
  private foregroundColorStartColor: string = 'rgba(12, 16, 30, 0.000)';
  private foregroundColorEndColor: string = 'rgba(0, 0, 0, 0.750)';
  private foregroundStart1: number = .250; // where the top gradient starts
  private foregroundEnd1: number = 0.000; // where the top gradient ends
  private foregroundStart2: number = .750; // where the bottom gradient starts
  private foregroundEnd2: number = 1.000; // where the bottom gradient ends

  // particles
  private maxParticles: number = 3000; // play with the amount
  private colorArray: string[] = ['#3E4F6A', '#74FFE8', '#5FBEBC'];
  private particleSpeedModifier: number = .5;
  private particleCornerRadius: number = 1.5; // check code below for optimization when using this on a large scale
  private particleMaxRadius: number = 4.25;
  private particleMinRadius: number = 0.15;
  private maxParticleLifespan: number = 425;
  private minParticleLifespan: number = 175;
  private particleFadeTime: number = 100;

  private maxOpacity: number = .35;
  private particleHighlightColor: string = '#ff2dd4';

  // mouse
  private mouseOnCanvas: boolean = false;
  // private mousePosition: Vector2D;

  //#endregion

  //#region Init

  constructor() { }

  ngAfterViewInit() {
    this._cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'));
    this._cw.panZoomManager.minScale = 1;
    this._cw.panZoomManager.panningAllowed = false;
    this._cw.panZoomManager.scalingAllowed = false;
    this._cw.enableGrid = false;
    this._cw.trackMouse = false;
    this._cw.renderManager.debugEnabled = true;

    this.registerEvents();

    // set up quad trees
    // TODO: boundary needs to be updated with window resize
    let boundary: Boundary = new Boundary(0, 0, 0, this._cw.width, this._cw.height, 0);
    this.particleQuad = new QuadTree(boundary, 1);

    this._foregroundGradient = this.createGradient();

    // register parts
    this._cw.addToDraw(this.createBackground());
    this._cw.addToTick(this);

    // start the draw loop
    this._cw.start();
  }

  private registerEvents() {
    this._cw.mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e: MouseData) => {
      this.mouseOnCanvas = true;
    });

    this._cw.mouseManager.on(MOUSE_EVENT_TYPE.OUT, (e: MouseData) => {
      this.mouseOnCanvas = false;
    });
  }

  //#endregion

  //#region Drawing

  // draw(context: CanvasRenderingContext2D) {
  //   // context.save();

  //   // this.drawBackground();
  //   // this.drawParticles();
  //   // // this.drawForeground();

  //   // // debug
  //   // if (this.debugParticles) {
  //   //   this.particleQuad.debugQuad(context);
  //   // }

  //   // context.restore();
  // }

  tick(delta: number) {

    // do some hover stuff
    this.checkParticleHover(); // TODO: put in update()

    // update and draw particles
    this.updateParticles(); // TODO: put in update()
  }

  private createBackground() {
    let p = new Vector2D(0, 0);
    let b = new Rectangle(p);
    b.size.setSize(this._cw.width, this._cw.height);
    b.color.setShade(this.backgroundColor);

    // b.draw(this._cw.drawingContext);
   return b;
  }

  private drawForeground() {
    // let bounds = this._cw.bounds;

    let p = new Vector2D(0, 0);
    let f = new Rectangle(p);
    f.size.setSize(this._cw.width, this._cw.height);
    f.color.setShade(this._foregroundGradient);

    // f.draw(this._cw.drawingContext);
    this._cw.addToDraw(f);
  }

  private drawParticles() {
    this.floatingParticles.forEach(particle => {
      particle.draw(this._cw.drawingContext);
    });
  }

  private createGradient(): CanvasGradient {
    let gradUtil = new GradientUtility(this._cw.drawingContext);
    // Create gradient
    let grd = gradUtil.createLinearGradient(this._cw.height / 2, 0.000, this._cw.height / 2, this._cw.height);

    // Top Color
    grd.addColorStop(this.foregroundEnd1, this.foregroundColorEndColor);
    grd.addColorStop(this.foregroundStart1, this.foregroundColorStartColor);

    // bottom color
    grd.addColorStop(this.foregroundStart2, this.foregroundColorStartColor);
    grd.addColorStop(this.foregroundEnd2, this.foregroundColorEndColor);

    return grd;
  }

  private updateParticles() {
    // replace particles that have died off
    if (this.floatingParticles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    this.updateFloatingParticle(this.floatingParticles, this.particleQuad);
  }

  private updateFloatingParticle(particles: FadableParticle[], trackingTree: QuadTree = undefined) {
    if (trackingTree) {
      // clear the quad
      trackingTree.reset(this._cw.width, this._cw.height);
    }

    let bp = new Vector2D(0, 0);
    let bs = new Size(this._cw.width, this._cw.height);
    let particleBounds = new Bounds(bp, bs);

    for (let x = particles.length - 1; x >= 0; x--) {
      let particle = particles[x];

      if (particle.isAlive) {
        // move particle
        particle.move(particleBounds);

        // update particle
        particle.tick();

        if (trackingTree) {
          // insert particle
          let pPosition = particle.getPosition();
          let qd = new QuadVector(pPosition.x, pPosition.y, 0, particle);
          trackingTree.insert(qd);
        }
      }
      else {
        // remove it
        particles.splice(x, 1);
        this._cw.removeFromDraw(particle);
      }
    }
  }

  //#endregion

  private generateMissingParticles() {

    for (let x = this.floatingParticles.length; x < this.maxParticles; x++) {

      let pLocation = new Vector2D(
        Math.fround(Math.random() * (this._cw.width - this.particleMaxRadius)),
        Math.fround(Math.random() * (this._cw.height - this.particleMaxRadius))
      );

      let rect = new Rectangle(pLocation);
      let rad = this._random.randomNumberBetween(this.particleMinRadius, this.particleMaxRadius);

      // if they are too small we can skip the corners. corner calculations are expensive
      if (rad > 3) {
        rect.endGap = this.particleCornerRadius;
      }

      rect.size.setSize(Math.fround(rad * 2), rad * Math.fround(2));
      rect.color.setShade(this._color.randomColorFromArray(this.colorArray));
      // rect.color.setShade(this._color.randomColor());

      let v = new Velocity(
        this._random.randomWithNegative() * this.particleSpeedModifier * this._random.randomNumberBetween(.20, .80),
        this._random.randomWithNegative() * this.particleSpeedModifier * this._random.randomNumberBetween(.20, .80)
      );

      let fp = new FadableParticle(rect, v);

      fp.maximumLifeTime = this._random.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan);
      fp.currentLifeTime = 0;
      fp.maximumAlpha = this._random.randomNumberBetween(0, this.maxOpacity * 100) / 100;
      fp.fadeSpan = this.particleFadeTime;

      this.floatingParticles.push(fp);
      this._cw.addToDraw(fp);
    }
  }

  private checkParticleHover() {
    if (this.mouseOnCanvas) {
      // current mouse location
      let mx = this._cw.mouseManager.mousePosition.x;
      let my = this._cw.mouseManager.mousePosition.y;

      // boundary around mouse
      let b: Boundary = new Boundary(mx - (this.pointerRadius / 2), my - (this.pointerRadius / 2), 0, this.pointerRadius, this.pointerRadius, 0);

      // check particles
      let particlesInRange: QuadVector[] = this.particleQuad.searchBoundary(b);

      // update particles in range
      if (particlesInRange.length > 0) {
        particlesInRange.forEach(p => {
          let fp = <FadableParticle>(p.data);
          fp.maximumAlpha = 1;
          fp.setColor(new Color(this.particleHighlightColor));
        });
      }
    }

  }

}
