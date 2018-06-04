import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuadTree, Boundry, QuadVector } from '../../lib/quadtree/quad-tree';
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

@Component({
  selector: 'app-scene01',
  templateUrl: './scene01.component.html',
  styleUrls: ['./scene01.component.css']
})
export class scene01Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  //#region Variables

  private cw: CanvasWrapper;
  private ctx: CanvasRenderingContext2D;

  // private panZoom: PanZoom;
  private debugParticles = false;
  private debugPointsOfIntrest = false;

  // points-of-interest
  private pointsOfIntrest: FloatingParticle[] = [];

  // quads
  private particleQuad: QuadTree;
  private pointsOfIntrestQuad: QuadTree;

  // particles
  private floatingParticles: FloatingParticle[] = [];

  //#endregion

  //#region Configuration

  // vectorer
  private vectorerRadius: number = 55;

  // background and foreground
  private backgroundColor: string = '#0C101E';
  private foregroundColorStartColor: string = 'rgba(12, 16, 30, 0.000)';
  private foregroundColorEndColor: string = 'rgba(0, 0, 0, 0.750)';
  private foregroundStart1: number = .250; // where the top graident starts
  private foregroundEnd1: number = 0.000; // where the top graident ends
  private foregroundStart2: number = .750; // where the bottom graident starts
  private foregroundEnd2: number = 1.000; // where the bottom graident ends

  // Points-of-Interest
  private poiCount = 20;
  private poiSize = 35;
  private poiSpeedModifier = 1;
  private connectToParticles: boolean = true;
  private connectorRadius = 80;
  private poiType: string = 'square'; // circle or square
  private poiDefaultBackground: string = '#0E1019'; // #0E1019
  private poiOutline: string = '#2D3047';
  private poiHoverBackground: string = '#0E1019';
  private poiShadowColor: string = '#2D3047';
  private poiShadowBlur = 6;
  private poiCollisionColor: string = '#A9353E';

  // connecting lines
  private lineWidth: number = .5;
  private lineAlpha: number = .18;
  private activeParticleColor = '#FF9B71';
  private lineColor: string = '#313947';

  // particles
  private maxParticles: number = 1000;
  private colorArray: string[] = ['#165572', '#87DAFF', '#33447E'];
  private particleSpeedModifier: number = .05;
  private particleMaxRadius: number = 4.25;
  private particleMinRadius: number = .15;
  private maxParticleLifespan: number = 325;
  private minParticleLifespan: number = 175;
  private particleFadeTime: number = 100;

  private maxOpacity: number = 1;
  private particleHighlightColor: string = '#ff2dd4';
  // private particleHighlightColor: string = '#5e5d52';

  //#endregion

  //#region Init

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.ctx = this.cw.drawingContext;

    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    // set up quad trees
    let boundry: Boundry = new Boundry(0, 0, this.cw.width, this.cw.height);
    this.particleQuad = new QuadTree(boundry, 1);
    this.pointsOfIntrestQuad = new QuadTree(boundry, 1);

    this.generatePointsOfIntrest();

    // start the draw loop
    this.cw.start();
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

    // draw connecting lines under vectors
    // this.drawConnectingLines();

    // update and draw main vectors
    // this.drawPointsOfIntrest();

    // drawing the graident on the top
    this.drawForeground();

    // debug
    if (this.debugParticles) {
      this.particleQuad.debugQuad(this.ctx, '#777');
    }

    // debug
    if (this.debugPointsOfIntrest) {
      this.pointsOfIntrestQuad.debugQuad(this.ctx, '#c60000');
    }

    this.cw.restoreContext();
  }

  drawBackground() {
    let bounds = this.cw.bounds;
    let b = new Rectangle(this.cw.drawingContext);

    b.position = new Vector(bounds.left, bounds.top);
    b.size = new Size(bounds.width, bounds.height);
    b.color = new Color(this.backgroundColor);

    b.draw();
  }

  drawForeground() {
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

  drawParticles() {
    // replace particles that have died off
    if (this.floatingParticles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    this.drawFloatingParticle(this.floatingParticles, this.particleQuad);
  }

  drawPointsOfIntrest() {
    this.drawFloatingParticle(this.pointsOfIntrest, this.pointsOfIntrestQuad);
    this.checkPoiInteraction();
  }

  drawFloatingParticle(particles: FloatingParticle[], trackingTree: QuadTree = undefined) {
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
          trackingTree.insert({ x: fp.position.x, y: fp.position.y, data: fp });
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

  private vectorParticleInteraction(startVector: { x: number, y: number }, qp: QuadVector[]) {
    // let lines: Line[] = [];

    // qp.forEach(vector => {
    //   let ip = <iParticle>(vector.data);
    //   ip.shade.shade = this.activeParticleColor;
    //   ip.currentLifeTime = ip.maximumLifeTime - this.particleFadeTime - 15;

    //   // lines
    //   if (this.drawvectorToParticleLines) {
    //     let line: Line = new Line();
    //     line.shade = this.lineColor;
    //     line.lineWidth = this.lineWidth;
    //     line.alpha = this.lineAlpha;

    //     let segment = new LineSegment({ x: startVector.x, y: startVector.y });
    //     segment.addVector({ x: ip.vector.x + ip.radius / 2, y: ip.vector.y + ip.radius / 2 });

    //     line.addSegment(segment);
    //     lines.push(line);
    //   }

    // });

    // lines.forEach(line => {
    //   this.cw.shape.drawLine(line);
    // });
  }

  checkPoiInteraction() {
    this.pointsOfIntrest.forEach(self => {

      // look for overlapping vectors

      // let b: Boundry = new Boundry(
      //   self.point.x - (self.radius / 2),
      //   self.point.y - (self.radius / 2),
      //   self.radius * 2,
      //   self.radius * 2);
      // let pointsInRange: QuadVector[] = this.pointsOfIntrestQuad.searchBoundry(b);

      let b: Boundry;
      switch (this.poiType) {
        case 'square':
          let b: Boundry = new Boundry(
            self.position.x - ((<Rectangle>self.floatingObject).size.width / 2),
            self.position.y - ((<Rectangle>self.floatingObject).size.width / 2),
            (<Rectangle>self.floatingObject).size.width * 2,
            (<Rectangle>self.floatingObject).size.width * 2);
          break;
        case 'circle':
          break;
      }


      let pointsInRange: QuadVector[] = this.pointsOfIntrestQuad.searchBoundry(b);
      // debug collisions (hit detection is still top left but the boundry is drawing perfect. confused...)
      let r = new Rectangle(this.cw.drawingContext);
      r.position = new Vector(b.x, b.y);
      r.size = new Size(b.w, b.h);
      r.outline = new LineStyle();
      r.outline.shade = 'yellow';

      r.draw();

      if (pointsInRange.length > 0) {
        pointsInRange.forEach(other => {
          if (other.data !== self) {
            let op = <FloatingParticle>(other.data);
            op.changeColor(new Color(this.poiCollisionColor));
            self.changeColor(new Color(this.poiCollisionColor));
          }
        });
      }

    });

  }

  drawConnectingLines() {
    // let lines: Line[] = [];

    // for (let x = 0; x < this.pointsOfIntrest.length; x++) {
    //   let line: Line = new Line();
    //   line.shade = this.lineColor;
    //   line.lineWidth = this.lineWidth;
    //   line.alpha = this.lineAlpha;

    //   // this square
    //   let s = this.vectors[x];
    //   // next square
    //   let ns = this.vectors[x + 1];

    //   let segment = new LineSegment({ x: s.vector.x + s.radius / 2, y: s.vector.y + s.radius / 2 });

    //   if (ns) {
    //     segment.addVector({ x: ns.vector.x + ns.radius / 2, y: ns.vector.y + ns.radius / 2 });
    //   }
    //   else {
    //     // connect back to the first
    //     let fp = this.vectors[0];
    //     segment.addVector({ x: fp.vector.x + fp.radius / 2, y: fp.vector.y + fp.radius / 2 });
    //   }

    //   line.addSegment(segment);
    //   lines.push(line);
    // }

    // lines.forEach(line => {
    //   this.cw.shape.drawLine(line);
    // });
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

      let c = new Circle(this.cw.drawingContext);
      c.position = p.position;
      c.radius = this.cw.random.randomNumberBetween(this.particleMinRadius, this.particleMaxRadius);
      c.color = new Color(this.cw.color.randomColorFromArray(this.colorArray));

      let fp = new FloatingParticle(this.cw.drawingContext, pLocation, p, c);
      fp.maximumLifeTime = this.cw.random.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan);
      fp.currentLifeTime = 0;
      fp.fadeable = true;
      fp.maximumAlpha = this.cw.random.randomNumberBetween(1, this.maxOpacity * 100) / 100;
      fp.fadeSpan = this.particleFadeTime;

      this.floatingParticles.push(fp);
    }
  }

  generatePointsOfIntrest() {
    for (let x = 0; x <= this.poiCount; x++) {

      let poiLocation = new Vector(
        Math.random() * (this.cw.width - this.poiSize),
        Math.random() * (this.cw.height - this.poiSize)
      );

      let poiParticle = new Particle(poiLocation);

      poiParticle.velocity = new Velocity(
        this.cw.random.randomWithNegative() * this.poiSpeedModifier,
        this.cw.random.randomWithNegative() * this.poiSpeedModifier
      );

      let obj: Circle | Rectangle;

      switch (this.poiType) {
        case 'square':
          obj = new Rectangle(this.cw.drawingContext);
          obj.size = new Size(this.poiSize, this.poiSize);

          break;
        case 'circle':
          obj = new Circle(this.cw.drawingContext);
          obj.radius = this.poiSize / 2;
          break;
      }

      obj.color = new Color(this.poiDefaultBackground);
      obj.outline = new LineStyle();
      obj.outline.shade = this.poiOutline;
      obj.shadow = new Shadow(this.poiShadowBlur, this.poiShadowColor);

      let fp = new FloatingParticle(this.cw.drawingContext, poiLocation, poiParticle, obj);
      this.pointsOfIntrest.push(fp);
    }
  }

  //#endregion

  //#region Interaction

  checkParticleHover() {
    if (!this.cw.mouseManager.mouseOffCanvas) {
      // current mouse location
      let mx = this.cw.mouseManager.mousePosition.x;
      let my = this.cw.mouseManager.mousePosition.y;

      // boundry around mouse
      let b: Boundry = new Boundry(mx - (this.vectorerRadius / 2), my - (this.vectorerRadius / 2), this.vectorerRadius, this.vectorerRadius);

      // check pointsOfIntrest
      let pointsOfIntrestInRange: QuadVector[] = this.pointsOfIntrestQuad.searchBoundry(b);

      // update pointsOfIntrest in range
      if (pointsOfIntrestInRange.length > 0) {
        pointsOfIntrestInRange.forEach(p => {
          let fp = <FloatingParticle>(p.data);
          fp.changeColor(new Color(this.poiHoverBackground));
        });
      }

      // check particles
      let particlesInRange: QuadVector[] = this.particleQuad.searchBoundry(b);

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
