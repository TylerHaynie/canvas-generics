import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '../../lib/canvas/canvas-wrapper';
import { QuadTree, Boundry } from '../../lib/quadtree/quad-tree';
import { Vector } from '../../lib/canvas/objects/vector';
import { Rectangle } from '../../lib/canvas/shapes/rectangle';
import { Circle } from '../../lib/canvas/shapes/circle';
import { RayCastUtility } from '../../lib/canvas/utilities/raycast-utility';
import { Line } from '../../lib/canvas/shapes/line/line';
import { LineSegment } from '../../lib/canvas/shapes/line/line-segment';
import { Color } from '../../lib/canvas/models/color';
import { LineStyle } from '../../lib/canvas/models/line-style';
import { CanvasMouseEvent } from '../../lib/canvas/managers/mouse/canvas-mouse-event';

interface Ray {
  a: Vector;
  b: Vector;
}

@Component({
  selector: 'app-scene02',
  templateUrl: './scene02.component.html',
  styleUrls: ['./scene02.component.css']
})
export class Scene02Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  private squares: Rectangle[] = [];
  private qtSquares: QuadTree;
  private focalPoint: Circle;

    // mouse
    private mouseOnCanvas: boolean = false;
    private mousePosition: Vector;

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });

    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    let b: Boundry = new Boundry(0, 0, this.cw.width, this.cw.height);
    this.qtSquares = new QuadTree(b, 1);

    this.registerEvents();

    this.setFocalPoint();
    this.generateSquares();
    this.testLineIntersection();

    // start the draw loop
    this.cw.start();
  }

  private registerEvents() {
    this.cw.mouseManager.subscribe((e: CanvasMouseEvent) => {
      this.mouseChanged(e);
    });
  }

  private mouseChanged(e: CanvasMouseEvent) {
    this.mouseOnCanvas = e.mouseOnCanvas;
    this.mousePosition = e.mousePosition;
  }

  setFocalPoint() {
    this.focalPoint = new Circle(this.cw.drawingContext);
    this.focalPoint.position = new Vector(this.cw.width / 2, this.cw.height / 2);
    this.focalPoint.radius = 2;
    this.focalPoint.color = new Color('lime');
  }

  draw() {
    this.cw.saveContext();

    this.doSomething();

    this.cw.restoreContext();
  }

  generateSquares() {
    for (let x = 0; x < 10; x++) {
      let r = new Rectangle(this.cw.drawingContext);
      r.position = this.cw.random.randomVectorInBounds(this.cw.width, this.cw.height);
      r.size = { width: 30, height: 30 };
      r.color = new Color();
      r.color.shade = '#888';

      this.squares.push(r);
    }
  }

  doSomething() {

    this.drawSquares();
    this.drawMousePosition();
    this.castRay();
  }

  testLineIntersection() {
    let rcu: RayCastUtility = new RayCastUtility();

    // should return the intersection vector
    let pa = <Vector>{ x: 0, y: 0 };
    let pb = <Vector>{ x: 3, y: 3 };
    let pc = <Vector>{ x: 3, y: 0 };
    let pd = <Vector>{ x: 0, y: 3 };
    console.log(rcu.lineIntersects(pa, pb, pc, pd));

    // should be undefined
    let pa2 = <Vector>{ x: 0, y: 0 };
    let pb2 = <Vector>{ x: 3, y: 3 };
    let pc2 = <Vector>{ x: 3, y: 0 };
    let pd2 = <Vector>{ x: 6, y: 3 };
    console.log(rcu.lineIntersects(pa2, pb2, pc2, pd2));
  }

  drawSquares() {
    this.qtSquares.reset(this.cw.width, this.cw.height);

    this.squares.forEach(rect => {
      rect.draw();
      this.qtSquares.insert({ x: rect.position.x, y: rect.position.y, data: rect });
    });
  }

  drawMousePosition() {
    if (this.mouseOnCanvas) {
      let mp = new Circle(this.cw.drawingContext);
      mp.position = this.mousePosition;
      mp.radius = 2;
      mp.color = new Color('red');

      mp.draw();
    }
  }

  castRay() {
    if (!this.mouseOnCanvas) { return; }

    // draw the source
    this.focalPoint.draw();

    // define line
    let line = new Line(this.cw.drawingContext);
    line.style.shade = '#ffe70f';
    line.style.alpha = 1;
    line.style.lineWidth = .25;

    // add points to create line
    let seg = new LineSegment(this.focalPoint.position);
    seg.addPoint(this.mousePosition);

    // add segments to the line
    line.addSegment(seg);

    // draw the line
    line.draw();
  }

  //#region close
}
