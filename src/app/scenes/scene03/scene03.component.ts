import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { Vector } from '@canvas/objects/vector';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Size } from '@canvas/models/size';
import { Color } from '@canvas/models/color';
import { LineStyle } from '@canvas/models/line-style';
import { UIEventType } from '@canvas/events/canvas-event-types';
import { CircularUIElement } from '@canvas/elements/circular-element';
import { RectangularUIElement } from '@canvas/elements/rectangular-element';
import { MouseData } from '@canvas/events/event-data';

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
    this.interactiveCircle();
    this.interactiveRectangle();
  }

  defaultInteractiveSquare() {
    // create rectangle
    let nr = new RectangularUIElement(this.cw.drawingContext, new Vector(this.cw.width / 2, this.cw.height / 2));
    nr.cornerRadius = 8;

    // add to buffer
    this.cw.uiManager.addUIElement(nr);

    // listen for events
    nr.on(UIEventType.DOWN, (e: MouseData) => {
      if (!this.isDragging) { this.isDragging = true; }

      let elementPosition = nr.getposition();
      let dx = e.mousePosition.x - elementPosition.x;
      let dy = e.mousePosition.y - elementPosition.y;
      this.dragOffset = new Vector(dx, dy);
    });

    nr.on(UIEventType.UP, (e: MouseData) => {
      this.isDragging = false;
    });

    nr.on(UIEventType.LEAVE, (e: MouseData) => {
      this.isDragging = false;
    });

    nr.on(UIEventType.OUT, (e: MouseData) => {
      this.isDragging = false;
    });

    nr.on(UIEventType.MOVE, (e: MouseData) => {
      if (this.isDragging) {
        let p = new Vector(e.mousePosition.x - this.dragOffset.x, e.mousePosition.y - this.dragOffset.y);

        nr.setPosition(p);
      }
    });

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

    ce.on(UIEventType.DOWN, (e: MouseData) => {
      // do something with your circle button
    });

    this.cw.uiManager.addUIElement(ce);
  }

  interactiveRectangle() {
    // create a rectangular element for testing
    let re = new RectangularUIElement(this.cw.drawingContext, new Vector(800, 250));
    re.cornerRadius = 8;

    let rls = new LineStyle(2);
    rls.shade = '#f442d7';
    re.defaultOutline = rls;

    re.defaultColor = new Color('#333');
    re.hoverColor = new Color('#7bd1cb');
    re.downColor = new Color('#111');

    re.on(UIEventType.DOWN, (e: MouseData) => {
      // do something with your rectangle button
    });

    this.cw.uiManager.addUIElement(re);
  }

}
