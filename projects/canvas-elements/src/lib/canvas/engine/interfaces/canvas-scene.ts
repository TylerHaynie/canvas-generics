import { CanvasEngine } from "../../canvas-engine";

export interface ICanvasScene {
    load(engine: CanvasEngine): Promise<void>;
}
