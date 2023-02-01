import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CanvasWrapper, ElementRect, Vector2D } from 'canvas-elements';

@Component({
  selector: 'app-movement-test',
  templateUrl: './movement-test.component.html',
  styleUrls: ['./movement-test.component.css']
})
export class MovementTestComponent implements AfterViewInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  constructor() { }

  ngAfterViewInit() {
    var renderTarget = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.cw = new CanvasWrapper(renderTarget.getContext('2d'));
    this.cw.renderManager.debugEnabled = true;

    this.register();
  }

  // should be called from canvas wrapper or render manager when engine starts
  public register(): void {
    this.createTestRect();

    // TODO: Should register self with canvas wrapper/rendering manager
    // From there, call a startup/register method on this component
    this.cw.start();
  }

  // called on each frame render
  public update(): void{

  }

  // called when a component is deleted
  public dispose(): void{

  }

  private createTestRect() {
    // create rectangle
    let rect = new ElementRect(new Vector2D(600, 300));
    rect.size.setSize(200, 100);
    rect.isDraggable = true;

    // TODO: I should just be able to add the rect without knowing about rendermanager or context.
    // this.cw.addElement(rect);

    // add to buffer
    this.cw.renderManager.addUIElement(this.cw.drawingContext, rect);
  }

}
