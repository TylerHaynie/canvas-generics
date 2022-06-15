import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Vector2D, CanvasWrapper, Rectangle, QuadTree, Circle, RandomUtility, Boundary, MOUSE_EVENT_TYPE, MouseData, Color, Size, Line, LineSegment, LineStyle, QuadVector } from 'canvas-elements';

interface Ray {
  a: Vector2D;
  b: Vector2D;
}

@Component({
  selector: 'app-ray-test',
  templateUrl: './ray-test.component.html',
  styleUrls: ['./ray-test.component.css']
})
export class RayTestComponent implements AfterViewInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  private squares: Rectangle[] = [];
  private qtSquares: QuadTree;
  private focalPoint: Circle;
  private _random: RandomUtility = new RandomUtility();

  // mouse
  private mouseOnCanvas: boolean = false;
  private mousePosition: Vector2D;

  constructor() { }

  ngAfterViewInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });

    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;
    this.cw.panZoomManager.scalingAllowed = false;
    this.cw.overlayAsBackground = true;

    let b: Boundary = new Boundary(0, 0, 0, this.cw.width, this.cw.height, 0);
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
    this.focalPoint.color.setShade('lime');
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
      r.size.setSize(50, 50);
      r.color.setShade('#888');

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
      let quadData = new QuadVector(rect.position.x, rect.position.y, 0, rect);
      this.qtSquares.insert(quadData);
    });
  }

  castRay() {
    if (!this.mouseOnCanvas) { return; }

    // draw the source
    this.focalPoint.draw();

    // define line
    let line = new Line(this.cw.drawingContext);
    line.style.setShade('rgba(0, 255, 0, 1)');
    line.style.width = .25;

    let found: boolean = false;
    let seg = new LineSegment(this.focalPoint.position);

    let range = this.mousePosition.distanceTo(this.focalPoint.position);
    let p = new Vector2D(this.focalPoint.position.x - range, this.focalPoint.position.y - range);

    // draw light range
    let lr = new Rectangle(this.cw.drawingContext, p);
    lr.size.setSize(range * 2, range * 2);
    lr.color = undefined;
    let ls = new LineStyle();
    ls.width = .25;
    ls.setShade('yellow');
    lr.outline = ls;

    lr.draw();

    // search quad tree along line.
    // simplify results until you have the closest

    let b = new Boundary(this.focalPoint.position.x - range, this.focalPoint.position.y - range, 0, range * 2, range * 2, 0);
    let results = this.qtSquares.searchBoundary(b);

    // draw light range
    let debugREct = new Rectangle(this.cw.drawingContext, new Vector2D(b.x, b.y));
    debugREct.size.setSize(b.width, b.height);
    debugREct.color = undefined;
    let dls = new LineStyle();
    dls.width = .25;
    dls.setShade('red');
    debugREct.outline = dls;
    debugREct.draw();

    results.forEach(square => {
      let r = <Rectangle>square.data;
      r.color.setShade('pink');
    });

    // TODO: add squares to quadtree and search only where needed.
    // if ray intersects quad boundry, add that area to a search array then loop it all at once
    this.squares.forEach(square => {
      let intersection = square.lineIntersects({ p1: this.focalPoint.position, p2: this.mousePosition });
      if (intersection) {
        found = true;
        // add points to create line
        seg.addPoint(intersection);

        let ip = new Circle(this.cw.drawingContext, intersection);
        ip.radius = 4;
        ip.color.setShade('red');

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
