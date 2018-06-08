import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Vector } from '@canvas/objects/vector';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { Rectangle } from '@canvas/shapes/rectangle';
import { QuadTree, Boundary } from '../../lib/quadtree/quad-tree';
import { Circle } from '@canvas/shapes/circle';
import { MOUSE_EVENT_TYPE } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { Color } from '@canvas/models/color';
import { RayCastUtility } from '@canvas/utilities/raycast-utility';
import { Line } from '@canvas/shapes/line/line';
import { LineSegment } from '@canvas/shapes/line/line-segment';

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
    this.cw.panZoomManager.panningAllowed = true;

    let b: Boundary = new Boundary(0, 0, this.cw.width, this.cw.height);
    this.qtSquares = new QuadTree(b, 1);

    this.registerEvents();

    this.setFocalPoint();
    this.generateSquares();
    this.testLineIntersection();

    // start the draw loop
    this.cw.start();
  }

  private registerEvents() {
    this.cw.mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e: MouseData) => {
      this.mouseChanged(e);
    });
  }

  private mouseChanged(e: MouseData) {
    this.mouseOnCanvas = e.mouseOnCanvas;
    this.mousePosition = e.mousePosition;
  }

  setFocalPoint() {
    let p = new Vector(this.cw.width / 2, this.cw.height / 2);
    this.focalPoint = new Circle(this.cw.drawingContext, p);
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
      let p = this.cw.random.randomVectorInBounds(this.cw.width, this.cw.height);
      let r = new Rectangle(this.cw.drawingContext, p);
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
      let mp = new Circle(this.cw.drawingContext, this.mousePosition);
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
    line.style.width = .25;

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
