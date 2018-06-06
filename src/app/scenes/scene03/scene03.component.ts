import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '@canvas/canvas-wrapper';
import { CollisionUtility } from '@canvas/utilities/collision-utility';
import { QuadTree, Boundary, QuadVector } from '../../lib/quadtree/quad-tree';
import { CanvasUIElement } from '@canvas/user-interface/canvas-ui-element';
import { MouseEventType, UIEventType } from '@canvas/events/canvas-event-types';
import { MouseData } from '@canvas/events/event-data';
import { Vector } from '@canvas/objects/vector';
import { LineStyle } from '@canvas/models/line-style';
import { Color } from '@canvas/models/color';
import { Rectangle } from '@canvas/shapes/rectangle';
import { Size } from '@canvas/models/size';

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

    // this.createTestUI();

    // start the draw loop
    this.cw.start();
  }

  draw() {
    let ctx = this.cw.drawingContext;
    ctx.save();

    let r = new Rectangle(this.cw.drawingContext);
    r.position = new Vector(50, 50);
    r.size = new Size(100, 100);
    r.color = new Color();
    r.draw();

    ctx.restore();
  }

  // testing
  private createTestUI() {

    // create a canvas element for testing
    let b = new CanvasUIElement(this.cw.drawingContext, new Vector(100, 100));
    b.radius = 25;

    let ls = new LineStyle(2);
    ls.shade = '#f442d7';
    b.outline = ls;

    b.color = new Color('#333');
    b.hoverColor = new Color('#7bd1cb');
    b.downColor = new Color('#111');

    b.on(UIEventType.DOWN, () => {
      // do something with your button
    });

    this.cw.uiManager.addUIElement(b);
  }

}
