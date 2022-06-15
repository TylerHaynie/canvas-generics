import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CanvasWrapper, Color, ElementCircle, ElementRect, LineStyle, MouseData, Size, UI_EVENT_TYPE, Vector2D } from 'canvas-elements';

@Component({
  selector: 'app-element-test',
  templateUrl: './element-test.component.html',
  styleUrls: ['./element-test.component.css']
})
export class ElementTestComponent implements AfterViewInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  // moving
  private isDragging = false;
  private dragOffset: Vector2D = new Vector2D(0, 0);

  constructor() { }

  ngAfterViewInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.panningAllowed = false;
    this.cw.panZoomManager.scalingAllowed = false;
    this.cw.trackMouse = false;
    this.cw.overlayAsBackground = false;
    this.cw.uiManager.debugEnabled = true;

    this.createTestUI();

    // start the draw loop
    this.cw.start();
  }

  private draw() {

  }

  // testing
  private createTestUI() {
    this.createTestRect();
    // this.circleButton();
    // this.rectangleButton();
  }

  private createTestRect() {
    // create rectangle
    let rect = new ElementRect(this.cw.drawingContext, new Vector2D(600, 300));
    rect.size.setSize(200, 100);
    rect.endGap = 8;
    rect.isDraggable = true;

    // add to buffer
    this.cw.uiManager.addUIElement(rect);
  }

  private circleButton() {
    // create a circle element for testing
    let ce = new ElementCircle(this.cw.drawingContext, new Vector2D(525, 100));
    ce.isDraggable = false;
    let ls = new LineStyle('#f442d7', 2);
    ce.defaultOutline = ls;

    ce.defaultColor = new Color('#333');
    ce.hoverColor = new Color('#7bd1cb');
    ce.downColor = new Color('#111');

    ce.on(UI_EVENT_TYPE.DOWN, (e: MouseData) => {
      // do something with your circle button
    });

    this.cw.uiManager.addUIElement(ce);
  }

  private rectangleButton() {
    // create a rectangular element for testing
    let re = new ElementRect(this.cw.drawingContext, new Vector2D(800, 250));
    re.isDraggable = false;
    re.endGap = 8;

    let rls = new LineStyle('#f442d7', 2);
    re.defaultOutline = rls;

    re.defaultColor = new Color('#333');
    re.hoverColor = new Color('#7bd1cb');
    re.downColor = new Color('#111');

    re.on(UI_EVENT_TYPE.DOWN, (e: MouseData) => {

    });

    this.cw.uiManager.addUIElement(re);
  }

}
