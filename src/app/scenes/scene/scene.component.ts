import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { PanZoom } from '../../lib/canvas/pan-zoom';
import { QuadTree, Boundry, QuadPoint } from '../../lib/quadtree/quad-tree';
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
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class sceneComponent implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  //#region Variables

  private cw: CanvasWrapper;
  // private panZoom: PanZoom;
  private debugParticles = true;
  private debugPoints = false;

  // point
  private points: iParticle[] = [];

  // quads
  private particleQuad: QuadTree;
  private pointQuad: QuadTree;

  // particles
  private particles: iParticle[] = [];

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
  private pointShadowColor: string = '#49d3ff';
  private pointShadowBlur = 6;
  private pointHighlightColor = '#d121ad';

  // connecting lines
  private lineColor: string = '#3d6a89';
  private lineWidth: number = .25;
  private lineAlpha: number = .75;

  // particles
  private maxParticles: number = 250;
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
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    // set up quad trees
    let boundry: Boundry = new Boundry(0, 0, this.cw.width, this.cw.height);
    this.particleQuad = new QuadTree(boundry, 1);
    this.pointQuad = new QuadTree(boundry, 1);

    this.generatePoints();

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

    // draw connecting lines under points
    // this.drawConnectingLines();

    // update and draw main points
    // this.drawpoints();

    // drawing the graident on the top
    this.drawForeground();

    // debug
    if (this.debugParticles) {
      this.cw.saveContext();
      this.particleQuad.debugQuad(this.cw, '#777');
      this.cw.restoreContext();
    }

    // debug
    if (this.debugPoints) {
      this.pointQuad.debugQuad(this.cw, '#c60000');
    }

    this.cw.restoreContext();
  }

  drawBackground() {
    let bounds = this.cw.bounds;

    let background = <iRectangle>{
      point: {
        x: bounds.left,
        y: bounds.top
      },
      size: {
        width: bounds.width,
        height: bounds.height
      },
      color: {
        color: '#000'
      }
    };

    this.cw.shapes.drawRectangle(background);
  }

  drawForeground() {
    let bounds = this.cw.bounds;

    // Create gradient
    let grd = this.cw.graident.createLinearGradient(bounds.height / 2, 0.000, bounds.height / 2, bounds.height);

    // Add colors
    grd.addColorStop(0.000, 'rgba(0, 0, 0, 0.700)');
    grd.addColorStop(0.10, 'rgba(0, 0, 0, 0.000)');

    grd.addColorStop(0.90, 'rgba(0, 0, 0, 0.000)');
    grd.addColorStop(1.000, 'rgba(0, 0, 0, 0.700)');

    // Fill with gradient
    let foreGround = <iRectangle>{
      point: {
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

    this.cw.shapes.drawRectangle(foreGround);
  }

  drawParticles() {
    // replace particles that have died off
    if (this.particles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    // update particle locations
    this.cw.particles.moveParticles({ x: 0, y: 0, w: this.cw.width, h: this.cw.height }, this.particles);

    // apply fade to new or dying particles
    this.cw.particles.particleFader(this.particleFadeTime, this.particles);

    // clear the quad
    this.particleQuad.reset(this.cw.width, this.cw.height);

    // add particles then add them to the quad
    this.particles.forEach(p => {
      this.particleQuad.insert({ x: p.point.x, y: p.point.y, data: p });
      this.cw.shapes.drawCircle(p);
    });
  }

  drawpoints() {
    // clear the quad
    this.pointQuad.reset(this.cw.width, this.cw.height);

    // update point locations
    this.cw.particles.moveParticles({ x: 0, y: 0, w: this.cw.width, h: this.cw.height }, this.points);

    this.points.forEach(p => {
      if (this.pointType === 'circle') {
        this.cw.shapes.drawCircle(p);
      }
      else if (this.pointType === 'square') {
        let r = <iRectangle>{
          point: p.point,
          color: p.color,
          outline: p.outlineColor,
          shadow: p.shadow,
          size: {
            width: p.radius * Math.PI / 2,
            height: p.radius * Math.PI / 2
          }
        };
        this.cw.shapes.drawRectangle(r);
      }

      // add updated point to quad
      this.pointQuad.insert({ x: p.point.x, y: p.point.y, data: p });
    });

  }

  drawConnectingLines() {
    let lines: Line[] = [];

    for (let x = 0; x < this.points.length; x++) {
      let line: Line = new Line();
      line.color = this.lineColor;
      line.lineWidth = this.lineWidth;
      line.alpha = this.lineAlpha;

      // this square
      let s = this.points[x];
      // next square
      let ns = this.points[x + 1];

      let segment = new LineSegment({ x: s.point.x + s.radius / 2, y: s.point.y + s.radius / 2 });

      if (ns) {
        segment.addPoint({ x: ns.point.x + ns.radius / 2, y: ns.point.y + ns.radius / 2 });
      }
      else {
        // connect back to the first
        let fp = this.points[0];
        segment.addPoint({ x: fp.point.x + fp.radius / 2, y: fp.point.y + fp.radius / 2 });
      }

      line.addSegment(segment);
      lines.push(line);
    }

    lines.forEach(line => {
      this.cw.shapes.drawLine(line);
    });
  }

  //#endregion

  //#region Generation

  generateMissingParticles() {

    for (let x = this.particles.length - 1; x < this.maxParticles; x++) {
      let p = <iParticle>{
        point: {
          x: Math.random() * (this.cw.width - this.particleMaxRadius),
          y: Math.random() * (this.cw.height - this.particleMaxRadius)
        },
        radius: this.cw.randoms.randomNumberBetween(this.particleminRadius, this.particleMaxRadius),
        speed: {
          vx: this.cw.randoms.randomWithNegative() * this.particleSpeedModifier,
          vy: this.cw.randoms.randomWithNegative() * this.particleSpeedModifier
        },
        color: {
          color: this.cw.colors.randomColorFromArray(this.colorArray),
          alpha: this.cw.randoms.randomNumberBetween(1, this.maxOpacity * 100) / 100
        },
        maximumLifeTime: this.cw.randoms.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan),
        currentLifeTime: 0
      };

      this.particles.push(p);
    }
  }

  generatePoints() {
    for (let x = 0; x < this.pointCount; x++) {

      let p = <iParticle>{
        point: {
          x: Math.random() * (this.cw.width - this.pointSize),
          y: Math.random() * (this.cw.height - this.pointSize),
        },
        radius: this.pointSize,
        speed: {
          vx: this.cw.randoms.randomWithNegative() * this.pointSpeedModifier,
          vy: this.cw.randoms.randomWithNegative() * this.pointSpeedModifier
        },
        color: {
          color: this.pointDefaultBackground,
          alpha: 1
        },
        outlineColor: {
          color: this.pointOutline,
          alpha: 1
        },
        outlineWidth: .25,
        shadow: {
          shadowColor: this.pointShadowColor,
          shadowBlur: this.pointShadowBlur
        },
      };

      this.points.push(p);
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
      let b: Boundry = new Boundry(mx - (this.pointerRadius / 2), my - (this.pointerRadius / 2), this.pointerRadius, this.pointerRadius);

      // check points
      let pointsInRange: QuadPoint[] = this.pointQuad.searchBoundry(b);

      // update points in range
      if (pointsInRange.length > 0) {
        pointsInRange.forEach(p => {
          let ip = <iParticle>(p.data);
          ip.color.alpha = 1;
          ip.color.color = this.pointHighlightColor;
        });
      }

      // check particles
      let particlesInRange: QuadPoint[] = this.particleQuad.searchBoundry(b);

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
