import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '../../lib/canvas/canvas-wrapper';
import { iRectangle } from '../../lib/canvas/interfaces/iRectangle';
import { iCircle } from '../../lib/canvas/interfaces/iCircle';
import { Line } from '../../lib/canvas/objects/line/line';
import { LineSegment } from '../../lib/canvas/objects/line/line-segment';
import { QuadTree, Boundry } from '../../lib/quadtree/quad-tree';
import { iPoint } from '../../lib/canvas/interfaces/iPoint';
import { Math } from '../../lib/canvas/utilities/math';

interface Ray {
  a: iPoint;
  b: iPoint;
}

@Component({
  selector: 'app-scene02',
  templateUrl: './scene02.component.html',
  styleUrls: ['./scene02.component.css']
})
export class Scene02Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  private squares: iRectangle[] = [];
  private qtSquares: QuadTree;
  private focalPoint: iCircle;

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    let b: Boundry = new Boundry(0, 0, this.cw.width, this.cw.height);
    this.qtSquares = new QuadTree(b, 1);

    this.setFocalPoint();
    this.generateSquares();
    // start the draw loop
    this.cw.start();
  }

  setFocalPoint() {
    this.focalPoint = <iCircle>{
      point: { x: this.cw.width / 2, y: this.cw.height / 2 },
      radius: 2,
      color: { color: 'red', alpha: 1 }
    };
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
    this.drawFocalPoint();
    this.castRay();
  }

  drawSquares() {

    this.qtSquares.reset(this.cw.width, this.cw.height);

    this.squares.forEach(square => {
      this.cw.shapes.drawRectangle(square);
      this.qtSquares.insert({ x: square.point.x, y: square.point.y, data: square });
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

  drawFocalPoint() {
    this.cw.shapes.drawCircle(this.focalPoint);
  }

  castRay() {
    let mm = this.cw.mouseManager;

    // draw line
    let line: Line = new Line();
    line.color = 'red';
    line.lineWidth = .5;
    line.alpha = 1;

    let segment = new LineSegment(this.focalPoint.point);

    // check for intersection
    // some point along the line
    let bounds: Boundry = new Boundry(this.focalPoint.point.x, this.focalPoint.point.y, 30, 30);

    // first find the slope
    let slope = this.cw.math.findSlope({ x: bounds.x, y: bounds.y }, { x: mm.mouseX, y: mm.mouseY });

    // now find the slope-intercept
    let mx = (slope * mm.mouseX);
    let b = mm.mouseY - mx;
    let y = mx + b;

    // nailed it!
    segment.addPoint({ x: 0, y: y });

    // draw a little circle where it ends
    let mp = <iCircle>{
      point: { x: 0, y: y },
      radius: 2,
      color: { alpha: 1, color: 'red' }
    };
    this.cw.shapes.drawCircle(mp);

    line.addSegment(segment);

    this.cw.shapes.drawLine(line);
  }

}
