import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import {
  CanvasEngine, Color, ColorUtility,
  ICanvasComponent, RandomUtility, Rectangle,
  Size, Vertex
} from 'canvas-elements';

@Component({
  selector: 'app-movement-test',
  templateUrl: './movement-test.component.html',
  styleUrls: ['./movement-test.component.css']
})
export class MovementTestComponent implements AfterViewInit, ICanvasComponent {
  @ViewChild('c') canvasRef: ElementRef;
  private engine: CanvasEngine;
  private _numUtil: RandomUtility = new RandomUtility();
  private _colorUtil: ColorUtility = new ColorUtility();

  // inputs
  private testCubeCount: number = 5;

  constructor(private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) { }

  ngAfterViewInit() {
    var renderCanvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.engine = new CanvasEngine(renderCanvas, this);
    this.engine.start();
  }

  // called when engine starts
  async startup(): Promise<void> {
    this.createTestShapes();
  }

  // called on each physics tick
  async tick(delta: number) {

  }

  // called when a component is deleted
  async dispose() {

  }

  private createTestShapes() {
    for (let i = 0; i < this.testCubeCount; i++) {
      let size = new Size(
        this._numUtil.randomNumberBetween(50, 300),
        this._numUtil.randomNumberBetween(50, 300));

      let pos = new Vertex(
        this._numUtil.randomNumberBetween(0, this.engine.canvasWidth - size.width),
        this._numUtil.randomNumberBetween(0, this.engine.canvasHeight - size.height),
        this._numUtil.randomNumberBetween(1, 10));

      let shape = new Rectangle(pos);
      shape.size.setSize(size.width, size.height);

      shape.color = new Color(this._colorUtil.randomColor());

      this.engine.renderManager.addShape(shape);
    }
  }

}
