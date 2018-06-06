import { Rectangle } from '@canvas/shapes/rectangle';
import { Vector } from '@canvas/objects/vector';
import { Size } from '@canvas/models/size';
import { LineStyle } from '@canvas/models/line-style';

/// built by referencing https://en.wikipedia.org/wiki/Quadtree

export class QuadVector {
    x: number;
    y: number;
    data: any;

    constructor(x: number, y: number, data: any = undefined) {
        this.x = x;
        this.y = y;
        this.data = data;
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

    containsvector(p: QuadVector) {
        if (p.x > this.x && p.x < this.x + this.w) {
            if (p.y > this.y && p.y < this.y + this.h) {
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

    // This quad's vectors
    vectors: QuadVector[] = [];

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

    public insert(p: QuadVector) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsvector(p)) {
            // vector does not belong here
            return false;
        }

        // If there is space in this quad tree, add the vector here
        if (this.vectors.length < this.capicity) {
            this.vectors.push(p);
            return true;
        }

        // Otherwise, subdivide and then add the vector to whichever quad it will fit in
        if (!this.isDivided) {
            this.subdivide();

            // move the vectors to their new quads
            for (let x = this.vectors.length; x > 0; x--) {
                this.insert(this.vectors[x - 1]);
                this.vectors.splice(x, 1);
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

    public searchBoundary(b: Boundary): QuadVector[] {
        // Prepare an array of results
        let vectorsInRange: QuadVector[] = [];

        // leave if the boundary does not intersect this quad
        if (!this.boundary.intersects(b)) {
            return vectorsInRange; // empty list
        }

        // Check objects on this quad
        for (let x = 0; x < this.vectors.length; x++) {
            if (b.containsvector(this.vectors[x])) {
                vectorsInRange.push(this.vectors[x]);
            }
        }

        // stop here if we haven't subdived
        if (!this.isDivided) {
            return vectorsInRange;
        }

        // add vectors from children
        for (let p of this.topLeft.searchBoundary(b)) {
            vectorsInRange.push(p);
        }

        for (let p of this.topRight.searchBoundary(b)) {
            vectorsInRange.push(p);
        }

        for (let p of this.bottomLeft.searchBoundary(b)) {
            vectorsInRange.push(p);
        }

        for (let p of this.bottomRight.searchBoundary(b)) {
            vectorsInRange.push(p);
        }

        return vectorsInRange;
    }



    // searchRayCrossing() {

    // }

    public reset(w: number, h: number) {
        this.boundary.w = w;
        this.boundary.h = h;

        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;

        this.vectors = [];
        this.isDivided = false;
    }

    public debugQuad(context: CanvasRenderingContext2D, color: string, alpha: number = 1, lineWidth: number = .25) {

        let p = new Vector(this.boundary.x, this.boundary.y);
        let rect = new Rectangle(context, p);
        rect.size = new Size(this.boundary.w, this.boundary.h);
        rect.outline = new LineStyle(lineWidth);
        rect.outline.shade = color;
        rect.outline.alpha = alpha;

        rect.draw();

        if (this.isDivided) {
            this.topLeft.debugQuad(context, color, alpha, lineWidth);
            this.topRight.debugQuad(context, color, alpha, lineWidth);
            this.bottomLeft.debugQuad(context, color, alpha, lineWidth);
            this.bottomRight.debugQuad(context, color, alpha, lineWidth);
        }
    }
}
