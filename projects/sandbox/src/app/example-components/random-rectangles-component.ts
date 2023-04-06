import {
  CanvasEngine, CanvasShader, ICanvasComponent,
  PolyRenderReference, RandomUtility, Vector, Rectangle
} from 'canvas-elements';

export class RandomRectanglesComponent implements ICanvasComponent {
  private _references: PolyRenderReference[] = [];
  private _zDepthMin = 1;
  private _zDepthMax = 11;

  public rectangleCount: number = 500;

  async startup(engine: CanvasEngine) {
    this.createRandomPolys(engine);
    this.applyAlphaZ(engine);
  }

  async tick(delta: number) {

  }

  private createRandomPolys(engine: CanvasEngine) {
    for (let i = 0; i < this.rectangleCount; i++) {
      let testShader = new CanvasShader();
      testShader.edgeColor.setShade("#00dd00");
      testShader.faceColor.setShade("#333");

      let size = new Vector(
        RandomUtility.randomNumberBetween(10, 50),
        RandomUtility.randomNumberBetween(10, 50));

      let pos = new Vector(
        RandomUtility.randomNumberBetween(size.x / 2, engine.canvasWidth - size.x / 2),
        RandomUtility.randomNumberBetween(size.y / 2, engine.canvasHeight - size.y / 2),
        RandomUtility.randomNumberBetween(1, 10));

      let poly = new Rectangle(pos, size);
      let ref = engine.renderManager.addPolygon(poly, testShader);
      this._references.push(ref);
    }
  }

  private applyAlphaZ(engine: CanvasEngine) {
    for (let i = 0; i < this._references.length; i++) {
      let poly = engine.renderManager.getPolygonByIndex(this._references[i].polyIndex);
      let alpha = 1 - (poly.position.z - this._zDepthMin) / (this._zDepthMax - this._zDepthMin);

      this._references[i].shader.edgeColor.setAlpha(alpha);
      this._references[i].shader.faceColor.setAlpha(alpha);
    }
  }
}