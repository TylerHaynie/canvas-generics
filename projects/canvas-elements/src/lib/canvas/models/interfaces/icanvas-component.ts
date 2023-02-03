export interface ICanvasComponent{
    startup(): Promise<void>;
    tick(delta: number): Promise<void>;
    dispose(): Promise<void>;
}