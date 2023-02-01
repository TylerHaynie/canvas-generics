import { LineStyle } from "../canvas/models/line-style";
import { Size } from "../canvas/models/size";
import { Vector } from "../canvas/objects/vector";
import { Rectangle } from "../canvas/shapes/rectangle";

export class QuadVector {
    x: number;
    y: number;
    z: number;
    data: any; // todo: this needs to be an index pointer

    constructor(x: number = 0, y: number = 0, z: number = 0, data: any = undefined) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = data;
    }
}

export class Boundary {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;

    constructor(x: number, y: number, z: number, w: number, h: number, d: number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.depth = d;
    }

    containsVector(p: QuadVector): boolean {
        if (p.x > this.x &&
            p.x < this.x + this.width) {

            if (p.y > this.y &&
                p.y < this.y + this.height) {

                return true;
            }
        }

        return false;
    }

    intersects(other: Boundary) {
        // let oxIsGreater: Boolean = other.x - other.width > this.x + this.width;
        // let oxIsLess: boolean = other.x + other.width < this.x - this.width;

        // let oyIsGreater: boolean = other.y - other.height > this.y + this.height;
        // let oyIsLess: boolean = other.y + other.height > this.y - this.height;

        // let ozIsGreater: boolean = ;
        // let ozIsLess: boolean = ;

        if (other.x - other.width > this.x + this.width ||
            other.x + other.width < this.x - this.width ||
            other.y - other.height > this.y + this.height ||
            other.y + other.height > this.y - this.height
        ) {
            return true;
        }
        else {
            return false;
        }
    }
}

export class QuadTree {
    boundary: Boundary;
    capicity: number;
    vectors: QuadVector[] = [];
    isDivided: boolean = false;

    // sub divisions
    topLeft: QuadTree;
    topRight: QuadTree;
    bottomLeft: QuadTree;
    bottomRight: QuadTree;

    constructor(boundary: Boundary, capicity: number) {
        this.boundary = boundary;
        this.capicity = capicity;
    }

    insert(p: QuadVector) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsVector(p)) {
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

            // move the dataPoints to their new quads
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

        // let searchResult = this.boundary.containsVector(p);

        // if (this.isDivided) {
        //     if (searchResult.x > 0) {
        //         if (searchResult.y > 0) {
        //             this.topRight.insert(p);
        //         }
        //         else {
        //             this.bottomRight.insert(p);
        //         }
        //     }
        //     else if (searchResult.x < 0) {
        //         if (searchResult.y > 0) { this.topLeft.insert(p); }
        //         else { this.bottomLeft.insert(p); }
        //     }
        //     else {
        //         if (this.vectors.length < this.capicity) {
        //             this.vectors.push(p);
        //         }
        //     }
        // }
        // else {
        //     this.subdivide();

        //     // move the vectors to their new quads
        //     for (let x = this.vectors.length; x > 0; x--) {
        //         this.insert(this.vectors[x - 1]);
        //         this.vectors.splice(x, 1);
        //     }
        // }
    }

    private subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let z = this.boundary.z;
        let w = this.boundary.width;
        let h = this.boundary.height;
        let d = this.boundary.depth;

        // topLeft  (-1, 1, 0)
        let tlBounds = new Boundary(x, y, z + d / 2, w / 2, h / 2, d / 2);
        this.topLeft = new QuadTree(tlBounds, this.capicity);

        // topRight (1, 1, 0)
        let trBounds = new Boundary(x + w / 2, y, z + d / 2, w / 2, h / 2, d / 2);
        this.topRight = new QuadTree(trBounds, this.capicity);

        // bottomLeft (-1, -1, 0)
        let blBounds = new Boundary(x, y + h / 2, z + d / 2, w / 2, h / 2, d / 2);
        this.bottomLeft = new QuadTree(blBounds, this.capicity);

        // bottomRight (1, -1, 0)
        let brBounds = new Boundary(x + w / 2, y + h / 2, z + d / 2, w / 2, h / 2, d / 2);
        this.bottomRight = new QuadTree(brBounds, this.capicity);

        this.isDivided = true;
    }

    searchBoundary(b: Boundary): QuadVector[] {
        // Prepare an array of results
        let vectorsInRange: QuadVector[] = [];

        // leave if the boundary does not intersect this quad
        if (!this.boundary.intersects(b)) { return vectorsInRange; }

        // Check objects on this quad
        for (let x = 0; x < this.vectors.length; x++) {
            if (b.containsVector(this.vectors[x])) {
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

        for (let p of this.bottomRight.searchBoundary(b)) {
            vectorsInRange.push(p);
        }

        for (let p of this.bottomLeft.searchBoundary(b)) {
            vectorsInRange.push(p);
        }

        return vectorsInRange;
    }

    reset(w: number, h: number) {
        this.boundary.width = w;
        this.boundary.height = h;

        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;

        this.vectors = [];
        this.isDivided = false;
    }

    debugQuad(context: CanvasRenderingContext2D, color: string = '#777', alpha: number = 1, lineWidth: number = .20) {
        let p = new Vector(this.boundary.x, this.boundary.y);
        let rect = new Rectangle(p);
        rect.size.setSize(this.boundary.width, this.boundary.height);
        rect.outline = new LineStyle(color, lineWidth);
        rect.outline.setShade(color);
        rect.outline.setAlpha(alpha);
        rect.color.setAlpha(0);
        rect.draw(context);

        if (this.isDivided) {
            this.topLeft.debugQuad(context, color, alpha, lineWidth);
            this.topRight.debugQuad(context, color, alpha, lineWidth);
            this.bottomLeft.debugQuad(context, color, alpha, lineWidth);
            this.bottomRight.debugQuad(context, color, alpha, lineWidth);
        }
    }
}
