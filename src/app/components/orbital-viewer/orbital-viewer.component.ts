import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PanZoom } from '../../lib/canvas/pan-zoom';


interface iSquare {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
}

interface iParticle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  lifetime: number;
  lifespan: number;
  opacity: number;
}

@Component({
  selector: 'app-orbital-viewer',
  templateUrl: './orbital-viewer.component.html',
  styleUrls: ['./orbital-viewer.component.css']
})
export class OrbitalViewerComponent implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  private context: CanvasRenderingContext2D;
  private hasChanges: boolean = false;
  private panZoom: PanZoom;

  private squareCount = 100;
  private squareSize = 25;
  private squareSpeedModifier = .3;

  private maxParticles: number = 350;
  private particles: iParticle[] = [];
  private particleRadius: number = 2;
  private maxParticleLifespan: number = 800;
  private minParticleLifespan: number = 200;
  private particleFadeTime: number = 50;
  private maxOpacity: number = .80;
  private colorArray: string[] = [
    '#5799e0',
    '#5689e0',
    '#165572'
  ];

  squares: iSquare[] = [];

  constructor() { }

  ngOnInit() {
    this.context = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');

    // setup pan and zoom
    this.panZoom = new PanZoom(this.context);
    this.panZoom.panSpeed = .70;
    this.panZoom.scaleStep = .05;

    this.generateSquares();

    this.hasChanges = true;
    this.draw();
  }

  //#region Drawing
  draw() {
    // only draw when we need to
    if (this.hasChanges || this.panZoom.isDirty) {
      // clear before doing anything
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      this.context.save();
      this.drawBackground();
      this.context.setTransform(this.panZoom.scale, 0, 0, this.panZoom.scale, this.panZoom.panX, this.panZoom.panY);

      this.doSomeCoolStuff();

      this.context.restore();
      this.hasChanges = false;
    }
    requestAnimationFrame(() => this.draw());
  }

  drawBackground() {
    let bounds = this.context.canvas.getBoundingClientRect();

    // Create gradient
    let grd = this.context.createLinearGradient(bounds.height / 2, 0.000, bounds.height / 2, bounds.height);

    // Add colors
    grd.addColorStop(0.500, 'rgba(0, 0, 0, 1.000)');
    grd.addColorStop(1.000, '#071142');

    // Fill with gradient
    this.context.fillStyle = grd;
    this.context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
  }

  doSomeCoolStuff() {
    // draw particles
    this.drawParticles();

    this.moveSquares();
    this.drawLines();
    this.drawSquares();
  }

  drawParticles() {
    if (this.particles.length !== this.maxParticles) {
      this.generateMissingParticles();
    }

    this.moveParticles();

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

  drawCircle(x: number, y: number, r: number, c: string, a: number = 1) {
    this.context.save();
    this.context.globalAlpha = a;
    this.context.beginPath();
    this.context.fillStyle = c;
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    this.context.fill();
    this.context.restore();
  }

  generateMissingParticles() {

    for (let x = this.particles.length; x < this.maxParticles; x++) {
      let p = <iParticle>{
        x: Math.random() * (this.context.canvas.width - this.particleRadius),
        y: Math.random() * (this.context.canvas.height - this.particleRadius),
        r: this.particleRadius,
        vx: this.randomWithNegative() * this.squareSpeedModifier,
        vy: this.randomWithNegative() * this.squareSpeedModifier,
        color: this.randomColor(),
        opacity: this.randomNumberBetween(1, this.maxOpacity * 100) / 100,
        lifespan: this.randomNumberBetween(this.maxParticleLifespan, this.minParticleLifespan),
        lifetime: 0
      };

      this.particles.push(p);
    }
  }

  generateSquares() {
    for (let x = 0; x < this.squareCount; x++) {
      let s = <iSquare>{
        x: Math.random() * (this.context.canvas.width - this.squareSize),
        y: Math.random() * (this.context.canvas.height - this.squareSize),
        w: this.squareSize,
        h: this.squareSize,
        vx: this.randomWithNegative() * this.squareSpeedModifier,
        vy: this.randomWithNegative() * this.squareSpeedModifier
      };

      this.squares.push(s);
    }
  }

  drawLines() {
    this.context.strokeStyle = '#3d6a89';
    this.context.lineWidth = .25;
    this.context.beginPath();
    for (let x = 0; x < this.squares.length; x++) {
      // current square and next square
      let s = this.squares[x];
      let ns = this.squares[x + 1];

      if (ns) {
        this.context.moveTo(s.x + s.w / 2, s.y + s.h / 2);
        this.context.lineTo(ns.x + ns.w / 2, ns.y + ns.h / 2);
      }
      else {
        let fs = this.squares[0];
        this.context.moveTo(s.x + s.w / 2, s.y + s.h / 2);
        this.context.lineTo(fs.x + fs.w / 2, fs.y + fs.h / 2);
      }

    }
    this.context.stroke();
  }

  drawSquares() {
    this.squares.forEach(square => {

      // bottom square
      this.context.fillStyle = '#999';
      this.context.strokeStyle = '#33ccff';
      this.context.shadowBlur = 10;
      this.context.shadowColor = '#33ccff';
      this.context.fillRect(square.x, square.y, square.h, square.w);
      this.context.strokeRect(square.x, square.y, square.h, square.w);

      // small square
      // let msW = square.w / 2;
      // let msH = square.w / 2;

      // this.context.fillStyle = '#111';
      // this.context.shadowBlur = 5;
      // this.context.shadowColor = '#000';
      // this.context.fillRect(square.x + (msW / 2), square.y + (msH / 2), msW, msH);

      // this.context.beginPath();
      // this.context.arc(square.x, square.y, 10, 0, 2 * Math.PI);
      // this.context.fill();
    });
  }

  moveSquares() {
    this.squares.forEach(square => {
      let posX = square.x + Math.random() * 5;
      let posY = square.y + Math.random() * 5;
      let bounds = this.context.canvas.getBoundingClientRect();

      if (posX + square.w >= bounds.right) {
        square.vx = -square.vx;
      }
      else if (posX <= bounds.left) {
        square.vx = Math.abs(square.vx);
      }

      if (posY + square.h >= bounds.bottom) {
        square.vy = -square.vy;
      }
      else if (posY <= bounds.top) {
        square.vy = Math.abs(square.vy);
      }

      square.x = square.x + square.vx;
      square.y = square.y + square.vy;
    });
  }

  moveParticles() {
    this.particles.forEach(p => {
      let posX = p.x + Math.random() * 5;
      let posY = p.y + Math.random() * 5;
      let bounds = this.context.canvas.getBoundingClientRect();

      if (posX + p.r >= bounds.right) {
        p.vx = -p.vx;
      }
      else if (posX <= bounds.left) {
        p.vx = Math.abs(p.vx);
      }

      if (posY + p.r >= bounds.bottom) {
        p.vy = -p.vy;
      }
      else if (posY <= bounds.top) {
        p.vy = Math.abs(p.vy);
      }

      p.x = p.x + p.vx;
      p.y = p.y + p.vy;
    });
  }

  wiggleSquares() {
    this.squares.forEach(square => {
      square.x = square.x + this.randomWithNegative();
      square.y = square.y + this.randomWithNegative();
    });
  }

  // returns number from -1 to 1
  randomWithNegative() {
    return (((Math.random() * 200) - 100) / 100);
  }

  randomColor() {
    return this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
  }

  randomNumberBetween(n1, n2) {
    return Math.floor(Math.random() * Math.max(n1, n2)) + Math.min(n1, n2);
  }
}
