import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PanZoom } from '../../lib/canvas/pan-zoom';

@Component({
  selector: 'app-orbital-viewer',
  templateUrl: './orbital-viewer.component.html',
  styleUrls: ['./orbital-viewer.component.css']
})
export class OrbitalViewerComponent implements OnInit {
  @ViewChild('c') canvasRef: ElementRef;

  private context: CanvasRenderingContext2D;
  private hasChanges: boolean = false;
  private panZoom: PanZoom;

  constructor() {

  }

  ngOnInit() {
    this.context = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');
    this.panZoom = new PanZoom(this.context);

    this.hasChanges = true;
    this.draw();
  }

  //#region Drawing
  //#region Drawing
  draw() {
    // only draw when we need to
    if (this.hasChanges || this.panZoom.isDirty) {
      // clear before doing anything
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      this.context.save();
      this.context.setTransform(this.panZoom.scale, 0, 0, this.panZoom.scale, this.panZoom.panX, this.panZoom.panY);

      this.doSomeCoolStuff();

      this.context.restore();
      this.hasChanges = false;
    }
    requestAnimationFrame(() => this.draw());
  }

  doSomeCoolStuff() {
    this.context.fillStyle = '#aaa';
    this.context.fillRect(100, 100, 100, 100);
  }
}
