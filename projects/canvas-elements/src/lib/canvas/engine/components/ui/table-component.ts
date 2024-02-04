import { CanvasEngine } from "../../../canvas-engine";
import { Rectangle } from "../../geometry/basic-polygons/rectangle";
import { Vector } from "../../geometry/vector";
import { ICanvasComponent } from "../../interfaces/canvas-component";
import { RenderManager } from "../../managers/render-manager";
import { CanvasShader } from "../../render/shaders/basic/canvas-shader";

export class TableCell {
    private _rowIndex: number = -1;
    private _columnIndex: number = -1;
    private _rectangle: Rectangle;

    public get rectangle(): Rectangle { return this._rectangle; }
    public get columnIndex(): number { return this._columnIndex; }
    public get rowIndex(): number { return this._rowIndex; }

    constructor(rowIndex: number, columnIndex: number, rectangle: Rectangle) {
        this._rowIndex = rowIndex;
        this._columnIndex = columnIndex;
        this._rectangle = rectangle;
    }
}

export class TableComponent implements ICanvasComponent {
    private _renderManager: RenderManager;
    private _container: Rectangle;
    private _cells: TableCell[] = [];

    private _size: Vector = new Vector(0, 0);
    private _position: Vector = new Vector(300, 200, 0);

    private _rowCount: number = 15;
    private _rowHeight: number = 15;
    private _columnCount: number = 5;
    private _columnWidth: number = 50;
    private _cellGap: number = 5;
    private _columnWidths: number[] = [50, 100, 25, 10, 50];

    private _needsUpdate: boolean = true;

    async startup(engine: CanvasEngine) {
        this._renderManager = engine.renderManager;
    }

    async tick(delta: number) {
        if (this._needsUpdate) {
            this.buildTable();
            this._needsUpdate = false;
        }
    }

    private calculateSize() {
        let width = (this._columnCount * this._columnWidth) + ((this._cellGap * this._columnCount) + this._cellGap);
        let height = (this._rowCount * this._rowHeight) + ((this._cellGap * this._rowCount) + this._cellGap);
        this._size.setValues(width, height);
    }

    private buildTable() {
        this.calculateSize();
        this.buildContainer();
        this.layoutCells();
    }

    private buildContainer() {
        let borderShader = new CanvasShader();
        borderShader.faceColor.setShade('transparent');
        borderShader.edgeColor.setShade('#00ff00');

        this._container = new Rectangle(this._position, this._size);
        this._renderManager.addPolygon(this._container, borderShader);
    }

    private layoutCells() {
        for (let r = 0; r < this._rowCount; r++) {
            for (let c = 0; c < this._columnCount; c++) {
                let cellShader = new CanvasShader();
                cellShader.drawFace = false;

                let posX = (this._position.x - this._size.x / 2) + (this._columnWidth / 2)
                posX = posX + (c * this._columnWidth);
                posX = posX + (this._cellGap * (c + 1));

                let posY = ((this._position.y - this._size.y / 2) + this._rowHeight / 2);
                posY = posY + (r * this._rowHeight);
                posY = posY + (this._cellGap * (r + 1));

                let tc = new TableCell(r, c, new Rectangle(new Vector(posX, posY), new Vector(this._columnWidth, this._rowHeight)));
                this._renderManager.addPolygon(tc.rectangle, cellShader);
                this._cells.push(tc);
            }
        }
    }

}