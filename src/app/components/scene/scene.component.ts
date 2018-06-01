import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PanZoom } from '../../lib/canvas/pan-zoom';
import { QuadTree, Boundry, QuadPoint } from '../../lib/quadtree/quad-tree';
import { Utils } from '../../lib/canvas/utils';
import { iPoint } from '../../lib/canvas/iPoint';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class sceneComponent implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  //#region Variables

  private context: CanvasRenderingContext2D;
  private panZoom: PanZoom;
  private utils: Utils;
  private paused = false;
  private frameStep: boolean = false;
  private debugParticles = false;
  private debugPoints = false;

  // point
  private points: iPoint[] = [];

  // quads
  private particleQuad: QuadTree;
  private pointQuad: QuadTree;

  // particles
  private particles: iPoint[] = [];

  //#endregion

  //#region Configuration

  // Pointer
  private pointerRadius: number = 55;

  // points
  private pointCount = 50;
  private pointSize = 12;
  private pointSpeedModifier = .2;
  private pointType: string = 'square';
  private pointDefaultBackground: string = '#000';
  private pointHoverBackground: string = '#333';
  private pointOutline: string = '#49d3ff';
  private pointShadowColor = '#49d3ff';
  private pointShadowBlur = 6;
  private pointHighlightColor = '#d121ad';

  // connecting lines
  private lineColor: string = '#3d6a89';
  private lineWidth: number = .25;

  // particles
  private maxParticles: number = 4900;
  private colorArray: string[] = ['#5799e0', '#5689e0', '#165572'];
  private particleSpeedModifier: number = .18;
  private particleMaxRadius: number = 4.25;
  private particleminRadius: number = .15;
  private maxParticleLifespan: number = 330;
  private minParticleLifespan: number = 175;
  private particleFadeTime: number = 85;

  private maxOpacity: number = .70;
  private particleHighlightColor: string = '#ff2dd4';

  //#endregion

  //#region Init

  constructor() { }

  ngOnInit() {
    this.context = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');
    this.utils = new Utils();

    // setup pan and zoom
    this.panZoom = new PanZoom(this.context);
    this.panZoom.panningAllowed = false;
    this.panZoom.minScale = 1.0;

    // set up quad trees
    let boundry: Boundry = new Boundry(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.particleQuad = new QuadTree(boundry, 1);
    this.pointQuad = new QuadTree(boundry, 1);

    this.generatePoints();
    this.registerEvents();
    this.draw();
  }

  registerEvents() {
    this.context.canvas.onkeydown = (e: KeyboardEvent) => {

      if (e.key === 'p' || e.key === 'P') {
        this.paused = !this.paused;
        if (this.paused) {
          this.debugSnap();
        }
      }

      if (e.key === '>' || e.key === '.') {
        this.frameStep = !this.frameStep;
        if (this.frameStep) {
          this.debugSnap();
        }
      }
    };
  }

  //#endregion

  //#region Generation

  generateMissingParticles() {
    for (let x = this.particles.length - 1; x < this.maxParticles; x++) {
      let p = <iPoint>{
        x: Math.random() * (this.context.canvas.width - this.particleMaxRadius),
        y: Math.random() * (this.context.canvas.height - this.particleMaxRadius),
        r: this.utils.randomNumberBetween(this.particleminRadius, this.particleMaxRadius),
        vx: this.utils.randomWithNegative() * this.particleSpeedModifier,
        vy: this.utils.randomWithNegative() * this.particleSpeedModifier,
        color: this.utils.randomColorFromArray(this.colorArray),
        alpha: this.utils.randomNumberBetween(1, this.maxOpacity * 100) / 100,
        lifespan: this.utils.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan),
        lifetime: 0
      };

      this.particles.push(p);
    }
  }

  generatePoints() {
    for (let x = 0; x < this.pointCount; x++) {
      let s = <iPoint>{
        x: Math.random() * (this.context.canvas.width - this.pointSize),
        y: Math.random() * (this.context.canvas.height - this.pointSize),
        r: this.pointSize,
        vx: this.utils.randomWithNegative() * this.pointSpeedModifier,
        vy: this.utils.randomWithNegative() * this.pointSpeedModifier,
        color: this.pointDefaultBackground,
        lineColor: this.pointOutline,
        lineWidth: .25,
        shadowColor: this.pointShadowColor,
        shadowBlur: this.pointShadowBlur,
        alpha: 1
      };

      this.points.push(s);
    }
  }

  //#endregion

  //#region Interaction

  checkMouseHover() {
    let mx = this.panZoom.pointerX;
    let my = this.panZoom.pointerY;

    // debug pointer
    // this.context.fillRect(mx - (this.pointerRadius / 2), my - (this.pointerRadius / 2), this.pointerRadius, this.pointerRadius);
    let b: Boundry = new Boundry(mx - (this.pointerRadius / 2), my - (this.pointerRadius / 2), this.pointerRadius, this.pointerRadius);

    // check points
    let pointsInRange: QuadPoint[] = this.pointQuad.queryBoundry(b);

    if (pointsInRange.length > 0) {
      pointsInRange.forEach(p => {
        let ip = <iPoint>(p.data);
        ip.alpha = 1;
        ip.color = this.pointHighlightColor;
      });
    }

    // check particles
    let particlesInRange: QuadPoint[] = this.particleQuad.queryBoundry(b);

    if (particlesInRange.length > 0) {
      particlesInRange.forEach(p => {
        let ip = <iPoint>(p.data);
        ip.alpha = 1;
        ip.color = this.particleHighlightColor;
      });
    }
  }

  //#endregion

  //#region Drawing

  draw() {
    if (!this.paused || this.frameStep) {
      this.context.save();
      // clear before doing anything
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.drawBackground();

      // TODO: this needs to change
      this.panZoom.update();

      // update and draw particles
      this.drawParticles();

      // draw connecting lines under points
      this.drawConnectingLines();

      // // update and draw main points
      this.drawpoints();
      // this.updatePointsQuad();

      // do some hover stuff
      if (!this.panZoom.pointerOffCanvas) {
        this.checkMouseHover();
      }

      // drawing the graident on the top
      this.drawForeground();

      // debug
      if (this.debugParticles) {
        this.context.save();
        this.particleQuad.debugQuad(this.context, '#777');
        this.context.restore();
      }

      if (this.debugPoints) {
        this.context.save();
        this.pointQuad.debugQuad(this.context, '#c60000');
        this.context.restore();
      }

      this.context.restore();
      this.frameStep = false;
    }
    requestAnimationFrame(() => this.draw());
  }

  drawBackground() {
    let bounds = this.context.canvas.getBoundingClientRect();
    this.context.fillStyle = '#000';
    this.context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
  }

  drawForeground() {
    let bounds = this.context.canvas.getBoundingClientRect();

    // Create gradient
    let grd = this.context.createLinearGradient(bounds.height / 2, 0.000, bounds.height / 2, bounds.height);

    // Add colors
    grd.addColorStop(0.000, 'rgba(0, 0, 0, 0.700)');
    grd.addColorStop(0.10, 'rgba(0, 0, 0, 0.000)');

    grd.addColorStop(0.90, 'rgba(0, 0, 0, 0.000)');
    grd.addColorStop(1.000, 'rgba(0, 0, 0, 0.700)');

    // Fill with gradient
    this.context.fillStyle = grd;
    this.context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
  }

  drawParticles() {
    if (this.particles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    // clear the quad
    this.particleQuad.clear(this.context.canvas.width, this.context.canvas.height);

    this.utils.movepoints(this.context.canvas.getBoundingClientRect(), this.particles);

    for (let x = this.particles.length - 1; x > 0; x--) {
      let p = this.particles[x];
      if (p.lifetime < p.lifespan) {
        if (p.lifetime < this.particleFadeTime) {
          let step = p.alpha / this.particleFadeTime;

          this.utils.drawCircle(this.context, p.x, p.y, p.r, p.color, (step * p.lifetime));
        }
        else if (p.lifespan - p.lifetime < this.particleFadeTime) {
          let step = p.alpha / this.particleFadeTime;
          this.utils.drawCircle(this.context, p.x, p.y, p.r, p.color, step * (p.lifespan - p.lifetime));
        }
        else {
          this.utils.drawCircle(this.context, p.x, p.y, p.r, p.color, p.alpha);
        }

        p.lifetime += 1;
      }
      else {
        this.particles.splice(x, 1);
      }

      // add updated point to quad
      this.particleQuad.insert({ x: p.x, y: p.y, data: p });
    }
  }

  drawpoints() {
    // clear the quad
    this.pointQuad.clear(this.context.canvas.width, this.context.canvas.height);

    // update point locations
    this.utils.movepoints(this.context.canvas.getBoundingClientRect(), this.points);

    this.points.forEach(p => {
      if (this.pointType === 'circle') {
        this.utils.drawCircle(
          this.context,
          p.x + (this.pointSize / 2),
          p.y + (this.pointSize / 2),
          p.r,
          p.color,
          p.alpha,
          p.lineWidth,
          p.lineColor
        );
      }
      else if (this.pointType === 'square') {
        this.utils.drawRectangle(
          this.context,
          p.x,
          p.y,
          p.r * Math.PI / 2,
          p.r * Math.PI / 2,
          p.color,
          p.alpha,
          p.lineWidth,
          p.lineColor,
          p.shadowBlur,
          p.shadowColor);
      }

      // add updated point to quad
      this.pointQuad.insert({ x: p.x, y: p.y, data: p });
    });

  }

  drawConnectingLines() {
    this.context.save();

    this.context.strokeStyle = this.lineColor;
    this.context.lineWidth = this.lineWidth;

    this.context.beginPath();
    for (let x = 0; x < this.points.length; x++) {
      // this square
      let s = this.points[x];
      // next square
      let ns = this.points[x + 1];

      if (ns) {
        this.context.moveTo(s.x + s.r / 2, s.y + s.r / 2);
        this.context.lineTo(ns.x + ns.r / 2, ns.y + ns.r / 2);
      }
      else {
        // connect back to the first
        let fp = this.points[0];
        this.context.moveTo(s.x + s.r / 2, s.y + s.r / 2);
        this.context.lineTo(fp.x + fp.r / 2, fp.y + fp.r / 2);
      }

    }
    this.context.stroke();
    this.context.restore();
  }

  //#endregion

  //#region debug
  private debugSnap() {
    console.log(this.particleQuad);
    console.log(this.pointQuad);
  }
  //#endregion
}
