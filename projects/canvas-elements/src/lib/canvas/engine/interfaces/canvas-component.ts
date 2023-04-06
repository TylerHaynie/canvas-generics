import { CanvasEngine } from "../../canvas-engine";

export interface ICanvasComponent{
    startup(engine: CanvasEngine): Promise<void>;
    tick(delta: number): Promise<void>;
}
