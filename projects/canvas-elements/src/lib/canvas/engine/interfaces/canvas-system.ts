import { CanvasEngine } from "../../canvas-engine";


export interface ICanvasSystem {
    startup(engine: CanvasEngine): Promise<void>;
    tick(delta: number): Promise<void>;
}
