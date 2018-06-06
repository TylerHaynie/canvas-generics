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

@Component({
  selector: 'app-scene03',
  templateUrl: './scene03.component.html',
  styleUrls: ['./scene03.component.css']
})
export class Scene03Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  public set enableUI(v: boolean) { this.uiEnabled = v; }

  //#region Private Properites

  private cw: CanvasWrapper;
  private collision: CollisionUtility;

  // quads
  private elementQuad: QuadTree;
  private uiElements: CanvasUIElement[] = [];

  private uiEnabled: boolean = true;
  private uiBuffer: [{ callback: () => void }];
  private mainBuffer: [{ callback: () => void }];
  private debugBuffer: [{ callback: () => void }];

  //#endregion

  constructor() { }

  ngOnInit() {
    this.collision = new CollisionUtility();
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.panningAllowed = false;
    this.cw.panZoomManager.scalingAllowed = false;
    this.cw.trackMouse = false;

    this.registerEvents();
    this.createUI();

    // start the draw loop
    this.cw.start();
  }

  private registerEvents() {
    this.cw.mouseManager.on(MouseEventType.MOVE, (e: MouseData) => {
      if (this.uiEnabled) {
        this.checkPointerOver(e);
      }
    });

    this.cw.mouseManager.on(MouseEventType.DOWN, (e: MouseData) => {
      if (this.uiEnabled) {
        this.checkPointerDown(e);
      }
    });

    this.cw.mouseManager.on(MouseEventType.UP, (e: MouseData) => {
      if (this.uiEnabled) {
        this.checkPointerUp(e);
      }
    });
  }

  private clearUIElements() {
    this.uiElements = undefined;
  }

  private removeUIButton(button: CanvasUIElement) {
    let bi = this.uiElements.indexOf(button);
    this.uiElements.splice(bi, 1);

    this.rebuildUI();
  }

  private rebuildUI() {
    let b = this.cw.bounds;
    let bounds = new Boundary(b.left, b.top, b.width, b.height);

    if (this.elementQuad) {
      this.elementQuad.reset(bounds.w, bounds.h);
    }
    else {
      this.elementQuad = new QuadTree(bounds, 1);
    }

    this.uiElements.forEach(element => {
      this.addUIElement(element);
    });
  }

  private addUIElement(element: CanvasUIElement) {
    this.uiElements.push(element);
    this.addToUiBuffer(() => element.draw());
    this.elementQuad.insert(new QuadVector(element.position.x, element.position.y, element));
  }

  //#region Drawing

  private draw() {
    this.drawMainBuffer();

    if (this.uiEnabled) {
      this.drawUiBuffer();
    }

    this.drawDebugBuffer();
  }

  //#endregion

  //#region Buffers

  private addToMainBuffer(callback: () => void) {
    if (!this.mainBuffer) {
      this.mainBuffer = [{ callback: callback }];
    }
    else {
      this.mainBuffer.push({ callback: callback });
    }
  }

  private drawMainBuffer() {
    if (this.mainBuffer) {
      this.mainBuffer.forEach(buffer => {
        buffer.callback();
      });

      // clear main after every draw
      this.clearMainBuffer();
    }
  }

  private clearMainBuffer() {
    this.mainBuffer = undefined;
  }

  private addToUiBuffer(callback: () => void) {
    if (!this.uiBuffer) {
      this.uiBuffer = [{ callback: callback }];
    }
    else {
      this.uiBuffer.push({ callback: callback });
    }
  }

  private drawUiBuffer() {
    if (this.uiBuffer) {
      this.uiBuffer.forEach(buffer => {
        buffer.callback();
      });

      // TODO: only clear UI buffer when it not being shown
    }
  }

  private clearUiBuffer() {
    this.uiBuffer = undefined;
  }

  private addToDeubgBuffer(callback: () => void) {
    if (!this.debugBuffer) {
      this.debugBuffer = [{ callback: callback }];
    }
    else {
      this.debugBuffer.push({ callback: callback });
    }
  }

  private drawDebugBuffer() {
    if (this.debugBuffer) {
      this.debugBuffer.forEach(buffer => {
        buffer.callback();
      });
    }

    // I think debug should have to be updated every frame
    this.clearDebugBuffer();
  }

  private clearDebugBuffer() {
    this.debugBuffer = undefined;
  }

  //#endregion

  //#region User Interface

  private createUI() {

    // create a canvas element for testing
    let b = new CanvasUIElement(this.cw.drawingContext, new Vector(100, 100));
    b.radius = 25;

    let ls = new LineStyle(2);
    ls.shade = '#f442d7';
    b.outline = ls;

    b.color = new Color('#333');
    b.hoverColor = new Color('#7bd1cb');
    b.downColor = new Color('#111');

    // TODO: now creat a button off of a UI element

    b.on(UIEventType.DOWN, () => {
      // do something with your button
    });

    this.uiElements.push(b);
    this.rebuildUI();
  }

  private checkPointerOver(e: MouseData) {
    let mp = e.mousePosition;
    let cu = this.collision;

    this.uiElements.forEach(element => {
      if (cu.checkRadiusCollision(mp, 1, element.position, element.radius)) {
        element.buttonHover();
      }
      else {
        element.buttonleave();
      }
    });
  }

  private checkPointerDown(e: MouseData) {
    let mp = e.mousePosition;
    let cu = this.collision;

    this.uiElements.forEach(element => {
      if (cu.checkRadiusCollision(mp, 1, element.position, element.radius)) {
        element.buttonDown();
      }
    });
  }

  private checkPointerUp(e: MouseData) {
    let mp = e.mousePosition;
    let cu = this.collision;

    this.uiElements.forEach(element => {
      if (cu.checkRadiusCollision(mp, 1, element.position, element.radius)) {
        element.buttonUp();
      }
    });
  }

  //#endregion

}
