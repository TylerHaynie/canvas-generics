import { MouseManager } from './managers/mouse-manager';
import { PanZoomManager } from './managers/pan-zoom-manager';
import { RandomUtility } from './utilities/random-utility';
import { ColorUtility } from './utilities/color-utility';
import { ParticleUtility } from './utilities/particle-utility';
import { ShapeUtility } from './utilities/shape-utility';
import { GraidentUtility } from './utilities/graident-utility';
import { ImageDataUtility } from './utilities/image-data-utility';
import { PatternUtility } from './utilities/patternUtility';

export class CanvasWrapper {
    // context
    private _context: CanvasRenderingContext2D;
    private drawCallback: () => void;

    // control
    private paused = false;
    private frameStep: boolean = false;

    // utils
    private randomUtil: RandomUtility;
    private colorUtil: ColorUtility;
    private particleUtil: ParticleUtility;
    private shapeUtil: ShapeUtility;
    private graidentUtility: GraidentUtility;
    private imageDataUtility: ImageDataUtility;
    private patternUtility: PatternUtility;

    // managers
    private _panZoomManager: PanZoomManager;
    private _mouseManager: MouseManager;

    // public properties
    public get mouseManager() { return this._mouseManager; }
    public get panZoomManager() { return this._panZoomManager; }

    public get randoms() { return this.randomUtil; }
    public get colors() { return this.colorUtil; }
    public get particles() { return this.particleUtil; }
    public get shapes() { return this.shapeUtil; }
    public get graident() { return this.graidentUtility; }
    public get imageData() { return this.imageDataUtility; }
    public get pattern() { return this.patternUtility; }

    public get bounds() { return this._context.canvas.getBoundingClientRect(); }
    public get width() { return this._context.canvas.width; }
    public get height() { return this._context.canvas.height; }

    constructor(context: CanvasRenderingContext2D, drawCallback: () => void) {
        this._context = context;
        this.drawCallback = drawCallback;

        this.registerComponents();

        this.setupUtils();
        this.setupCanvas();
        this.registerEvents();

        this.fitCanvasToContainer();
    }

    public start() {
        this.draw();
    }

    private setupCanvas() {
        this._context.canvas.tabIndex = 1000; // canvas needs a tabindex so we can listen for keyboard events
        this._context.canvas.style.outline = 'none'; // removing the focus outline

        // for better image quality
        this._context.mozImageSmoothingEnabled = false;  // firefox
        this._context.imageSmoothingEnabled = false; // everything else
    }

    private setupUtils() {
        this.randomUtil = new RandomUtility();
        this.colorUtil = new ColorUtility();
        this.particleUtil = new ParticleUtility();
        this.shapeUtil = new ShapeUtility(this._context);
        this.graidentUtility = new GraidentUtility(this._context);
        this.imageDataUtility = new ImageDataUtility(this._context);
        this.patternUtility = new PatternUtility(this._context);
    }

    private registerEvents() {
        const cv = this._context.canvas;

        window.onresize = () => {
            this.fitCanvasToContainer();
        };

        cv.onkeydown = (e: KeyboardEvent) => {
            if (e.key === 'p' || e.key === 'P') {
                this.paused = !this.paused;
            }

            if (e.key === '>' || e.key === '.') {
                this.frameStep = !this.frameStep;
            }
        };

    }

    private registerComponents() {
        this._mouseManager = new MouseManager(this._context);
        this._panZoomManager = new PanZoomManager(this._mouseManager);
    }

    private draw() {
        if (!this.paused || this.frameStep) {
            this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            this.saveContext();

            // update the managers
            // ** Order matters! **
            this.panZoomManager.update();
            this.mouseManager.update();

            // if pan zoom has changed we need to update the context
            if (this._panZoomManager.isDirty) {
                this._context.setTransform(this._panZoomManager.scale, 0, 0, this._panZoomManager.scale, this._panZoomManager.panX, this._panZoomManager.panY);
            }

            // do the draw callback
            this.drawCallback();

            this.restoreContext();
            this.frameStep = false;
        }
        // do it all again
        requestAnimationFrame(() => this.start());
    }

    saveContext() {
        this._context.save();
    }

    restoreContext() {
        this._context.restore();
    }

    private fitCanvasToContainer() {
        // Make it visually fill the positioned parent
        this._context.canvas.style.width = '100%';
        this._context.canvas.style.height = '100%';

        // ...then set the internal size to match
        this._context.canvas.width = this._context.canvas.offsetWidth;
        this._context.canvas.height = this._context.canvas.offsetHeight;
    }
}
