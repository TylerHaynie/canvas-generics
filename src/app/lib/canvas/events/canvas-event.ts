// TODO: look into using promises possibly. Would they provide any benefit?

export class CanvasEvent<T>{
    private callbackList: [{ subscriberCallback: (e: T) => void }];
    subscribe(callback: (e: T) => void) {
        if (!this.callbackList) {
            this.callbackList = [{ subscriberCallback: callback }];
        }
        else {
            this.callbackList.push({ subscriberCallback: callback });
        }
    }
    private updateSubscribers(e: T) {
        if (this.callbackList) {
            this.callbackList.forEach(subscriber => {
                subscriber.subscriberCallback(e);
            });
        }
    }

    fireEvent(e: T) {
        this.updateSubscribers(e);
    }

}
