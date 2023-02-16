import {
  CanvasEngine, Vector, Rectangle, MouseManager,
  MOUSE_EVENT_TYPE, MouseEventData, CanvasShader,
  ICanvasComponent, InputSystem
} from 'canvas-elements';

export class MovableRectangleComponent implements ICanvasComponent {
  private _rectangle: Rectangle;
  private _movementSpeed: number = 0.5;

  private _hasMovement: boolean = false;
  private _movement: Vector = new Vector(0, 0);

  async startup(engine: CanvasEngine) {
    var inputSystem = engine.getSystem(InputSystem);
    if (inputSystem) (<InputSystem>inputSystem).on('input', (e) => this.handleMove(e));

    this.subscribeToMouse(engine.mouseManager);
    this.buildTestRectangle(engine);
  }

  async tick(delta: number) {
    this.applyMovement(delta)
  }

  private applyMovement(delta: number): void {
    if (this._hasMovement && this._movement.isNotZero) {
      this._movement.multiplyBy(this._movementSpeed);
      this._movement.multiplyBy(delta);
      this._rectangle.moveBy(this._movement);
      this._hasMovement = false;
    }
  }

  private buildTestRectangle(engine: CanvasEngine) {
    this._rectangle = new Rectangle(new Vector(100, 100), new Vector(50, 50));
    let shader = new CanvasShader();
    shader.edgeColor.setShade("#00ffff");
    shader.faceColor.setShade("#ff0000");
    engine.renderManager.addPolygon(this._rectangle, shader);
  }

  private subscribeToMouse(mouseManager: MouseManager) {
    mouseManager.on(MOUSE_EVENT_TYPE.DOWN, (e: MouseEventData) => this.handleClick(e));
  }

  private handleClick(e: MouseEventData) {
    let position = e.mousePosition;
    this._rectangle.moveTo(position);
  }

  private handleMove(v: Vector) {
    this._movement.setVector(v);
    this._hasMovement = true;
  }
}
