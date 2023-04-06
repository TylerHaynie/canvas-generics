import { GAMEPAD_EVENT_TYPE, KEYBOARD_EVENT_TYPE, UI_EVENT_TYPE } from "../events/canvas-enums";
import { CanvasEvent } from "../events/canvas-event";
import { GamepadEventData, KeyboardEventData } from "../events/event-data";

export class GamepadManager {
    private gamepadEventData = new CanvasEvent<GamepadEventData>();
    on(on: GAMEPAD_EVENT_TYPE, callback: (e: GamepadEventData) => void) {
        this.gamepadEventData.subscribe(on, callback);
    }

    constructor() {
        this.registerEvents();
    }

    private registerEvents() {
        window.addEventListener('gamepadconnected', (e: GamepadEvent) => this.connected(e));
        window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => this.disconnected(e));
    }

    private connected(e: GamepadEvent){
        console.log('connected', e);
    }

    private disconnected(e: GamepadEvent){
        console.log('disconnected', e);
    }
}
