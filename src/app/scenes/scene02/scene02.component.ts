import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Vector2D } from '@canvas/objects/vector';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { Rectangle } from '@canvas/shapes/rectangle';
import { QuadTree, Boundary, QuadData } from '../../lib/quadtree/quad-tree';
import { Circle } from '@canvas/shapes/circle';
import { MOUSE_EVENT_TYPE } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { Color } from '@canvas/models/color';
import { RayCastUtility } from '@canvas/utilities/raycast-utility';
import { Line } from '@canvas/shapes/line/line';
import { LineSegment } from '@canvas/shapes/line/line-segment';
import { RandomUtility } from '@canvas/utilities/random-utility';
import { Size } from '@canvas/models/size';
import { LineStyle } from '@canvas/models/line-style';

interface Ray {
  a: Vector2D;
  b: Vector2D;
}

@Component({
  selector: 'app-scene02',
  templateUrl: './scene02.component.html',
  styleUrls: ['./scene02.component.css']
})
export class Scene02Component implements OnInit {
  @ViewChild('c', { static: true }) canvasRef: ElementRef;
  private cw: CanvasWrapper;

  private squares: Rectangle[] = [];
  private qtSquares: QuadTree;
  private focalPoint: Circle;
  private _random: RandomUtility = new RandomUtility();

  // mouse
  private mouseOnCanvas: boolean = false;
  private mousePosition: Vector2D;

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });

    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;
    this.cw.panZoomManager.scalingAllowed = false;
    this.cw.overlayAsBackground = true;

    let b: Boundary = new Boundary(0, 0, this.cw.width, this.cw.height);
    this.qtSquares = new QuadTree(b, 1);

    this.registerEvents();

    this.setFocalPoint();
    this.generateSquares();

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
    let p = new Vector2D(this.cw.width / 2, this.cw.height / 2);
    this.focalPoint = new Circle(this.cw.drawingContext, p);
    this.focalPoint.radius = 4;
    this.focalPoint.color = new Color('lime');
  }

  draw() {
    this.cw.saveContext();
    this.doSomething();
    this.cw.restoreContext();
  }

  generateSquares() {
    for (let x = 0; x < 50; x++) {
      let p = this._random.randomVectorInBounds(this.cw.width, this.cw.height);
      let r = new Rectangle(this.cw.drawingContext, p);
      r.size = new Size(50, 50);
      r.color = new Color();
      r.color.shade = '#888';

      this.squares.push(r);
    }
  }

  doSomething() {
    this.drawSquares();
    this.castRay();
  }

  drawSquares() {
    this.qtSquares.reset(this.cw.width, this.cw.height);

    this.squares.forEach(rect => {
      rect.draw();
      let quadData = new QuadData(rect.position.x, rect.position.y, rect, rect.size);
      this.qtSquares.insert(quadData);
    });
  }

  castRay() {
    if (!this.mouseOnCanvas) { return; }

    // draw the source
    this.focalPoint.draw();

    // define line
    let line = new Line(this.cw.drawingContext);
    line.style.shade = 'rgba(0, 255, 0, 1)';
    line.style.width = .25;

    let found: boolean = false;
    let seg = new LineSegment(this.focalPoint.position);


    let range = this.mousePosition.distance(this.focalPoint.position);
    let p = new Vector2D(this.focalPoint.position.x - range, this.focalPoint.position.y - range);

    // draw light range
    let lr = new Rectangle(this.cw.drawingContext, p);
    lr.size = new Size(range * 2, range * 2);
    lr.color = undefined;
    let ls = new LineStyle();
    ls.width = .25;
    ls.shade = 'yellow';
    lr.outline = ls;

    lr.draw();

    // search quad tree along line.
    // simplify results until you have teh closest

    let b = new Boundary(this.focalPoint.position.x - range, this.focalPoint.position.y - range, range * 2, range * 2);
    let results = this.qtSquares.searchBoundary(b);

    // draw light range
    let debugREct = new Rectangle(this.cw.drawingContext, new Vector2D(b.x, b.y));
    debugREct.size = new Size(b.w, b.h);
    debugREct.color = undefined;
    let dls = new LineStyle();
    dls.width = .25;
    dls.shade = 'red';
    debugREct.outline = dls;
    debugREct.draw();

    results.forEach(square => {
      let r = <Rectangle>square.data;
      r.color = new Color('pink');
    });

    // checking every square
    this.squares.forEach(square => {
      let intersection = square.lineIntersects({ p1: this.focalPoint.position, p2: this.mousePosition });
      if (intersection) {
        found = true;
        // add points to create line
        seg.addPoint(intersection);

        let ip = new Circle(this.cw.drawingContext, intersection);
        ip.radius = 4;
        ip.color = new Color('red');

        ip.draw();
      }

    });

    // used before I added screen bounds to the intersection check
    // if (!found) {
    //   let ip = new Circle(this.cw.drawingContext, this.mousePosition);
    //   ip.radius = 4;
    //   ip.color = new Color('red');

    //   ip.draw();
    //   seg.addPoint(this.mousePosition);
    // }

    // add segments to the line
    line.addSegment(seg);

    // draw the line
    line.draw();
  }

  //#region close
}