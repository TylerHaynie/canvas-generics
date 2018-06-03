import { CanvasWrapper } from '../canvas/canvas-wrapper';
import { iRectangle } from '../canvas/interfaces/iRectangle';
// built by referencing https://en.wikipedia.org/wiki/Quadtree

export class Quadvector {
    x: number;
    y: number;
    data: any;

    constructor(x: number, y: number, data: any = undefined) {
        this.x = x;
        this.y = y;
    }
}

export class Boundry {
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

    containsvector(p: Quadvector) {
        if (p.x > this.x && p.x < this.x + this.w) {
            if (p.y > this.y && p.y < this.y + this.h) {
                return true;
            }
        }

        return false;
    }

    intersects(other: Boundry) {
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
    boundry: Boundry;

    // how many elements can be stored in this quad tree
    capicity: number;

    // This quad's vectors
    vectors: Quadvector[] = [];

    // division flag
    isDivided: boolean = false;

    // sub divisions
    topLeft: QuadTree;
    topRight: QuadTree;
    bottomLeft: QuadTree;
    bottomRight: QuadTree;

    constructor(b: Boundry, c: number) {
        this.boundry = b;
        this.capicity = c;
    }

    public insert(p: Quadvector) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundry.containsvector(p)) {
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
        let x = this.boundry.x;
        let y = this.boundry.y;
        let w = this.boundry.w;
        let h = this.boundry.h;

        // topLeft
        let tlBounds = new Boundry(x, y, w / 2, h / 2);
        this.topLeft = new QuadTree(tlBounds, this.capicity);

        // topRight
        let trBounds = new Boundry(x + w / 2, y, w / 2, h / 2);
        this.topRight = new QuadTree(trBounds, this.capicity);

        // bottomLeft
        let blBounds = new Boundry(x, y + h / 2, w / 2, h / 2);
        this.bottomLeft = new QuadTree(blBounds, this.capicity);

        // bottomRight
        let brBounds = new Boundry(x + w / 2, y + h / 2, w / 2, h / 2);
        this.bottomRight = new QuadTree(brBounds, this.capicity);

        this.isDivided = true;
    }

    public searchBoundry(b: Boundry): Quadvector[] {
        // Prepare an array of results
        let vectorsInRange: Quadvector[] = [];

        // leave if the boundry does not intersect this quad
        if (!this.boundry.intersects(b)) {
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
        for (let p of this.topLeft.searchBoundry(b)) {
            vectorsInRange.push(p);
        }

        for (let p of this.topRight.searchBoundry(b)) {
            vectorsInRange.push(p);
        }

        for (let p of this.bottomLeft.searchBoundry(b)) {
            vectorsInRange.push(p);
        }

        for (let p of this.bottomRight.searchBoundry(b)) {
            vectorsInRange.push(p);
        }

        return vectorsInRange;
    }



    // searchRayCrossing() {

    // }

    public reset(w: number, h: number) {
        this.boundry.w = w;
        this.boundry.h = h;

        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;

        this.vectors = [];
        this.isDivided = false;
    }

    public debugQuad(canvasWrapper: CanvasWrapper, color: string, alpha: number = 1, lineWidth: number = .25) {
        let rect = <iRectangle>{
            vector: {
                x: this.boundry.x,
                y: this.boundry.y
            },
            size: {
                width: this.boundry.w,
                height: this.boundry.h
            },
            outline: {
                color: color,
                alpha: alpha,
                lineWidth: lineWidth
            }
        };

        canvasWrapper.shape.drawRectangle(rect);

        if (this.isDivided) {
            this.topLeft.debugQuad(canvasWrapper, color, alpha, lineWidth);
            this.topRight.debugQuad(canvasWrapper, color, alpha, lineWidth);
            this.bottomLeft.debugQuad(canvasWrapper, color, alpha, lineWidth);
            this.bottomRight.debugQuad(canvasWrapper, color, alpha, lineWidth);
        }
    }
}
