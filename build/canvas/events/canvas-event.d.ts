export declare class CanvasEvent<T> {
    private callbackList;
    subscribe(on: string, callback: (e: T) => void): void;
    private updateSubscribers;
    fireEvent(eventName: string, e: T): void;
}
