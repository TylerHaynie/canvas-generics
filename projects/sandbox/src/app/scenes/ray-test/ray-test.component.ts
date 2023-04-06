// import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { Vector, CanvasEngine, Rectangle, QuadTree, RandomUtility, Boundary, MOUSE_EVENT_TYPE, MouseEventData, Color, Line, LineSegment, LineStyle, QuadVector } from 'canvas-elements';

// interface Ray {
//   a: Vector;
//   b: Vector;
// }

// @Component({
//   selector: 'app-ray-test',
//   templateUrl: './ray-test.component.html',
//   styleUrls: ['./ray-test.component.css']
// })
// export class RayTestComponent implements AfterViewInit {
//   @ViewChild('c') canvasRef: ElementRef;
//   private cw: CanvasEngine;

//   private squares: Rectangle[] = [];
//   private qtSquares: QuadTree;
//   private focalPoint: Circle;

//   // mouse
//   private mouseOnCanvas: boolean = false;
//   private mousePosition: Vector;

//   constructor() { }

//   ngAfterViewInit() {
//     // this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'));

//     // this.cw.panZoomManager.minScale = 1;
//     // this.cw.panZoomManager.panningAllowed = false;
//     // this.cw.panZoomManager.scalingAllowed = false;
//     // this.cw.gridAsBackground = true;

//     // let b: Boundary = new Boundary(0, 0, 0, this.cw.width, this.cw.height, 0);
//     // this.qtSquares = new QuadTree(b, 1);

//     // this.registerEvents();

//     // this.setFocalPoint();
//     // this.generateSquares();

//     // // this.cw.addToTick(this);
//     // this.cw.addToDraw(this);

//     // // start the draw loop
//     // this.cw.start();
//   }

//   private registerEvents() {
//     this.cw.mouseManager.on(MOUSE_EVENT_TYPE.MOVE, (e: MouseEventData) => {
//       this.mouseChanged(e);
//     });
//   }

//   private mouseChanged(e: MouseEventData) {
//     this.mouseOnCanvas = e.mouseOnCanvas;
//     this.mousePosition = e.mousePosition;
//   }

//   setFocalPoint() {
//     let p = new Vector(this.cw.canvasWidth / 2, this.cw.canvasHeight / 2);
//     this.focalPoint = new Circle(p);
//     this.focalPoint.radius = 4;
//     this.focalPoint.color.setShade('lime');
//   }

//   draw() {
//     // this.cw.saveContext();
//     // this.doSomething();
//     // this.cw.restoreContext();
//   }

//   generateSquares() {
//     for (let x = 0; x < 50; x++) {
//       let p = RandomUtility.randomVectorInBounds(this.cw.canvasWidth, this.cw.canvasHeight);
//       let r = new Rectangle(p);
//       // r.size.setSize(50, 50);
//       // r.color.setShade('#888');

//       this.squares.push(r);
//     }
//   }

//   doSomething() {
//     this.drawSquares();
//     this.castRay();
//   }

//   drawSquares() {
//     // this.qtSquares.reset(this.cw.width, this.cw.height);

//     // this.squares.forEach(rect => {
//     //   rect.draw(this.cw.drawingContext);
//     //   let quadData = new QuadVector(rect.position.x, rect.position.y, 0, rect);
//     //   this.qtSquares.insert(quadData);
//     // });
//   }

//   castRay() {
//     // if (!this.mouseOnCanvas) { return; }

//     // // draw the source
//     // this.focalPoint.draw(this.cw.drawingContext);

//     // // define line
//     // let line = new Line();
//     // line.style.setShade('rgba(0, 255, 0, 1)');
//     // line.style.width = .25;

//     // let seg = new LineSegment(this.focalPoint.position);

//     // let range = this.mousePosition.distanceTo(this.focalPoint.position);
//     // let p = new Vector(this.focalPoint.position.x - range, this.focalPoint.position.y - range);

//     // // draw light range
//     // let lr = new Rectangle(p);
//     // lr.size.setSize(range * 2, range * 2);
//     // lr.color = undefined;
//     // let ls = new LineStyle();
//     // ls.width = .25;
//     // ls.setShade('yellow');
//     // lr.outline = ls;

//     // lr.draw(this.cw.drawingContext);

//     // // search quad tree along line.
//     // // simplify results until you have the closest

//     // let b = new Boundary(this.focalPoint.position.x - range, this.focalPoint.position.y - range, 0, range * 2, range * 2, 0);
//     // let results = this.qtSquares.searchBoundary(b);

//     // // draw light range
//     // let debugREct = new Rectangle(new Vector(b.x, b.y));
//     // debugREct.size.setSize(b.width, b.height);
//     // debugREct.color = undefined;
//     // let dls = new LineStyle();
//     // dls.width = .25;
//     // dls.setShade('red');
//     // debugREct.outline = dls;
//     // debugREct.draw(this.cw.drawingContext);

//     // results.forEach(square => {
//     //   let r = <Rectangle>square.data;
//     //   r.color.setShade('pink');
//     // });

//     // // TODO: add squares to quadtree and search only where needed.
//     // // if ray intersects quad boundry, add that area to a search array then loop it all at once
//     // this.squares.forEach(square => {
//     //   let intersection = square.lineIntersects({ p1: this.focalPoint.position, p2: this.mousePosition });
//     //   if (intersection) {
//     //     // add points to create line
//     //     seg.addPoint(intersection);

//     //     let ip = new Circle(intersection);
//     //     ip.radius = 4;
//     //     ip.color.setShade('red');

//     //     ip.draw(this.cw.drawingContext);
//     //   }
//     // });

//     // // add segments to the line
//     // line.addSegment(seg);

//     // // draw the line
//     // line.draw(this.cw.drawingContext);
//   }

//   //#region close
// }
