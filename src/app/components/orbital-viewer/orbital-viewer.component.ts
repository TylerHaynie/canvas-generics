import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PanZoom } from '../../lib/canvas/pan-zoom';
import { QuadTree, Boundry, Point } from '../../lib/quadtree/quad-tree';

interface iPoint {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  lifetime: number;
  lifespan: number;
  opacity: number;
  fillColor: string;
  lineColor: string;
  shadowColor: string;
  fillOpacity: number;
}

@Component({
  selector: 'app-orbital-viewer',
  templateUrl: './orbital-viewer.component.html',
  styleUrls: ['./orbital-viewer.component.css']
})
export class OrbitalViewerComponent implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  private context: CanvasRenderingContext2D;
  private panZoom: PanZoom;
  private paused = false;
  private debugParticles = false;
  private debugPoints = false;

  // point
  private pointCount = 38;
  private pointSize = 15;
  private pointSpeedModifier = .08;
  private pointType: string = 'square';
  private pointDefaultBackground: string = '#000';
  private pointHoverBackground: string = '#333';

  // quads
  particleQuad: QuadTree;
  pointQuad: QuadTree;

  // particles
  private maxParticles: number = 1150;
  private particles: iPoint[] = [];
  private particleMaxRadius: number = 4.25;
  private particleminRadius: number = .10;
  private maxParticleLifespan: number = 350;
  private minParticleLifespan: number = 250;
  private particleFadeTime: number = 125;
  private particleSpeedModifier: number = .18;
  private maxOpacity: number = .75;
  private colorArray: string[] = [
    '#5799e0',
    '#5689e0',
    '#165572'
  ];

  points: iPoint[] = [];

  constructor() { }

  ngOnInit() {
    this.context = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');

    // setup pan and zoom
    this.panZoom = new PanZoom(this.context);
    this.panZoom.panSpeed = .70;
    this.panZoom.scaleStep = .05;

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
    };
  }

  //#region Drawing
  draw() {
    if (!this.paused) {
      this.context.save();
      // clear before doing anything
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.drawBackground();
      this.context.setTransform(this.panZoom.scale, 0, 0, this.panZoom.scale, this.panZoom.panX, this.panZoom.panY);

      // update and draw particles
      this.drawParticles();
      this.updateParticleQuad();

      // draw connecting lines under points
      this.drawLines();

      // update and draw main points
      this.drawpoints();
      this.updatePointsQuad();

      // update point locations
      this.movepoints(this.points);

      // do some hover stuff
      this.checkMouseHover();

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

      // this.context.restore();
      this.context.restore();
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
    grd.addColorStop(0.250, 'rgba(0, 0, 0, 0.000)');

    grd.addColorStop(0.750, 'rgba(0, 0, 0, 0.000)');
    grd.addColorStop(1.000, 'rgba(0, 0, 0, 0.700)');

    // Fill with gradient
    this.context.fillStyle = grd;
    this.context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
  }

  drawMousePointer() {
    let px = this.panZoom.pointerX;
    let py = this.panZoom.pointerY;

    this.drawCircle(px, py, 45, '#444', 0.5, 1, '#000');
  }

  drawParticles() {
    if (this.particles.length - 1 !== this.maxParticles) {
      this.generateMissingParticles();
    }

    this.movepoints(this.particles);

    for (let x = this.particles.length - 1; x > 0; x--) {
      let p = this.particles[x];
      if (p.lifetime < p.lifespan) {
        if (p.lifetime < this.particleFadeTime) {
          let step = p.opacity / this.particleFadeTime;

          this.drawCircle(p.x, p.y, p.r, p.color, (step * p.lifetime));
        }
        else if (p.lifespan - p.lifetime < this.particleFadeTime) {
          let step = p.opacity / this.particleFadeTime;
          this.drawCircle(p.x, p.y, p.r, p.color, step * (p.lifespan - p.lifetime));
        }
        else {
          this.drawCircle(p.x, p.y, p.r, p.color, p.opacity);
        }

        p.lifetime += 1;
      }
      else {
        this.particles.splice(x, 1);
      }
    }
  }

  drawCircle(x: number, y: number, r: number, c: string, a: number = 1, lw: number = 0, lc: string = '') {
    this.context.save();
    this.context.globalAlpha = a;
    this.context.beginPath();
    this.context.fillStyle = c;
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    this.context.fill();
    if (lw > 0) {
      this.context.strokeStyle = lc;
      this.context.stroke();
    }

    this.context.restore();
  }

  generateMissingParticles() {

    for (let x = this.particles.length - 1; x < this.maxParticles; x++) {
      let p = <iPoint>{
        x: Math.random() * (this.context.canvas.width - this.particleMaxRadius),
        y: Math.random() * (this.context.canvas.height - this.particleMaxRadius),
        r: this.randomNumberBetween(this.particleminRadius, this.particleMaxRadius),
        vx: this.randomWithNegative() * this.particleSpeedModifier,
        vy: this.randomWithNegative() * this.particleSpeedModifier,
        color: this.randomColorFromArray(this.colorArray),
        opacity: this.randomNumberBetween(1, this.maxOpacity * 100) / 100,
        lifespan: this.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan),
        lifetime: 0
      };

      this.particles.push(p);
    }
  }

  updateParticleQuad() {
    // update particles quad
    this.particleQuad.clear(this.context.canvas.width, this.context.canvas.height);
    for (let p of this.particles) {
      this.particleQuad.insert(new Point(p.x, p.y, p));
    }
  }

  generatePoints() {
    for (let x = 0; x < this.pointCount; x++) {
      let s = <iPoint>{
        x: Math.random() * (this.context.canvas.width - this.pointSize),
        y: Math.random() * (this.context.canvas.height - this.pointSize),
        r: this.pointSize,
        vx: this.randomWithNegative() * this.pointSpeedModifier,
        vy: this.randomWithNegative() * this.pointSpeedModifier,
        fillColor: this.pointDefaultBackground,
        lineColor: '#aaa',
        shadowColor: '#49d3ff',
        fillOpacity: 1
      };

      this.points.push(s);
    }


  }

  updatePointsQuad() {
    // update points quad
    this.pointQuad.clear(this.context.canvas.width, this.context.canvas.height);
    for (let p of this.points) {
      this.pointQuad.insert(new Point(p.x, p.y, p));
    }
  }

  drawLines() {
    this.context.save();
    this.context.strokeStyle = '#3d6a89';
    this.context.lineWidth = .25;
    this.context.beginPath();
    for (let x = 0; x < this.points.length; x++) {
      // current square and next square
      let s = this.points[x];
      let ns = this.points[x + 1];

      if (ns) {
        this.context.moveTo(s.x + s.r / 2, s.y + s.r / 2);
        this.context.lineTo(ns.x + ns.r / 2, ns.y + ns.r / 2);
      }
      else {
        let fs = this.points[0];
        this.context.moveTo(s.x + s.r / 2, s.y + s.r / 2);
        this.context.lineTo(fs.x + fs.r / 2, fs.y + fs.r / 2);
      }

    }
    this.context.stroke();
    this.context.restore();
  }

  drawpoints() {
    this.context.save();
    this.points.forEach(point => {

      // bottom square
      this.context.globalAlpha = point.fillOpacity;
      this.context.fillStyle = point.fillColor;
      this.context.strokeStyle = point.lineColor;
      this.context.shadowBlur = 6;
      this.context.shadowColor = point.shadowColor;

      if (this.pointType === 'square') {
        this.context.fillRect(point.x, point.y, point.r, point.r);
        this.context.strokeRect(point.x, point.y, point.r, point.r);
      }

      if (this.pointType === 'circle') {
        this.drawCircle(
          point.x + (this.pointSize / 2),
          point.y + (this.pointSize / 2),
          this.pointSize, point.fillColor,
          point.fillOpacity,
          .25,
          point.lineColor
        );
      }
    });
    this.context.restore();
  }

  movepoints(points: iPoint[]) {
    points.forEach((point) => {
      let posX = point.x + Math.random() * 5;
      let posY = point.y + Math.random() * 5;
      let bounds = this.context.canvas.getBoundingClientRect();

      if (posX + point.r >= bounds.right) {
        point.vx = -point.vx;
      }
      else if (posX <= bounds.left) {
        point.vx = Math.abs(point.vx);
      }

      if (posY + point.r >= bounds.bottom) {
        point.vy = -point.vy;
      }
      else if (posY <= bounds.top) {
        point.vy = Math.abs(point.vy);
      }

      point.x = point.x + point.vx;
      point.y = point.y + point.vy;
    });
  }

  wigglePoints(points: iPoint[]) {
    this.points.forEach(point => {
      point.x = point.x + this.randomWithNegative();
      point.y = point.y + this.randomWithNegative();
    });
  }

  checkMouseHover() {
    let mx = this.panZoom.pointerX;
    let my = this.panZoom.pointerY;

    // TODO: query quad tree

    this.points.forEach(point => {
      if (this.pointerOverCircle(point.x, point.y, point.r)) {
        point.vx = 0;
        point.vy = 0;
        point.fillColor = this.pointHoverBackground;
      }
      else if (point.vx === 0 && point.vy === 0) {
        point.vx = this.randomWithNegative() * this.pointSpeedModifier;
        point.vy = this.randomWithNegative() * this.pointSpeedModifier;
        point.fillColor = this.pointDefaultBackground;
      }
    });
  }

  // returns number from -1 to 1
  randomWithNegative() {
    return (((Math.random() * 200) - 100) / 100);
  }

  randomColorFromArray(colorArray: string[]) {
    return this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
  }

  randomColor(min = '0', max = 'f'): string {
    let a = '0123456789abcdef';

    let minIndex = a.indexOf(min);
    let maxIndex = a.indexOf(max);
    let range = a.substring(minIndex, maxIndex);

    let color: string = '#';
    for (let x = 0; x < 6; x++) {
      color += range[Math.floor(Math.random() * range.length)];
    }

    return color;
  }

  randomGray(min = '0', max = 'f'): string {
    let a = '0123456789abcdef';

    let minIndex = a.indexOf(min);
    let maxIndex = a.indexOf(max);
    let range = a.substring(minIndex, maxIndex + 1);
    let c = range[Math.floor(Math.random() * range.length)];
    return `#${c}${c}${c}`;
  }

  randomNumberBetween(n1, n2) {
    return Math.floor(Math.random() * Math.max(n1, n2)) + Math.min(n1, n2);
  }

  private pointerOverCircle(x: number, y: number, r: number): boolean {
    let withinBounds: boolean = false;

    // change radius if you want a wider range
    let pointerPoint = {
      radius: 1,
      x: this.panZoom.pointerX,
      y: this.panZoom.pointerY
    };

    let circle2 = {
      radius: r,
      x: x,
      y: y
    };

    let dx = pointerPoint.x - circle2.x;
    let dy = pointerPoint.y - circle2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < pointerPoint.radius + circle2.radius) {
      withinBounds = true;
    }

    return withinBounds;
  }

  private debugSnap() {
    console.log(this.particleQuad);
    console.log(this.pointQuad);
  }
}
