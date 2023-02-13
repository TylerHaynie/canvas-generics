import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  CanvasEngine, CanvasShader, ColorUtility,
  ICanvasComponent, PolygonRenderReference, RandomUtility, Vertex
} from 'canvas-elements';
import { Rectangle as PolyRect } from 'projects/canvas-elements/src/lib/canvas/geometry/basic-polygons/rectangle';

@Component({
  selector: 'app-polygon-test',
  templateUrl: './polygon-test.component.html',
  styleUrls: ['./polygon-test.component.css']
})
export class PolygonTestComponent implements AfterViewInit, ICanvasComponent {
  @ViewChild('c') canvasRef: ElementRef;
  private engine: CanvasEngine;
  private _numUtil: RandomUtility = new RandomUtility();

  private _myPolyReferences: PolygonRenderReference[] = [];

  // inputs
  private testCubeCount: number = 1000;

  constructor() { }

  ngAfterViewInit() {
    var renderCanvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.engine = new CanvasEngine(renderCanvas, this);
    this.engine.start();
  }

  // called when engine starts
  async startup(): Promise<void> {
    this.createTestPoly();
  }

  // called on each physics tick
  async tick(delta: number) {

  }

  // called when a component is deleted
  async dispose() {

  }

  private createTestPoly() {
    let testShader = new CanvasShader();
    testShader.edgeColor.setShade("#ff0000");
    testShader.faceColor.setShade("#333");

    for (let i = 0; i < this.testCubeCount; i++) {
      let size = new Vertex(
        this._numUtil.randomNumberBetween(10, 50),
        this._numUtil.randomNumberBetween(10, 50));

      let pos = new Vertex(
        this._numUtil.randomNumberBetween(size.x / 2, this.engine.canvasWidth - size.x / 2),
        this._numUtil.randomNumberBetween(size.y / 2, this.engine.canvasHeight - size.y / 2),
        this._numUtil.randomNumberBetween(1, 10));

      let poly = new PolyRect(pos, size);
      let ref = this.engine.renderManager.addPolygon(poly, testShader);
      this._myPolyReferences.push(ref);
    }
  }
}