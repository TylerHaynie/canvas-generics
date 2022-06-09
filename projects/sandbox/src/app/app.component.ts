import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  // @ViewChild('c', { static: true }) canvasRef: ElementRef;

  // private context: CanvasRenderingContext2D;
  // private _render: CanvasRender;

  // public delta: number;
  // private lastRender: number;
  // private fps: number;

  constructor() { }

  ngAfterViewInit(): void {
    // var canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    // if (canvas != null) this._render = new CanvasRender(canvas.getContext('2d'));
    // if (this._render == null) return;

    // var line: CanvasLine = new CanvasLine();

    // var p1 = new Particle();
    // p1.setPosition(15, 15, 0);
    // line.addParticle(p1);

    // var p2 = new Particle();
    // p2.setPosition(45, 68, 0);
    // line.addParticle(p2);

    // var p3 = new Particle();
    // p3.setPosition(98, 35, 0);
    // line.addParticle(p3);

    // this._render.addElement(line);
  }

  // private update() {
  //   this.delta = performance.now() - this.lastRender;
  //   this.fps = Math.floor(1000 / this.delta);

  //   // TODO: only draw background when needed
  //   this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

  //   this.context.save();

  //   this.line.draw(this.context);

  //   this.context.fillStyle = 'red';
  //   this.context.font = '14px courier new';
  //   this.context.fillText(this.fps.toString(), 15, 15);

  //   this.lastRender = performance.now();
  //   this.context.restore();

  //   requestAnimationFrame(() => this.update());
  // }



}
