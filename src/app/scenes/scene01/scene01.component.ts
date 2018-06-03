import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuadTree, Boundry, Quadvector } from '../../lib/quadtree/quad-tree';
import { CanvasWrapper } from '../../lib/canvas/canvas-wrapper';
import { iParticle } from '../../lib/canvas/interfaces/iParticle';
import { RandomUtility } from '../../lib/canvas/utilities/random-utility';
import { ColorUtility } from '../../lib/canvas/utilities/color-utility';
import { ParticleUtility } from '../../lib/canvas/utilities/particle-utility';
import { ShapeUtility } from '../../lib/canvas/utilities/shape-utility';
import { iRectangle } from '../../lib/canvas/interfaces/iRectangle';
import { Line } from '../../lib/canvas/objects/line/line';
import { LineSegment } from '../../lib/canvas/objects/line/line-segment';

@Component({
  selector: 'app-scene01',
  templateUrl: './scene01.component.html',
  styleUrls: ['./scene01.component.css']
})
export class scene01Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  //#region Variables

  private cw: CanvasWrapper;
  // private panZoom: PanZoom;
  private debugParticles = false;
  private debugvectors = false;

  // vector
  private vectors: iParticle[] = [];

  // quads
  private particleQuad: QuadTree;
  private vectorQuad: QuadTree;

  // particles
  private particles: iParticle[] = [];

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

  // vectors
  private vectorCount = 20;
  private vectorSize = 25;
  private vectorSpeedModifier = 1;
  private drawvectorToParticleLines: boolean = true;
  private fieldSize = 80;
  private vectorType: string = 'square'; // circle or square
  private vectorDefaultBackground: string = '#0E1019';
  private vectorOutline: string = '#2D3047';
  private vectorHoverBackground: string = '#0E1019';
  private vectorShadowColor: string = '#2D3047';
  private vectorShadowBlur = 6;
  private vectorerCollideColor: string = '#A9353E';

  // connecting lines
  private lineWidth: number = .5;
  private lineAlpha: number = .18;
  private activeParticleColor = '#FF9B71';
  private lineColor: string = '#313947';

  // particles
  private maxParticles: number = 3500;
  private colorArray: string[] = ['#165572', '#87DAFF', '#33447E'];
  private particleSpeedModifier: number = .05;
  private particleMaxRadius: number = 4.25;
  private particleminRadius: number = .15;
  private maxParticleLifespan: number = 330;
  private minParticleLifespan: number = 175;
  private particleFadeTime: number = 85;

  private maxOpacity: number = .70;
  private particleHighlightColor: string = '#ff2dd4';
  // private particleHighlightColor: string = '#5e5d52';

  //#endregion

  //#region Init

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    // set up quad trees
    let boundry: Boundry = new Boundry(0, 0, this.cw.width, this.cw.height);
    this.particleQuad = new QuadTree(boundry, 1);
    this.vectorQuad = new QuadTree(boundry, 1);

    this.generatevectors();

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
    this.drawvectors();

    // drawing the graident on the top
    this.drawForeground();

    // debug
    if (this.debugParticles) {
      this.particleQuad.debugQuad(this.cw, '#777');
    }

    // debug
    if (this.debugvectors) {
      this.vectorQuad.debugQuad(this.cw, '#c60000');
    }

    this.cw.restoreContext();
  }

  drawBackground() {
    let bounds = this.cw.bounds;

    let background = <iRectangle>{
      vector: {
        x: bounds.left,
        y: bounds.top
      },
      size: {
        width: bounds.width,
        height: bounds.height
      },
      color: {
        color: this.backgroundColor
      }
    };

    this.cw.shape.drawRectangle(background);
  }

  drawForeground() {
    let bounds = this.cw.bounds;

    // Create gradient
    let grd = this.cw.graident.createLinearGradient(bounds.height / 2, 0.000, bounds.height / 2, bounds.height);

    // Add colors
    grd.addColorStop(this.foregroundEnd1, this.foregroundColorEndColor);
    grd.addColorStop(this.foregroundStart1, this.foregroundColorStartColor);

    grd.addColorStop(this.foregroundStart2, this.foregroundColorStartColor);
    grd.addColorStop(1.000, this.foregroundColorEndColor);

    // Fill with gradient
    let foreGround = <iRectangle>{
      vector: {
        x: bounds.left,
        y: bounds.top
      },
      size: {
        width: bounds.width,
        height: bounds.height
      },
      color: {
        color: grd
      }
    };

    this.cw.shape.drawRectangle(foreGround);
  }

  drawParticles() {
    // replace particles that have died off
    if (this.particles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    // update particle locations
    this.cw.particle.moveParticles({ x: 0, y: 0, w: this.cw.width, h: this.cw.height }, this.particles);

    // apply fade to new or dying particles
    this.cw.particle.particleFader(this.particleFadeTime, this.particles);

    // clear the quad
    this.particleQuad.reset(this.cw.width, this.cw.height);

    // add particles then add them to the quad
    this.particles.forEach(p => {
      this.particleQuad.insert({ x: p.vector.x, y: p.vector.y, data: p });
      this.cw.shape.drawCircle(p);
    });
  }

  drawvectors() {
    // clear the quad
    this.vectorQuad.reset(this.cw.width, this.cw.height);

    // update vector locations
    this.cw.particle.moveParticles({ x: 0, y: 0, w: this.cw.width, h: this.cw.height }, this.vectors);

    this.vectors.forEach(p => {

      // look for nearby particles
      let b: Boundry = new Boundry(
        p.vector.x - ((p.radius + (this.fieldSize / 2)) / 2),
        p.vector.y - ((p.radius + (this.fieldSize / 2)) / 2),
        (p.radius) * 2 + (this.fieldSize / 2),
        (p.radius) * 2 + (this.fieldSize / 2)
      );

      let vectorsInRange: Quadvector[] = this.particleQuad.searchBoundry(b);

      // debug
      // let r = <iRectangle>{
      //   vector: { x: b.x, y: b.y },
      //   size: { width: b.w, height: b.h },
      //   outline: { color: 'red', alpha: 1 }
      // };

      // this.cw.shape.drawRectangle(r);

      // look for nearbyvectors
      this.vectorParticleInteraction({ x: p.vector.x + (p.radius / 2), y: p.vector.y + (p.radius / 2) }, vectorsInRange);

      if (this.vectorType === 'circle') {
        this.cw.shape.drawCircle(p);
      }
      else if (this.vectorType === 'square') {
        let r = <iRectangle>{
          vector: { x: p.vector.x, y: p.vector.y },
          color: p.color,
          outline: p.outlineColor,
          shadow: p.shadow,
          size: { width: p.radius, height: p.radius }
        };
        this.cw.shape.drawRectangle(r);
      }

      // add updated vector to quad
      this.vectorQuad.insert({ x: p.vector.x + (p.radius / 2), y: p.vector.y + (p.radius / 2), data: p });

      // debug
      // let r = <iRectangle>{
      //   vector: { x: p.vector.x, y: p.vector.y },
      //   size: { width: (<iParticle>p).radius, height: (<iParticle>p).radius },
      //   outline: { color: 'red', alpha: 1 }
      // };

      // this.cw.shape.drawRectangle(r);
    });

    this.checkvectorInteractWithvector();
  }

  private vectorParticleInteraction(startVector: { x: number, y: number }, qp: Quadvector[]) {
    let lines: Line[] = [];

    qp.forEach(vector => {
      let ip = <iParticle>(vector.data);
      ip.color.color = this.activeParticleColor;
      ip.currentLifeTime = ip.maximumLifeTime - this.particleFadeTime - 15;

      // lines
      if (this.drawvectorToParticleLines) {
        let line: Line = new Line();
        line.color = this.lineColor;
        line.lineWidth = this.lineWidth;
        line.alpha = this.lineAlpha;

        let segment = new LineSegment({ x: startVector.x, y: startVector.y });
        segment.addVector({ x: ip.vector.x + ip.radius / 2, y: ip.vector.y + ip.radius / 2 });

        line.addSegment(segment);
        lines.push(line);
      }

    });

    lines.forEach(line => {
      this.cw.shape.drawLine(line);
    });
  }

  checkvectorInteractWithvector() {
    this.vectors.forEach(self => {
      // look for overlapping vectors
      let b: Boundry = new Boundry(self.vector.x - (self.radius / 2), self.vector.y - (self.radius / 2), self.radius * 2, self.radius * 2);
      let vectorsInRange: Quadvector[] = this.vectorQuad.searchBoundry(b);

      // let r = <iRectangle>{
      //   vector: { x: b.x, y: b.y },
      //   size: { width: b.w, height: b.h },
      //   outline: { color: 'yellow', alpha: 1 }
      // };

      // this.cw.shape.drawRectangle(r);

      if (vectorsInRange.length > 0) {
        vectorsInRange.forEach(other => {
          if (other.data !== self) {
            let op = <iParticle>(other.data);
            op.color.color = this.vectorerCollideColor;
            self.color.color = this.vectorerCollideColor;

            // op.speed.vx += .01;
            // op.speed.vy += .01;

            // self.speed.vx += .01;
            // self.speed.vy += .01;

          }
        });
      }

    });

  }

  drawConnectingLines() {
    let lines: Line[] = [];

    for (let x = 0; x < this.vectors.length; x++) {
      let line: Line = new Line();
      line.color = this.lineColor;
      line.lineWidth = this.lineWidth;
      line.alpha = this.lineAlpha;

      // this square
      let s = this.vectors[x];
      // next square
      let ns = this.vectors[x + 1];

      let segment = new LineSegment({ x: s.vector.x + s.radius / 2, y: s.vector.y + s.radius / 2 });

      if (ns) {
        segment.addVector({ x: ns.vector.x + ns.radius / 2, y: ns.vector.y + ns.radius / 2 });
      }
      else {
        // connect back to the first
        let fp = this.vectors[0];
        segment.addVector({ x: fp.vector.x + fp.radius / 2, y: fp.vector.y + fp.radius / 2 });
      }

      line.addSegment(segment);
      lines.push(line);
    }

    lines.forEach(line => {
      this.cw.shape.drawLine(line);
    });
  }

  //#endregion

  //#region Generation

  generateMissingParticles() {

    for (let x = this.particles.length - 1; x < this.maxParticles; x++) {
      let p = <iParticle>{
        vector: {
          x: Math.random() * (this.cw.width - this.particleMaxRadius),
          y: Math.random() * (this.cw.height - this.particleMaxRadius)
        },
        radius: this.cw.random.randomNumberBetween(this.particleminRadius, this.particleMaxRadius),
        speed: {
          vx: this.cw.random.randomWithNegative() * this.particleSpeedModifier,
          vy: this.cw.random.randomWithNegative() * this.particleSpeedModifier
        },
        color: {
          color: this.cw.color.randomColorFromArray(this.colorArray),
          alpha: this.cw.random.randomNumberBetween(1, this.maxOpacity * 100) / 100
        },
        maximumLifeTime: this.cw.random.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan),
        currentLifeTime: 0
      };

      this.particles.push(p);
    }
  }

  generatevectors() {
    for (let x = 0; x < this.vectorCount; x++) {

      let p = <iParticle>{
        vector: {
          x: Math.random() * (this.cw.width - this.vectorSize),
          y: Math.random() * (this.cw.height - this.vectorSize),
        },
        radius: this.vectorSize,
        speed: {
          vx: this.cw.random.randomWithNegative() * this.vectorSpeedModifier,
          vy: this.cw.random.randomWithNegative() * this.vectorSpeedModifier
        },
        color: {
          color: this.vectorDefaultBackground,
          alpha: 1
        },
        outlineColor: {
          color: this.vectorOutline,
          alpha: 1
        },
        outlineWidth: .25,
        shadow: {
          shadowColor: this.vectorShadowColor,
          shadowBlur: this.vectorShadowBlur
        },
      };

      this.vectors.push(p);
    }
  }

  //#endregion

  //#region Interaction

  checkParticleHover() {
    if (!this.cw.mouseManager.mouseOffCanvas) {
      // current mouse location
      let mx = this.cw.mouseManager.mouseX;
      let my = this.cw.mouseManager.mouseY;

      // boundry around mouse
      let b: Boundry = new Boundry(mx - (this.vectorerRadius / 2), my - (this.vectorerRadius / 2), this.vectorerRadius, this.vectorerRadius);

      // check vectors
      let vectorsInRange: Quadvector[] = this.vectorQuad.searchBoundry(b);

      // update vectors in range
      if (vectorsInRange.length > 0) {
        vectorsInRange.forEach(p => {
          let ip = <iParticle>(p.data);
          ip.color.alpha = 1;
          ip.color.color = this.vectorHoverBackground;
        });
      }

      // check particles
      let particlesInRange: Quadvector[] = this.particleQuad.searchBoundry(b);

      // update particles in range
      if (particlesInRange.length > 0) {
        particlesInRange.forEach(p => {
          let ip = <iParticle>(p.data);
          ip.color.alpha = 1;
          ip.color.color = this.particleHighlightColor;
        });
      }
    }

  }

  //#endregion

}
