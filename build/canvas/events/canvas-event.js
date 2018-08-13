"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CanvasEvent {
    subscribe(on, callback) {
        if (!this.callbackList) {
            this.callbackList = [{ eventName: on, callback: callback }];
        }
        else {
            this.callbackList.push({ eventName: on, callback: callback });
        }
    }
    updateSubscribers(eventName, e) {
        if (this.callbackList) {
            this.callbackList.forEach(subscriber => {
                if (subscriber.eventName === eventName) {
                    subscriber.callback(e);
                }
            });
        }
    }
    fireEvent(eventName, e) {
        this.updateSubscribers(eventName, e);
    }
}
exports.CanvasEvent = CanvasEvent;
//# sourceMappingURL=canvas-event.js.map