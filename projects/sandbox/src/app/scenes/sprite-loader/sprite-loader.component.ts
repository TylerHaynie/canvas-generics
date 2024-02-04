import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICanvasSystem, InputSystem, ICanvasComponent, CanvasEngine, ENGINE_EVENT_TYPE, EngineEventData, Vector, ICanvasScene, Rectangle, PolyRenderReference } from 'canvas-elements';
import { PoolComponent } from '../../example-components/fadable-particle-component';

export class RenderPoolItem<T> {
  _item: T;
  _renderRef: PolyRenderReference;
  _available: boolean = true;

  public get item(): T { return this._item; }
  public get renderRef(): PolyRenderReference { return this._renderRef; }

  public get isAvailable(): boolean { return this._available; }

  constructor(item: T, renderRef: PolyRenderReference) {
    this._item = item;
    this._renderRef = renderRef;
    this._renderRef.visible = false;
  }

  public use(){
    this._available = false;
    this._renderRef.visible = true;
  }

  public return(){
    this._renderRef.visible = false;
    this._available = true;
  }
}

export class ParticleScene implements ICanvasScene {
  private _rectanglePool: RenderPoolItem<Rectangle>[] = [];
  private _poolCount: number = 100;
  private _engine: CanvasEngine;

  async load(engine: CanvasEngine): Promise<void> {
    this._engine = engine;
    for (let i = 0; i < this._poolCount; i++) {
      let rec = new Rectangle(new Vector(10, 10));
      let renderRef = this._engine.renderManager.addPolygon(rec);
      this._rectanglePool.push(new RenderPoolItem(rec, renderRef));
    }
  }

  public start() {
    var rectangle = this.nextPoolItem();
    rectangle.setSize(10, 10);
    rectangle.moveTo(new Vector(100, 100));
  }

  private nextPoolItem(): Rectangle {
    var poolItem = this._rectanglePool.find(poolItem => poolItem.isAvailable);
    poolItem.use();

    return poolItem.item;
  }
}


@Component({
  selector: 'sprite-loader',
  template: `<canvas #c></canvas>`,
  styleUrls: ['./sprite-loader.component.css']
})
export class SpriteLoaderComponent implements AfterViewInit {
  @ViewChild('c') canvasRef: ElementRef;

  private _systems: ICanvasSystem[] = [
    new InputSystem()
  ];

  private _components: ICanvasComponent[] = [

  ];

  private _scenes: ICanvasScene[] = [
    new ParticleScene()
  ];

  constructor() { }

  ngAfterViewInit() {
    var renderCanvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    var engine = new CanvasEngine(renderCanvas);

    // subscribe to register systems and components.
    engine.on(ENGINE_EVENT_TYPE.REGISTER_SYSTEMS, (e: EngineEventData) => this.registerSystems(e));
    engine.on(ENGINE_EVENT_TYPE.REGISTER_COMPONENTS, (e: EngineEventData) => this.registerComponents(e));
    engine.on(ENGINE_EVENT_TYPE.REGISTER_SCENES, (e: EngineEventData) => this.registerScenes(e));
    engine.on(ENGINE_EVENT_TYPE.STARTUP, (e: EngineEventData) => this.startup(e));

    engine.start();
  }

  private registerSystems(e: EngineEventData) {
    e.engine.registerSystems(this._systems);
  }

  private registerComponents(e: EngineEventData) {
    e.engine.registerComponents(this._components);
  }

  private registerScenes(e: EngineEventData) {
    e.engine.registerScenes(this._scenes);
  }

  private startup(e: EngineEventData) {

    // will be done in engine
    var scene = this._scenes[0] as ParticleScene;
    scene.load(e.engine);
    scene.start();
  }

}
