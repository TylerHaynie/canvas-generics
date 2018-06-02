import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasWrapper } from '../../lib/canvas/canvas-wrapper';

@Component({
  selector: 'app-scene02',
  templateUrl: './scene02.component.html',
  styleUrls: ['./scene02.component.css']
})
export class Scene02Component implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;
  private cw: CanvasWrapper;

  constructor() { }

  ngOnInit() {
    this.cw = new CanvasWrapper((this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d'), () => { this.draw(); });
    this.cw.panZoomManager.minScale = 1;
    this.cw.panZoomManager.panningAllowed = false;

    // start the draw loop
    this.cw.start();
  }

  draw() {
    this.cw.saveContext();

    // do some cool stuff
    // ...
    //

    this.cw.restoreContext();
  }

}
