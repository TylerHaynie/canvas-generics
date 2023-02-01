import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CanvasWrapper, Color, ColorUtility, ElementRect, RandomUtility, Rectangle, Size, Vector } from 'canvas-elements';

@Component({
  selector: 'app-movement-test',
  templateUrl: './movement-test.component.html',
  styleUrls: ['./movement-test.component.css']
})
export class MovementTestComponent implements AfterViewInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;
  private _numUtil: RandomUtility = new RandomUtility();
  private _colorUtil: ColorUtility = new ColorUtility();

  // inputs
  private testCubeCount: number = 5000;

  constructor() {

  }

  ngAfterViewInit() {
    var renderTarget = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.cw = new CanvasWrapper(renderTarget.getContext('2d'));

    this.register();
  }

  // should be called from canvas wrapper or render manager when engine starts
  public register(): void {
    this.createTestShapes();

    // TODO: Should register self with canvas wrapper/rendering manager
    // From there, call a startup/register method on this component
    this.cw.start();
  }

  // called on each frame render
  public update(): void {

  }

  // called when a component is deleted
  public dispose(): void {

  }

  private createTestShapes() {
    for (let i = 0; i < this.testCubeCount; i++) {
      let size = new Size(
        this._numUtil.randomNumberBetween(50, 300),
        this._numUtil.randomNumberBetween(50, 300));

      let pos = new Vector(
        this._numUtil.randomNumberBetween(0, this.cw.width - size.width),
        this._numUtil.randomNumberBetween(0, this.cw.height - size.height),
        this._numUtil.randomNumberBetween(1, 10));

      let shape = new Rectangle(pos);
      shape.size.setSize(size.width, size.height);

      shape.color = new Color(this._colorUtil.randomColor());

      this.cw.renderManager.addShape(shape);
    }
  }

}
