import { KEYBOARD_EVENT_TYPE, UI_EVENT_TYPE } from "../events/canvas-enums";
import { CanvasEvent } from "../events/canvas-event";
import { KeyboardEventData } from "../events/event-data";

export class KeyboardManager {
    private element: HTMLElement;

    private keysDown: string[] = [];
    private controlKeyPressed: boolean = false;
    private shiftKeyPressed: boolean = false;
    private altKeyPressed: boolean = false;
    private latestKeyDown: string = '';
    private latestKeyUp: string = '';
    private propagateEvents: boolean = false;

    public get currentKeys(): string[] { return this.keysDown };

    private keyboardEventData = new CanvasEvent<KeyboardEventData>();
    on(on: KEYBOARD_EVENT_TYPE, callback: (e: KeyboardEventData) => void) {
        this.keyboardEventData.subscribe(on, callback);
    }

    constructor(e: HTMLElement) {
        this.element = e;
        this.registerEvents();
    }

    private registerEvents() {
        this.element.onkeydown = (e: KeyboardEvent) => {
            if (!this.propagateEvents) {
                e.preventDefault();
                e.stopPropagation();
            }

            var key = e.code;

            if (!this.isMostRecentKey(key)) {
                this.keysDown.push(key);
                this.latestKeyDown = key;
            }

            var eventData = this.buildEvent(KEYBOARD_EVENT_TYPE.KEY_DOWN, e);
            this.fireEvent(eventData);
        };

        this.element.onkeyup = (e: KeyboardEvent) => {
            if (!this.propagateEvents) {
                e.preventDefault();
                e.stopPropagation();
            }

            var key = e.code;

            var keyIndex = this.keysDown.indexOf(key);
            if (keyIndex != -1) this.keysDown.splice(keyIndex, 1);

            this.latestKeyUp = key;
            var eventData = this.buildEvent(KEYBOARD_EVENT_TYPE.KEY_UP, e);
            this.fireEvent(eventData);
        };
    }

    public resetKeys() {
        this.keysDown = [];
        this.shiftKeyPressed = false;
        this.controlKeyPressed = false;
        this.altKeyPressed = false;
        this.latestKeyDown = '';
        this.latestKeyUp = '';
    }

    public allowPropagation(allow: boolean) {
        this.propagateEvents = allow;
    }

    private isMostRecentKey(key: string): boolean {
        if (this.keysDown == null) return false;
        return this.keysDown[this.keysDown.length - 1] === key;
    }

    private buildEvent(eventType: KEYBOARD_EVENT_TYPE, e: KeyboardEvent): KeyboardEventData {
        var eventData = new KeyboardEventData();
        eventData.altDown = this.altKeyPressed;
        eventData.controlDown = this.controlKeyPressed;
        eventData.shiftDown = this.shiftKeyPressed;
        eventData.eventType = eventType;
        eventData.keyQueue = this.keysDown;
        eventData.latestKeyDown = this.latestKeyDown;
        eventData.latestKeyUp = this.latestKeyUp;
        eventData.hasKeyDown = this.hasKeyDown();

        return eventData;
    }

    private fireEvent(eventData: KeyboardEventData) {
        this.keyboardEventData.fireEvent(eventData.eventType, eventData);
    }

    private hasKeyDown(): boolean {
        return this.keysDown != null && this.keysDown.length > 0;
    }
}
