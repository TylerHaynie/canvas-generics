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

  private squareCount = 50;
  private squareSize = 25;
  private squareSpeedModifier = .3;

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
      this.context.setTransform(this.panZoom.scale, 0, 0, this.panZoom.scale, this.panZoom.panX, this.panZoom.panY);

      this.doSomeCoolStuff();

      this.context.restore();
      this.hasChanges = false;
    }
    requestAnimationFrame(() => this.draw());
  }

  doSomeCoolStuff() {
    this.moveSquares();
    this.drawLines();
    this.drawSquares();
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
    this.context.strokeStyle = '#aaa';
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
    this.context.fillStyle = '#aaa';
    this.squares.forEach(square => {
      this.context.fillRect(square.x, square.y, square.h, square.w);

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
}
