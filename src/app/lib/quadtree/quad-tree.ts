// built by referencing https://en.wikipedia.org/wiki/Quadtree

export class Point {
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

    containsPoint(p: Point) {
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

    // This quad's points
    points: Point[] = [];

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

    public insert(p: Point) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundry.containsPoint(p)) {
            // point does not belong here
            return false;
        }

        // If there is space in this quad tree, add the point here
        if (this.points.length < this.capicity) {
            this.points.push(p);
            return true;
        }

        // Otherwise, subdivide and then add the point to whichever quad it will fit in
        if (!this.isDivided) {
            this.subdivide();

            // move the points to their new quads
            for (let x = this.points.length; x > 0; x--) {
                this.insert(this.points[x - 1]);
                this.points.splice(x, 1);
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

    public queryBoundry(b: Boundry): Point[] {
        // Prepare an array of results
        let pointsInRange: Point[] = [];

        // leave if the boundry does not intersect this quad
        if (!this.boundry.intersects(b)) {
            return pointsInRange; // empty list
        }

        // Check objects on this quad
        for (let x = 0; x < this.points.length; x++) {
            if (b.containsPoint(this.points[x])) {
                pointsInRange.push(this.points[x]);
            }
        }

        // stop here if we haven't subdived
        if (!this.isDivided) {
            return pointsInRange;
        }

        // add points from children
        for (let p of this.topLeft.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        for (let p of this.topRight.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        for (let p of this.bottomLeft.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        for (let p of this.bottomRight.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        return pointsInRange;
    }

    public clear() {
        this.points = [];
        this.isDivided = false;
    }

    public debugQuad(context: CanvasRenderingContext2D) {
        context.strokeStyle = '#eee';
        context.lineWidth = .5;

        context.strokeRect(this.boundry.x, this.boundry.y, this.boundry.w, this.boundry.h);

        if (this.isDivided) {
            this.topLeft.debugQuad(context);
            this.topRight.debugQuad(context);
            this.bottomLeft.debugQuad(context);
            this.bottomRight.debugQuad(context);
        }
    }
}
