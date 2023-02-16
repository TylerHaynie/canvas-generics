import { CanvasEngine, ICanvasSystem, Vector, KeyboardManager, CanvasEvent } from 'canvas-elements';

export class InputSystem implements ICanvasSystem {
  private _keyboardManager: KeyboardManager;

  // y-axis
  public posY: string = 'KeyW';
  public negY: string = 'KeyS';

  // x-axis
  public posX: string = 'KeyD';
  public negX: string = 'KeyA';

  // z-axis
  public posZ: string = undefined;
  public negZ: string = undefined;

  private _movementEvent = new CanvasEvent<Vector>();
  on(on: 'input', callback: (e: Vector) => void) {
    this._movementEvent.subscribe(on, callback);
  }

  async startup(engine: CanvasEngine) {
    this._keyboardManager = engine.keyboardManager;
  }

  async tick(delta: number) {
    let movement = this.checkForMovement();
    if (movement.isNotZero) {
      this._movementEvent.fireEvent('input', movement);
    }
  }

  private checkForMovement(): Vector {
    let movementVector = new Vector(0, 0, 0);

    let keys = this._keyboardManager.currentKeys;
    if (keys.length < 1)
      return movementVector;

    let keyCount = keys.length;
    let movementAmount = 1 / keyCount;

    if (this.posY && keys.find(f => f == this.posY))
      movementVector.addValues(0, -movementAmount, 0);

    if (this.negY && keys.find(f => f == this.negY))
      movementVector.addValues(0, movementAmount, 0);

    if (this.negX && keys.find(f => f == this.negX))
      movementVector.addValues(-movementAmount, 0, 0);

    if (this.posX && keys.find(f => f == this.posX))
      movementVector.addValues(movementAmount, 0, 0);

    if (this.posZ && keys.find(f => f == this.posZ))
      movementVector.addValues(0, 0, movementAmount);

    if (this.negZ && keys.find(f => f == this.negZ))
      movementVector.addValues(0, 0, -movementAmount);

    return movementVector;
  }
}
