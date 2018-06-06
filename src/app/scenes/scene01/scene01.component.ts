import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuadTree, Boundary, QuadVector } from '../../lib/quadtree/quad-tree';
import { CanvasWrapper } from '../../lib/canvas/canvas-wrapper';
import { RandomUtility } from '../../lib/canvas/utilities/random-utility';
import { ColorUtility } from '../../lib/canvas/utilities/color-utility';
import { Particle } from '../../lib/canvas/objects/particle';
import { Rectangle } from '../../lib/canvas/shapes/rectangle';
import { Bounds } from '../../lib/canvas/objects/bounds';
import { FloatingParticle } from './objects/floating-particle';
import { Circle } from '../../lib/canvas/shapes/circle';
import { Color } from '../../lib/canvas/models/color';
import { Velocity } from '../../lib/canvas/models/velocity';
import { Vector } from '../../lib/canvas/objects/vector';
import { Size } from '../../lib/canvas/models/size';
import { Line } from '../../lib/canvas/shapes/line/line';
import { LineStyle } from '../../lib/canvas/models/line-style';
import { Shadow } from '../../lib/canvas/models/shadow';
import { MouseData } from '../../lib/canvas/managers/mouse/mouse-data';
import { MouseEventType } from '../../lib/canvas/events/canvas-event-types';

@Component({
  selector: 'app-scene01',
  templateUrl: './scene01.component.html',
  styleUrls: ['./scene01.component.css']
})
export class scene01Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  //#region Variables

  private cw: CanvasWrapper;

  private debugParticles = false;

  // points-of-interest
  private pointsOfIntrest: FloatingParticle[] = [];

  // quads
  private particleQuad: QuadTree;

  // particles
  private floatingParticles: FloatingParticle[] = [];

  //#endregion

  //#region Configuration

  // pointer
  private pointerRadius = 55;

  // background and foreground
  private backgroundColor: string = '#0C101E';
  private foregroundColorStartColor: string = 'rgba(12, 16, 30, 0.000)';
  private foregroundColorEndColor: string = 'rgba(0, 0, 0, 0.750)';
  private foregroundStart1: number = .250; // where the top graident starts
  private foregroundEnd1: number = 0.000; // where the top graident ends
  private foregroundStart2: number = .750; // where the bottom graident starts
  private foregroundEnd2: number = 1.000; // where the bottom graident ends

  // particles
  private maxParticles: number = 6000;
  private colorArray: string[] = ['#165572', '#87DAFF', '#33447E'];
  private particleSpeedModifier: number = .05;
  private particleMaxRadius: number = 4.25;
  private particleMinRadius: number = .15;
  private maxParticleLifespan: number = 325;
  private minParticleLifespan: number = 175;
  private particleFadeTime: number = 100;

  private maxOpacity: number = .75;
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
    this.cw.panZoomManager.panningAllowed = true;
    this.cw.enableGrid = false;
    this.cw.trackMouse = false;

    this.registerEvents();

    // set up quad trees
    let boundary: Boundary = new Boundary(0, 0, this.cw.width, this.cw.height);
    this.particleQuad = new QuadTree(boundary, 1);

    // start the draw loop
    this.cw.start();
  }

  private registerEvents() {
    this.cw.mouseManager.on(MouseEventType.MOVE, (e: MouseData) => {
      this.mouseOnCanvas = true;
      this.mousePosition = e.translatedPosition ? e.translatedPosition : e.mousePosition;
    });


    this.cw.mouseManager.on(MouseEventType.OUT, (e: MouseData) => {
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

    // drawing the graident on the top
    this.drawForeground();

    // debug
    if (this.debugParticles) {
      this.particleQuad.debugQuad(this.cw.drawingContext, '#777');
    }

    this.cw.restoreContext();
  }

  private drawBackground() {
    let bounds = this.cw.bounds;
    let b = new Rectangle(this.cw.drawingContext);

    b.position = new Vector(bounds.left, bounds.top);
    b.size = new Size(bounds.width, bounds.height);
    b.color = new Color(this.backgroundColor);

    b.draw();
  }

  private drawForeground() {
    let bounds = this.cw.bounds;

    // Create gradient
    let grd = this.cw.graident.createLinearGradient(bounds.height / 2, 0.000, bounds.height / 2, bounds.height);

    // Top Color
    grd.addColorStop(this.foregroundEnd1, this.foregroundColorEndColor);
    grd.addColorStop(this.foregroundStart1, this.foregroundColorStartColor);

    // bottom color
    grd.addColorStop(this.foregroundStart2, this.foregroundColorStartColor);
    grd.addColorStop(this.foregroundEnd2, this.foregroundColorEndColor);

    let f = new Rectangle(this.cw.drawingContext);
    f.position = new Vector(bounds.left, bounds.top);
    f.size = new Size(bounds.width, bounds.height);
    f.color = new Color(grd);

    f.draw();
  }

  private drawParticles() {
    // replace particles that have died off
    if (this.floatingParticles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    this.drawFloatingParticle(this.floatingParticles, this.particleQuad);
  }

  private drawFloatingParticle(particles: FloatingParticle[], trackingTree: QuadTree = undefined) {
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
        fp.update();

        if (trackingTree) {
          // insert particle
          trackingTree.insert({ x: fp.particle.position.x, y: fp.particle.position.y, data: fp });
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

      let pLocation = new Vector(Math.random() * (this.cw.width - this.particleMaxRadius), Math.random() * (this.cw.height - this.particleMaxRadius));
      let p = new Particle(pLocation);

      p.velocity = new Velocity(
        this.cw.random.randomWithNegative() * this.particleSpeedModifier,
        this.cw.random.randomWithNegative() * this.particleSpeedModifier
      );

      let r = new Rectangle(this.cw.drawingContext);
      r.position = p.position;
      let rad = this.cw.random.randomNumberBetween(this.particleMinRadius, this.particleMaxRadius);
      r.size = new Size(rad * 2, rad * 2);
      r.color = new Color(this.cw.color.randomColorFromArray(this.colorArray));

      let fp = new FloatingParticle(this.cw.drawingContext, pLocation, p, r);
      fp.maximumLifeTime = this.cw.random.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan);
      fp.currentLifeTime = 0;
      fp.fadeable = true;
      fp.maximumAlpha = this.cw.random.randomNumberBetween(1, this.maxOpacity * 100) / 100;
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
          let fp = <FloatingParticle>(p.data);
          fp.maximumAlpha = 1;
          fp.floatingObject.color.shade = this.particleHighlightColor;
        });
      }
    }

  }

  //#endregion

}
