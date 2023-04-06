import { CanvasEngine, ICanvasSystem, Vector, KeyboardManager, CanvasEvent } from 'canvas-elements';

export class InputSystem implements ICanvasSystem {
  private _keyboardManager: KeyboardManager;

  // x-axis
  public movePositiveX: string = 'KeyD';
  public moveNegativeX: string = 'KeyA';

  // y-axis
  public movePositiveY: string = 'KeyW';
  public moveNegativeY: string = 'KeyS';

  // z-axis
  public movePositiveZ: string = undefined;
  public moveNegativeZ: string = undefined;

  private _movementEvent = new CanvasEvent<Vector>();
  on(on: 'input', callback: (e: Vector) => void) {
    this._movementEvent.subscribe(on, callback);
  }

  async startup(engine: CanvasEngine) {
    this._keyboardManager = engine.keyboardManager;
  }

  async tick(delta: number) {
    let movement = this.getMovementDirection();
    if (movement.isNotZero) {
      this._movementEvent.fireEvent('input', movement);
    }
  }

  private getMovementDirection(): Vector {
    let movementVector = new Vector(0, 0, 0);

    let keys = this._keyboardManager.currentKeys;
    if (keys.length < 1)
      return movementVector;

    let keyCount = keys.length;
    let movementAmount = 1 / keyCount;

    if (this.movePositiveY && keys.find(key => key == this.movePositiveY))
      movementVector.addValues(0, -movementAmount, 0);

    if (this.moveNegativeY && keys.find(key => key == this.moveNegativeY))
      movementVector.addValues(0, movementAmount, 0);

    if (this.moveNegativeX && keys.find(key => key == this.moveNegativeX))
      movementVector.addValues(-movementAmount, 0, 0);

    if (this.movePositiveX && keys.find(key => key == this.movePositiveX))
      movementVector.addValues(movementAmount, 0, 0);

    if (this.movePositiveZ && keys.find(key => key == this.movePositiveZ))
      movementVector.addValues(0, 0, movementAmount);

    if (this.moveNegativeZ && keys.find(key => key == this.moveNegativeZ))
      movementVector.addValues(0, 0, -movementAmount);

    return movementVector;
  }
}
