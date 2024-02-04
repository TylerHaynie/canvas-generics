import {
  CanvasEngine, Vector, Rectangle, MouseManager,
  MOUSE_EVENT_TYPE, MouseEventData, CanvasShader,
  ICanvasComponent, InputSystem, Polygon
} from 'canvas-elements';

export class MovablePolygonComponent implements ICanvasComponent {
  private _poly: Polygon;
  private _movementSpeed: number = 0.5;

  private _hasMovement: boolean = false;
  private _hasTargetPosition: boolean = false;

  private _targetPosition: Vector;
  private _movement: Vector = new Vector(0, 0);

  async startup(engine: CanvasEngine) {
    var inputSystem = engine.findSystem(InputSystem);
    if (inputSystem) (<InputSystem>inputSystem).on('input', (e) => this.handleMove(e));

    this.subscribeToMouse(engine.mouseManager);
    this.buildTestRectangle(engine);
  }

  async tick(delta: number) {
    this.applyMovement(delta)
  }

  private subscribeToMouse(mouseManager: MouseManager) {
    mouseManager.on(MOUSE_EVENT_TYPE.DOWN, (e: MouseEventData) => this.handleClick(e));
  }

  private buildTestRectangle(engine: CanvasEngine) {
    this._poly = new Rectangle(new Vector(100, 100), new Vector(50, 50));
    let shader = new CanvasShader();
    shader.edgeColor.setShade("#00ffff");
    shader.faceColor.setShade("#ff0000");
    engine.renderManager.addPolygon(this._poly, shader);
  }

  private applyMovement(delta: number): void {
    if (this._hasMovement && this._movement.isNotZero) {
      this._movement.multiplyBy(this._movementSpeed);
      this._movement.multiplyBy(delta);
      this._poly.moveBy(this._movement);
      this._hasMovement = false;
    }

    if (this._hasTargetPosition) {
      this._poly.moveTo(this._targetPosition);
      this._hasTargetPosition = false;
    }
  }

  private handleClick(e: MouseEventData) {
    this._targetPosition = e.mousePosition;
    this._hasTargetPosition = true;
  }

  private handleMove(v: Vector) {
    this._movement.setVector(v);
    this._hasMovement = true;
  }
}
