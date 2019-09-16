import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { Bounds } from '@canvas/objects/bounds';
import { Vector2D } from '@canvas/objects/vector';
import { RandomUtility } from '@canvas/utilities/random-utility';
import { QuadTree, Boundary, QuadData } from '@quadtree/quad-tree';
import { FadableParticle } from '@canvas/particles/fadable-particle';
import { Color } from '@canvas/models/color';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Size } from '@canvas/models/size';
import { GradientUtility } from '@canvas/utilities/gradient-utility';
import { Velocity } from '@canvas/models/velocity';
import { ParticleBase } from '@canvas/particles/particle-base';
import { Line } from '@canvas/shapes/line/line';
import { LineSegment } from '@canvas/shapes/line/line-segment';
import { LineStyle } from '@canvas/models/line-style';
import { Shadow } from '@canvas/models/shadow';

@Component({
  selector: 'app-scene04',
  templateUrl: './scene04.component.html',
  styleUrls: ['./scene04.component.css']
})
export class Scene04Component implements AfterViewInit {
  @ViewChild('c', { static: false }) canvasRef: ElementRef;

  //#region Variables

  private cw: CanvasWrapper;
  // private panZoom: PanZoom;
  private debugParticles = false;
  private debugPoints = false;

  // point
  private blocks: ParticleBase[] = [];

  // quads
  private particleQuad: QuadTree;
  private pointQuad: QuadTree;

  // particles
  private particles: FadableParticle[] = [];

  //#endregion

  //#region Configuration

  // Pointer
  private pointerRadius: number = 55;

  // background and foreground
  private backgroundColor: string = '#0C101E';
  private foregroundColorStartColor: string = 'rgba(12, 16, 30, 0.000)';
  private foregroundColorEndColor: string = 'rgba(0, 0, 0, 0.750)';
  private foregroundStart1: number = .250; // where the top graident starts
  private foregroundEnd1: number = 0.000; // where the top graident ends
  private foregroundStart2: number = .750; // where the bottom graident starts
  private foregroundEnd2: number = 1.000; // where the bottom graident ends

  // points
  private pointCount = 20;
  private pointSize = 25;
  private pointSpeedModifier = 1;
  private drawPointToParticleLines: boolean = true;
  private fieldSize = 80;
  private pointType: string = 'square'; // circle or square
  private pointDefaultBackground: string = '#0E1019';
  private pointOutline: string = '#2D3047';
  private pointHoverBackground: string = '#0E1019';
  private pointShadowColor: string = '#2D3047';
  private pointShadowBlur = 6;
  private pointerCollideColor: string = '#A9353E';

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

  private randomUtil = new RandomUtility();

  //#endregion

  //#region Init

  constructor() { }

  ngAfterViewInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    // set up quad trees
    let boundry: Boundary = new Boundary(0, 0, this.cw.width, this.cw.height);
    this.particleQuad = new QuadTree(boundry, 1);
    this.pointQuad = new QuadTree(boundry, 1);

    this.generateBlocks();

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
    this.drawBlocks();

    // drawing the graident on the top
    this.drawForeground();

    // debug
    if (this.debugParticles) {
      this.particleQuad.debugQuad(this.cw.drawingContext, '#777');
    }

    // debug
    if (this.debugPoints) {
      this.pointQuad.debugQuad(this.cw.drawingContext, '#c60000');
    }

    this.cw.restoreContext();
  }

  drawBackground() {
    let bounds = this.cw.bounds;

    let background = new Rectangle(this.cw.drawingContext, new Vector2D(bounds.left, bounds.top));
    background.size = new Size(bounds.width, bounds.height);
    background.color = new Color(this.backgroundColor);

    background.draw();
  }

  drawForeground() {
    let bounds = this.cw.bounds;

    // Create gradient
    let grd = new GradientUtility(this.cw.drawingContext)
      .createLinearGradient(bounds.height / 2, 0.000, bounds.height / 2, bounds.height);

    // Add colors
    grd.addColorStop(this.foregroundEnd1, this.foregroundColorEndColor);
    grd.addColorStop(this.foregroundStart1, this.foregroundColorStartColor);

    grd.addColorStop(this.foregroundStart2, this.foregroundColorStartColor);
    grd.addColorStop(1.000, this.foregroundColorEndColor);

    let foreGround = new Rectangle(this.cw.drawingContext, new Vector2D(bounds.left, bounds.top));
    foreGround.size = new Size(bounds.width, bounds.height);
    foreGround.color = new Color(grd);

    foreGround.draw();
  }

  drawParticles() {
    // replace particles that have died off
    if (this.particles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    // clear the quad
    this.particleQuad.reset(this.cw.width, this.cw.height);

    let deadParticles: number[] = [];
    for (let x = 0; x < this.particles.length; x++) {
      const particle = this.particles[x];

      // flag for removal
      if (!particle.isAlive) { deadParticles.push(x); }

      particle.move(new Bounds(new Vector2D(0, 0), new Size(this.cw.width, this.cw.height)));
      particle.tick();

      // adding particles to the quadtree
      this.particleQuad
        .insert(new QuadData(particle.getPosition().x, particle.getPosition().y,
          particle, particle.getSize()));

      particle.draw();
    }

    deadParticles.forEach(index => {
      this.particles.splice(index, 1);
    });

  }

  drawBlocks() {
    // clear the quad
    this.pointQuad.reset(this.cw.width, this.cw.height);

    this.blocks.forEach(block => {
      // look for nearby particles
      let b: Boundary = new Boundary(
        block.getPosition().x - (block.getSize().width) / 2,
        block.getPosition().y - (block.getSize().height / 2),
        block.getSize().width,
        block.getSize().height
      );

      block.move(new Bounds(new Vector2D(0, 0), new Size(this.cw.width, this.cw.height)));

      let pointsInRange = this.pointQuad.searchBoundary(b);

      // look for nearbypoints
      this.pointParticleInteraction({
        x: block.getPosition().x,
        y: block.getPosition().y,
      }, pointsInRange);

      // add updated point to quad
      this.pointQuad.insert(new QuadData(
        block.getPosition().x,
        block.getPosition().y,
        block,
        new Size(
          block.getSize().width,
          block.getSize().height,
        )));

      block.draw();

    });

    this.checkPointInteractWithPoint();
  }

  private pointParticleInteraction(startPoint: { x: number, y: number }, data: QuadData[]) {
    data.forEach(block => {
      let ip = <FadableParticle>(block.data);
      ip.setColor(new Color(this.activeParticleColor));
      ip.maximumLifeTime = ip.maximumLifeTime - this.particleFadeTime - 15;

      // lines
      if (this.drawPointToParticleLines) {
        let line: Line = new Line(this.cw.drawingContext);
        line.style.shade = this.lineColor;
        line.style.width = this.lineWidth;
        line.style.alpha = this.lineAlpha;

        let segment = new LineSegment(new Vector2D(startPoint.x, startPoint.y));
        segment.addPoint(new Vector2D(
          ip.getPosition().x + ip.getSize().width / 2,
          ip.getPosition().y + ip.getSize().height / 2));

        line.addSegment(segment);
        line.draw();
      }
    });
  }

  checkPointInteractWithPoint() {
    this.blocks.forEach(block => {
      // look for overlapping points
      let b: Boundary = new Boundary(
        block.getPosition().x - (block.getSize().width / 2),
        block.getPosition().y - (block.getSize().height / 2),
        block.getSize().width,
        block.getSize().height);

      let pointsInRange: QuadData[] = this.pointQuad.searchBoundary(b);

      if (pointsInRange.length > 0) {
        pointsInRange.forEach((other: QuadData) => {
          if (other.data !== self) {
            let op = <FadableParticle>(other.data);
            op.setColor(new Color(this.pointerCollideColor));
            block.setColor(new Color(this.pointerCollideColor));
          }
        });
      }

    });
  }

  drawConnectingLines() {
    for (let x = 0; x < this.blocks.length; x++) {
      let line: Line = new Line(this.cw.drawingContext);
      line.style.shade = this.lineColor;
      line.style.width = this.lineWidth;
      line.style.alpha = this.lineAlpha;

      // this square
      let s = this.blocks[x];

      // next square
      let ns = this.blocks[x + 1];

      let segment = new LineSegment(new Vector2D(s.getPosition().x, s.getPosition().y));

      if (ns) {
        segment.addPoint(new Vector2D(ns.getPosition().x, ns.getPosition().y));
      }
      else {
        // connect back to the first
        let fp = this.blocks[0];
        segment.addPoint(new Vector2D(fp.getPosition().x, fp.getPosition().y));
      }

      line.addSegment(segment);
      line.draw();
    }
  }

  //#endregion

  //#region Generation

  generateMissingParticles() {

    for (let x = this.particles.length - 1; x < this.maxParticles; x++) {
      // particle mesh and geometry
      let pRect = new Rectangle(
        this.cw.drawingContext,
        new Vector2D(
          Math.random() * (this.cw.width - this.particleMaxRadius),
          Math.random() * (this.cw.height - this.particleMaxRadius)
        ));

      pRect.size = new Size(
        this.randomUtil.randomNumberBetween(this.particleminRadius, this.particleMaxRadius),
        this.randomUtil.randomNumberBetween(this.particleminRadius, this.particleMaxRadius)
      );

      let pv = new Velocity(
        this.randomUtil.randomWithNegative() * this.particleSpeedModifier,
        this.randomUtil.randomWithNegative() * this.particleSpeedModifier
      );

      // define particle color
      let pColor = new Color();
      let colorIndex = this.randomUtil.randomNumberBetween(0, this.colorArray.length - 1);
      pColor.shade = this.colorArray[colorIndex];
      pColor.alpha = this.randomUtil.randomNumberBetween(1, this.maxOpacity * 100) / 100;

      let particle = new FadableParticle(pRect, pv);
      particle.setColor(pColor);
      particle.maximumLifeTime =
        this.randomUtil.randomNumberBetween(this.minParticleLifespan, this.maxParticleLifespan);
      particle.fadeSpan = this.particleFadeTime;
      particle.currentLifeTime = 0;

      this.particles.push(particle);
    }
  }

  generateBlocks() {
    for (let x = 0; x < this.pointCount; x++) {
      let pr = new Rectangle(this.cw.drawingContext,
        new Vector2D(
          Math.random() * (this.cw.width - this.pointSize),
          Math.random() * (this.cw.height - this.pointSize)
        ));

      pr.outline = new LineStyle(0.25);
      pr.outline.shade = this.pointOutline;
      pr.outline.alpha = 1;
      pr.shadow = new Shadow(this.pointShadowBlur, this.pointShadowColor);

      let pv = new Velocity(
        this.randomUtil.randomWithNegative() * this.pointSpeedModifier,
        this.randomUtil.randomWithNegative() * this.pointSpeedModifier
      );

      let pColor = new Color();
      pColor.shade = this.pointDefaultBackground;
      pColor.alpha = 1;

      let block = new FadableParticle(pr, pv);
      block.setColor(pColor);

      this.blocks.push(block);
    }
  }

  //#endregion

  //#region Interaction

  checkParticleHover() {
    if (this.cw.mouseManager.mouseOnCanvas) {
      // current mouse location
      let mx = this.cw.mouseManager.position.x;
      let my = this.cw.mouseManager.position.y;

      // boundry around mouse
      let b: Boundary = new Boundary(
        mx - (this.pointerRadius / 2),
        my - (this.pointerRadius / 2),
        this.pointerRadius,
        this.pointerRadius);

      // check points
      let pointsInRange: QuadData[] = this.pointQuad.searchBoundary(b);

      // update points in range
      if (pointsInRange.length > 0) {
        pointsInRange.forEach(p => {
          let ip = p.data as FadableParticle;
          let color = new Color(this.pointHoverBackground);
          color.alpha = 1;
        });
      }

      // check particles
      let particlesInRange: QuadData[] = this.particleQuad.searchBoundary(b);

      // update particles in range
      if (particlesInRange.length > 0) {
        particlesInRange.forEach(p => {
          let ip = p.data as FadableParticle;
          let color = new Color(this.particleHighlightColor);
          color.alpha = 1;
        });
      }
    }

  }

  //#endregion

}
