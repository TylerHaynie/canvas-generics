import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { Vector } from '@canvas/objects/vector';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Size } from '@canvas/models/size';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { UI_EVENT_TYPE, MOUSE_STATE } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { RectangularElement } from '@canvas/user-interface/elements/rectangular-element';
import { CircularUIElement } from '@canvas/user-interface/elements/circular-element';

@Component({
  selector: 'app-scene03',
  templateUrl: './scene03.component.html',
  styleUrls: ['./scene03.component.css']
})
export class Scene03Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  // moving
  private isDragging = false;
  private dragOffset: Vector = new Vector(0, 0);

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.panningAllowed = false;
    this.cw.panZoomManager.scalingAllowed = false;
    this.cw.trackMouse = false;
    this.cw.overlayAsBackground = true;

    this.createTestUI();

    // start the draw loop
    this.cw.start();
  }

  draw() {

  }

  // testing
  private createTestUI() {
    this.defaultInteractiveSquare();
    // this.interactiveCircle();
    // this.interactiveRectangle();
  }

  defaultInteractiveSquare() {
    // create rectangle
    let nr = new RectangularElement(this.cw.drawingContext, new Vector(this.cw.width / 2, this.cw.height / 2));
    nr.cornerRadius = 8;

    // add to buffer
    this.cw.uiManager.addUIElement(nr);

    // listen for events
    nr.on(UI_EVENT_TYPE.DOWN, (e: MouseData) => {
      if (!this.isDragging) { this.isDragging = true; }
      this.cw.uiManager.mouseStateChange(MOUSE_STATE.GRAB);
      let elementPosition = nr.getposition();
      let dx = e.mousePosition.x - elementPosition.x;
      let dy = e.mousePosition.y - elementPosition.y;
      this.dragOffset = new Vector(dx, dy);
    });

    nr.on(UI_EVENT_TYPE.HOVER, (e: MouseData) => {
      this.showHoverContextMenu(e, nr);
    });

    nr.on(UI_EVENT_TYPE.UP, (e: MouseData) => {
      this.isDragging = false;
      this.cw.uiManager.mouseStateChange(MOUSE_STATE.DEFAULT);
    });

    nr.on(UI_EVENT_TYPE.LEAVE, (e: MouseData) => {
      this.isDragging = false;
      this.cw.uiManager.mouseStateChange(MOUSE_STATE.DEFAULT);
    });

    nr.on(UI_EVENT_TYPE.OUT, (e: MouseData) => {
      this.isDragging = false;
      this.cw.uiManager.mouseStateChange(MOUSE_STATE.DEFAULT);
    });

    nr.on(UI_EVENT_TYPE.MOVE, (e: MouseData) => {
      if (this.isDragging) {
        this.cw.uiManager.mouseStateChange(MOUSE_STATE.GRAB);
        let p = new Vector(e.mousePosition.x - this.dragOffset.x, e.mousePosition.y - this.dragOffset.y);

        nr.setPosition(p);
      }
      else {
        this.cw.uiManager.mouseStateChange(MOUSE_STATE.DEFAULT);
      }
    });

  }

  private showHoverContextMenu(e: MouseData, nr) {
    console.log(nr);
  }

  interactiveCircle() {
    // create a circle element for testing
    let ce = new CircularUIElement(this.cw.drawingContext, new Vector(525, 100));

    let ls = new LineStyle(2);
    ls.shade = '#f442d7';
    ce.defaultOutline = ls;

    ce.defaultColor = new Color('#333');
    ce.hoverColor = new Color('#7bd1cb');
    ce.downColor = new Color('#111');

    ce.on(UI_EVENT_TYPE.DOWN, (e: MouseData) => {
      // do something with your circle button
    });

    this.cw.uiManager.addUIElement(ce);
  }

  interactiveRectangle() {
    // create a rectangular element for testing
    let re = new RectangularElement(this.cw.drawingContext, new Vector(800, 250));
    re.cornerRadius = 8;

    let rls = new LineStyle(2);
    rls.shade = '#f442d7';
    re.defaultOutline = rls;

    re.defaultColor = new Color('#333');
    re.hoverColor = new Color('#7bd1cb');
    re.downColor = new Color('#111');

    re.on(UI_EVENT_TYPE.DOWN, (e: MouseData) => {

    });

    this.cw.uiManager.addUIElement(re);
  }

}
