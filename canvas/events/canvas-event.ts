// TODO: look into using promises possibly. Would they provide any benefit?

export class CanvasEvent<T>{
    private callbackList: [
        {
            eventName: string,
            callback: (e: T) => void
        }
    ];

    subscribe(on: string, callback: (e: T) => void) {
        if (!this.callbackList) {
            this.callbackList = [{ eventName: on, callback: callback }];
        }
        else {
            this.callbackList.push({ eventName: on, callback: callback });
        }
    }

    private updateSubscribers(eventName: string, e: T) {
        if (this.callbackList) {
            this.callbackList.forEach(subscriber => {
                if (subscriber.eventName === eventName) {
                    subscriber.callback(e);
                }

            });
        }
    }

    fireEvent(eventName: string, e: T) {
        this.updateSubscribers(eventName, e);
    }

}
