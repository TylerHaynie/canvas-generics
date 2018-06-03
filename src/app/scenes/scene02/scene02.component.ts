import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '../../lib/canvas/canvas-wrapper';
import { iRectangle } from '../../lib/canvas/interfaces/iRectangle';
import { iCircle } from '../../lib/canvas/interfaces/iCircle';
import { Line } from '../../lib/canvas/objects/line/line';
import { LineSegment } from '../../lib/canvas/objects/line/line-segment';
import { QuadTree, Boundry } from '../../lib/quadtree/quad-tree';
import { iVector } from '../../lib/canvas/interfaces/iVector';

interface Ray {
  a: iVector;
  b: iVector;
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
  private focalvector: iCircle;

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    let b: Boundry = new Boundry(0, 0, this.cw.width, this.cw.height);
    this.qtSquares = new QuadTree(b, 1);

    this.setFocalvector();
    this.generateSquares();

    this.testLineIntersection();

    // start the draw loop
    this.cw.start();
  }

  setFocalvector() {
    this.focalvector = <iCircle>{
      vector: { x: this.cw.width / 2, y: this.cw.height / 2 },
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
        vector: this.cw.random.randomvectorInBounds(this.cw.width, this.cw.height),
        size: { width: 30, height: 30 },
        color: { color: '#888', alpha: 1 }
      });
    }
  }

  doSomething() {

    this.drawSquares();
    this.drawMousePosition();
    this.drawFocalvector();
    this.castRay();
  }

  testLineIntersection() {
    // should be true
    let pa = <iVector>{ x: 0, y: 0 };
    let pb = <iVector>{ x: 3, y: 3 };
    let pc = <iVector>{ x: 3, y: 0 };
    let pd = <iVector>{ x: 0, y: 3 };

    console.log(this.cw.vector.lineIntersects(pa, pb, pc, pd));

    // should be false
    let pa2 = <iVector>{ x: 0, y: 0 };
    let pb2 = <iVector>{ x: 3, y: 3 };
    let pc2 = <iVector>{ x: 3, y: 0 };
    let pd2 = <iVector>{ x: 6, y: 3 };

    console.log(this.cw.vector.lineIntersects(pa2, pb2, pc2, pd2));
  }

  drawSquares() {

    this.qtSquares.reset(this.cw.width, this.cw.height);

    this.squares.forEach(square => {
      this.cw.shape.drawRectangle(square);
      this.qtSquares.insert({ x: square.vector.x, y: square.vector.y, data: square });
    });
  }

  drawMousePosition() {
    let mm = this.cw.mouseManager;
    if (!mm.mouseOffCanvas) {
      let mp = <iCircle>{
        vector: { x: mm.mouseX, y: mm.mouseY },
        radius: 2,
        color: {
          alpha: 1,
          color: 'red'
        }
      };

      this.cw.shape.drawCircle(mp);
    }
  }

  drawFocalvector() {
    this.cw.shape.drawCircle(this.focalvector);
  }

  castRay() {
    let mm = this.cw.mouseManager;

    // draw line
    let line: Line = new Line();
    line.color = 'red';
    line.lineWidth = .5;
    line.alpha = 1;

    let segment = new LineSegment(this.focalvector.vector);

    // check for intersection
    // some vector along the line
    let bounds: Boundry = new Boundry(this.focalvector.vector.x, this.focalvector.vector.y, 30, 30);

    // first find the slope
    let slope = this.cw.vector.findSlope({ x: bounds.x, y: bounds.y }, { x: mm.mouseX, y: mm.mouseY });

    // now find the slope-intercept (y-intercept)
    let mx = (slope * mm.mouseX);
    let b = mm.mouseY - mx;
    let y = mx + b;

    // nailed it!
    segment.addVector({ x: mm.mouseX, y: y });

    // draw a little circle where it ends
    let mp = <iCircle>{
      vector: { x: mm.mouseX, y: y },
      radius: 2,
      color: { alpha: 1, color: 'red' }
    };
    this.cw.shape.drawCircle(mp);

    // let t = Math.ta arctan(m);
    // let xnew = mm.mouseX + Math.cos(t);
    // let ynew = y + Math.sin(t);

    let xNew = mm.mouseX + (1 / Math.sqrt(1 + Math.pow(slope, 2)));
    let ynew = y + (slope / Math.sqrt(1 + Math.pow(slope, 2)));

    // draw a little circle where it ends
    let mp2 = <iCircle>{
      vector: { x: xNew, y: ynew },
      radius: 2,
      color: { alpha: 1, color: 'red' }
    };
    this.cw.shape.drawCircle(mp2);


    line.addSegment(segment);

    this.cw.shape.drawLine(line);
  }

}
