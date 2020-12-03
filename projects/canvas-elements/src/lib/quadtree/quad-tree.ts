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

    containsVector(p: QuadVector): QuadVector {
        let pxIsGreater: Boolean = p.x >= this.x;
        let pxIsLess: boolean = p.x <= this.x + this.width;

        let pyIsGreater: boolean = p.y > this.y;
        let pyIsLess: boolean = p.y < this.y + this.height;

        let pzIsGreater: boolean = p.z > this.z;
        let pzIsLess: boolean = p.z < this.z + this.depth;

        let xSearch: number = pxIsLess ? 1 : pxIsGreater ? -1 : 0;
        let ySearch: number = pyIsLess ? 1 : pyIsGreater ? -1 : 0;
        let zSearch: number = pzIsLess ? 1 : pzIsGreater ? -1 : 0;

        return new QuadVector(xSearch, ySearch, zSearch);
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

    constructor(b: Boundary, c: number) {
        this.boundary = b;
        this.capicity = c;
    }

    insert(p: QuadVector) {
        let searchResult = this.boundary.containsVector(p);

        if (this.isDivided) {
            if (searchResult.x > 0) {
                if (searchResult.y > 0) { this.topRight.insert(p); }
                else { this.bottomRight.insert(p); }
            }
            else if (searchResult.x < 0) {
                if (searchResult.y > 0) { this.topLeft.insert(p); }
                else { this.bottomLeft.insert(p); }
            }
            else {
                if (this.vectors.length < this.capicity) {
                    this.vectors.push(p);
                }
            }
        }
        else {
            this.subdivide();

            // move the vectors to their new quads
            for (let x = this.vectors.length; x > 0; x--) {
                this.insert(this.vectors[x - 1]);
                this.vectors.splice(x, 1);
            }
        }
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
        // TODO: simplify and speed up
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

    // debugQuad(context: CanvasRenderingContext2D, color: string, alpha: number = 1, lineWidth: number = .25) {

    //     let p = new Vector2D(this.boundary.x, this.boundary.y);
    //     let rect = new Rectangle(context, p);
    //     rect.size = new Size(this.boundary.width, this.boundary.height);
    //     rect.outline = new LineStyle(lineWidth);
    //     rect.outline.shade = color;
    //     rect.outline.alpha = alpha;

    //     rect.draw();

    //     if (this.isDivided) {
    //         this.topLeft.debugQuad(context, color, alpha, lineWidth);
    //         this.topRight.debugQuad(context, color, alpha, lineWidth);
    //         this.bottomLeft.debugQuad(context, color, alpha, lineWidth);
    //         this.bottomRight.debugQuad(context, color, alpha, lineWidth);
    //     }
    // }
}
