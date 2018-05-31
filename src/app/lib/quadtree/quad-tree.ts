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
        if (p.x > this.x - this.w &&
            p.x < this.x + this.w &&
            p.y > this.y - this.h &&
            p.y < this.y + this.h) {
            return true;
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
    northWest: QuadTree;
    northEast: QuadTree;
    southWest: QuadTree;
    southEast: QuadTree;

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
        }

        if (this.northWest.insert(p)) { return true; }
        if (this.northEast.insert(p)) { return true; }
        if (this.southWest.insert(p)) { return true; }
        if (this.southEast.insert(p)) { return true; }

        // something went wrong
        return false;
    }

    private subdivide() {
        let x = this.boundry.x;
        let y = this.boundry.y;
        let w = this.boundry.w;
        let h = this.boundry.h;

        // NorthEast
        let neBounds = new Boundry(x + w / 2, y, w / 2, h / 2);
        this.northEast = new QuadTree(neBounds, this.capicity);

        // NorthWest
        let nwBounds = new Boundry(x, y, w / 2, h / 2);
        this.northWest = new QuadTree(nwBounds, this.capicity);

        // SouthEast
        let seBounds = new Boundry(w / 2, h / 2, w / 2, h / 2);
        this.southEast = new QuadTree(seBounds, this.capicity);

        // SouthWest
        let swBounds = new Boundry(x, y + h / 2, w / 2, h / 2);
        this.southWest = new QuadTree(swBounds, this.capicity);

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
        for (let p of this.northWest.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        for (let p of this.northEast.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        for (let p of this.southWest.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        for (let p of this.southEast.queryBoundry(b)) {
            pointsInRange.push(p);
        }

        return pointsInRange;
    }

    public clear() {
        this.points = [];
        this.isDivided = false;
        this.northEast = null;
        this.northWest = null;
        this.southEast = null;
        this.southWest = null;
    }

}