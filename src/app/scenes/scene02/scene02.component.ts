import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '../../lib/canvas/canvas-wrapper';
import { iRectangle } from '../../lib/canvas/interfaces/iRectangle';
import { iCircle } from '../../lib/canvas/interfaces/iCircle';

@Component({
  selector: 'app-scene02',
  templateUrl: './scene02.component.html',
  styleUrls: ['./scene02.component.css']
})
export class Scene02Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  private squares: iRectangle[] = [];

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    this.generateSquares();
    // start the draw loop
    this.cw.start();
  }

  draw() {
    this.cw.saveContext();

    this.doSomething();

    this.cw.restoreContext();
  }

  generateSquares() {
    for (let x = 0; x < 10; x++) {
      this.squares.push(<iRectangle>{
        point: this.cw.randoms.randomPointInBounds(this.cw.width, this.cw.height),
        size: { width: 30, height: 30 },
        color: { color: '#888', alpha: 1 }
      });
    }
  }

  doSomething() {
    this.drawSquares();
    this.drawMousePosition();
  }

  drawSquares() {
    this.squares.forEach(square => {
      this.cw.shapes.drawRectangle(square);
    });
  }

  drawMousePosition() {
    let mm = this.cw.mouseManager;
    if (!mm.mouseOffCanvas) {
      let mp = <iCircle>{
        point: { x: mm.mouseX, y: mm.mouseY },
        radius: 2,
        color: {
          alpha: 1,
          color: 'red'
        }
      };

      this.cw.shapes.drawCircle(mp);
    }
  }

}
