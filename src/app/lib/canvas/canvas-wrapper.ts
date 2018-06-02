import { MouseManager } from './managers/mouse-manager';
import { PanZoomManager } from './managers/pan-zoom-manager';
import { RandomUtility } from './utilities/random-utility';
import { ColorUtility } from './utilities/color-utility';
import { ParticleUtility } from './utilities/particle-utility';
import { ShapeUtility } from './utilities/shape-utility';
import { GraidentUtility } from './utilities/graident-utility';
import { ImageDataUtility } from './utilities/image-data-utility';
import { PatternUtility } from './utilities/pattern-utility';
import { KeyboardManager } from './managers/keyboard-manager';
import { WindowManager } from './managers/window-manager';

export class CanvasWrapper {

    // public properties
    public get mouseManager() { return this._mouseManager; }
    public get panZoomManager() { return this._panZoomManager; }
    public get keyboardManager() { return this._keyboardManager; }

    public set pauseKeys(v: string[]) { this._pauseKeys = v; }
    public set frameForwardKeys(v: string[]) { this._pauseKeys = v; }

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

    // context
    private _context: CanvasRenderingContext2D;
    private drawCallback: () => void;

    // control
    private _pauseKeys: string[] = ['p', 'P'];
    private _frameForwardKey: string[] = ['>', '.'];
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
    private _keyboardManager: KeyboardManager;
    private _WindowManager: WindowManager;

    constructor(context: CanvasRenderingContext2D, drawCallback: () => void) {
        this._context = context;
        this.drawCallback = drawCallback;

        this.setupManagers();
        this.setupUtilities();
        this.setupCanvas();

        this._WindowManager.resize();
    }

    start() {
        this.draw();
    }

    saveContext() {
        this._context.save();
    }

    restoreContext() {
        this._context.restore();
    }

    private setupManagers() {
        this._WindowManager = new WindowManager(this._context);
        this._mouseManager = new MouseManager(this._context);
        this._keyboardManager = new KeyboardManager(this._context);
        this._panZoomManager = new PanZoomManager(this._context, this._mouseManager);
    }

    private setupUtilities() {
        this.randomUtil = new RandomUtility();
        this.colorUtil = new ColorUtility();
        this.particleUtil = new ParticleUtility();
        this.shapeUtil = new ShapeUtility(this._context);
        this.graidentUtility = new GraidentUtility(this._context);
        this.imageDataUtility = new ImageDataUtility(this._context);
        this.patternUtility = new PatternUtility(this._context);
    }

    private setupCanvas() {
        this._context.canvas.tabIndex = 1000; // canvas needs a tabindex so we can listen for keyboard events
        this._context.canvas.style.outline = 'none'; // removing the focus outline

        // for better image quality
        this._context.mozImageSmoothingEnabled = false;  // firefox
        this._context.imageSmoothingEnabled = false; // everything else
    }

    private draw() {
        // check for key input
        this.checkKeys();

        if (!this.paused || this.frameStep) {
            this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            this.saveContext();

            // update the managers
            // ** Order matters! **
            this._panZoomManager.update();
            this._mouseManager.update();

            // if pan zoom has changed we need to update the context
            if (this._panZoomManager.isDirty) {
                this._context.setTransform(this._panZoomManager.scale, 0, 0, this._panZoomManager.scale, this._panZoomManager.panX, this._panZoomManager.panY);
            }

            // do the draw callback
            this.drawCallback();

            this.restoreContext();
            this.frameStep = false;
        }

        // update keyboard
        this._keyboardManager.update();

        // do it all again
        requestAnimationFrame(() => this.start());
    }

    private checkKeys() {
        let kbm = this._keyboardManager;

        if (kbm.isDirty) {
            if (kbm.hasKeyDown) {
                console.log(kbm.key);
                if (this._pauseKeys.includes(kbm.key)) {
                    this.paused = !this.paused;
                }

                if (this._frameForwardKey.includes(kbm.key)) {
                    this.frameStep = !this.frameStep;
                }
            }
        }

    }

}
