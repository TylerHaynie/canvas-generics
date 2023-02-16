import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  CanvasEngine, ICanvasComponent,
  ENGINE_EVENT_TYPE, EngineEventData,
  ICanvasSystem, InputSystem
} from 'canvas-elements';
import { MovableRectangleComponent } from '../../example-components/movable-rectangle-component';
import { RandomRectanglesComponent } from '../../example-components/random-rectangles-component';

@Component({
  selector: 'compose-scene',
  templateUrl: './compose-scene.component.html',
  styleUrls: ['./compose-scene.component.css']
})
export class ComposeSceneComponent implements AfterViewInit {
  @ViewChild('c') canvasRef: ElementRef;

  private _systems: ICanvasSystem[] = [
    new InputSystem()
  ];

  private _components: ICanvasComponent[] = [
    new MovableRectangleComponent(),
    new RandomRectanglesComponent()
  ];

  ngAfterViewInit() {
    var renderCanvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    var engine = new CanvasEngine(renderCanvas);

    engine.on(ENGINE_EVENT_TYPE.REGISTER_SYSTEMS, (e: EngineEventData) => this.registerSceneSystems(e));
    engine.on(ENGINE_EVENT_TYPE.REGISTER_COMPONENTS, (e: EngineEventData) => this.registerSceneComponents(e));
    engine.start();
  }

  private registerSceneSystems(e: EngineEventData) {
    e.engine.registerSystems(this._systems);
  }

  private registerSceneComponents(e: EngineEventData) {
    e.engine.registerComponents(this._components);
  }
}