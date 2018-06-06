import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { QuadTree, Boundary, QuadVector } from '../../lib/quadtree/quad-tree';
import { MouseEventType, UIEventType } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { Vector } from '@canvas/objects/vector';
import { LineStyle } from '@canvas/models/line-style';
import { Color } from '@canvas/models/color';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Size } from '@canvas/models/size';
import { CircularUIElement } from '@canvas/user-interface/elements/circular-element';
import { RectangularUIElement } from '@canvas/user-interface/elements/rectangular-element';

@Component({
  selector: 'app-scene03',
  templateUrl: './scene03.component.html',
  styleUrls: ['./scene03.component.css']
})
export class Scene03Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

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
    let ctx = this.cw.drawingContext;
    ctx.save();

    let p = new Vector(180, 180);
    let r = new Rectangle(this.cw.drawingContext, p);
    r.cornerRadius = 15;
    r.size = new Size(90, 90);
    r.color = new Color();
    r.draw();

    ctx.restore();
  }

  // testing
  private createTestUI() {

    // create a circle element for testing
    let ce = new CircularUIElement(this.cw.drawingContext, new Vector(525, 100));

    let ls = new LineStyle(2);
    ls.shade = '#f442d7';
    ce.defaultOutline = ls;

    ce.defaultColor = new Color('#333');
    ce.hoverColor = new Color('#7bd1cb');
    ce.downColor = new Color('#111');

    ce.on(UIEventType.DOWN, () => {
      // do something with your button
    });

    this.cw.uiManager.addUIElement(ce);


    // create a rectangular element for testing
    let re = new RectangularUIElement(this.cw.drawingContext, new Vector(800, 250));
    re.cornerRadius = 8;

    let rls = new LineStyle(2);
    rls.shade = '#f442d7';
    re.defaultOutline = rls;

    re.defaultColor = new Color('#333');
    re.hoverColor = new Color('#7bd1cb');
    re.downColor = new Color('#111');

    re.on(UIEventType.DOWN, () => {
      // do something with your button
    });

    this.cw.uiManager.addUIElement(re);
  }

}
