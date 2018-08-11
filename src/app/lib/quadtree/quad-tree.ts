import { Rectangle } from '@canvas/shapes/rectangle';
import { Vector2D } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { LineStyle } from '@canvas/models/line-style';
import { Color } from '@canvas/models/color';

/// built by referencing https://en.wikipedia.org/wiki/Quadtree

export class QuadData {
    vector: Vector2D;
    size: Size;
    data: any;

    constructor(x: number, y: number, data: any = undefined, size: Size = undefined) {
        this.vector = new Vector2D(x, y);
        this.data = data;
        this.size = size ? size : new Size(1, 1);
    }
}

export class Boundary {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    containsQuadData(dataPoint: QuadData) {
        // let b = new Boundary(dataPoint.vector.x, dataPoint.vector.y, dataPoint.size.width, dataPoint.size.height);


        // return this.intersects(b);

        if (dataPoint.vector.x > this.x &&
            dataPoint.vector.x < this.x + this.w) {

            if (dataPoint.vector.y > this.y &&
                dataPoint.vector.y < this.y + this.h) {

                return true;
            }
        }

        return false;
    }

    intersects(other: Boundary) {
        if (other.x - other.w > this.x + this.w ||
            other.x + other.w < this.x - this.w ||
            other.y - other.h > this.y + this.h ||
            other.y + other.h > this.y - this.h
        ) {
            return true;
        }
        else {
            return false;
        }
    }
}

export class QuadTree {
    // Axis-aligned bounding box (boundaries of this quad tree)
    boundary: Boundary;

    // how many elements can be stored in this quad tree
    capicity: number;

    // This quad's data
    dataPoints: QuadData[] = [];

    // division flag
    isDivided: boolean = false;

    // sub divisions
    topLeft: QuadTree;
    topRight: QuadTree;
    bottomLeft: QuadTree;
    bottomRight: QuadTree;

    constructor(b: Boundary, c: number) {
        this.boundary = b;
        this.capicity = c;
    }

    insert(p: QuadData) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsQuadData(p)) {
            // vector does not belong here
            return false;
        }

        // If there is space in this quad tree, add the vector here
        if (this.dataPoints.length < this.capicity) {
            this.dataPoints.push(p);
            return true;
        }

        // Otherwise, subdivide and then add the vector to whichever quad it will fit in
        if (!this.isDivided) {
            this.subdivide();

            // move the dataPoints to their new quads
            for (let x = this.dataPoints.length; x > 0; x--) {
                this.insert(this.dataPoints[x - 1]);
                this.dataPoints.splice(x, 1);
            }
        }

        if (this.topLeft.insert(p)) { return true; }
        if (this.topRight.insert(p)) { return true; }
        if (this.bottomLeft.insert(p)) { return true; }
        if (this.bottomRight.insert(p)) { return true; }

        // something went wrong
        return false;
    }

    private subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        // topLeft
        let tlBounds = new Boundary(x, y, w / 2, h / 2);
        this.topLeft = new QuadTree(tlBounds, this.capicity);

        // topRight
        let trBounds = new Boundary(x + w / 2, y, w / 2, h / 2);
        this.topRight = new QuadTree(trBounds, this.capicity);

        // bottomLeft
        let blBounds = new Boundary(x, y + h / 2, w / 2, h / 2);
        this.bottomLeft = new QuadTree(blBounds, this.capicity);

        // bottomRight
        let brBounds = new Boundary(x + w / 2, y + h / 2, w / 2, h / 2);
        this.bottomRight = new QuadTree(brBounds, this.capicity);

        this.isDivided = true;
    }

    searchBoundary(b: Boundary): QuadData[] {
        // Prepare an array of results
        let dataInRange: QuadData[] = [];

        // leave if the boundary does not intersect this quad
        if (!this.boundary.intersects(b)) {
            return dataInRange; // empty list
        }

        // Check objects on this quad
        for (let x = 0; x < this.dataPoints.length; x++) {
            if (b.containsQuadData(this.dataPoints[x])) {
                dataInRange.push(this.dataPoints[x]);
            }
        }

        // stop here if we haven't subdived
        if (!this.isDivided) {
            return dataInRange;
        }

        // add vectors from children
        for (let p of this.topLeft.searchBoundary(b)) {
            dataInRange.push(p);
        }

        for (let p of this.topRight.searchBoundary(b)) {
            dataInRange.push(p);
        }

        for (let p of this.bottomLeft.searchBoundary(b)) {
            dataInRange.push(p);
        }

        for (let p of this.bottomRight.searchBoundary(b)) {
            dataInRange.push(p);
        }

        return dataInRange;
    }

    reset(w: number, h: number) {
        this.boundary.w = w;
        this.boundary.h = h;

        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;

        this.dataPoints = [];
        this.isDivided = false;
    }

    debugQuad(context: CanvasRenderingContext2D, color: Color, lineWidth: number = .25) {

        let p = new Vector2D(this.boundary.x, this.boundary.y);
        let rect = new Rectangle(context, p);
        rect.size = new Size(this.boundary.w, this.boundary.h);
        rect.outline = new LineStyle(color.shade, lineWidth);
        rect.outline.alpha = color.alpha;

        rect.draw();

        if (this.isDivided) {
            this.topLeft.debugQuad(context, color, lineWidth);
            this.topRight.debugQuad(context, color, lineWidth);
            this.bottomLeft.debugQuad(context, color, lineWidth);
            this.bottomRight.debugQuad(context, color, lineWidth);
        }
    }
}
