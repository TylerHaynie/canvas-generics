"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_utility_1 = require("canvas/utilities/helper-utility");
const pan_zoom_manager_1 = require("canvas/managers/pan-zoom-manager");
const mouse_manager_1 = require("canvas/managers/mouse-manager");
const keyboard_manager_1 = require("canvas/managers/keyboard-manager");
const window_manager_1 = require("canvas/managers/window-manager");
const canvas_enums_1 = require("canvas/events/canvas-enums");
const ui_manager_1 = require("canvas/managers/ui-manager");
class CanvasWrapper {
    constructor(context, drawCallback) {
        this._pauseKeys = ['p', 'P'];
        this._frameForwardKeys = ['>', '.'];
        this.paused = false;
        this.frameStep = false;
        this._overlayAsBackground = false;
        this._enableGrid = true;
        this._trackMouse = true;
        this.transformChanged = false;
        this.needsFlip = false;
        this._context = context;
        this.setupManagers();
        this.setupUtilities();
        this.registerEvents();
        this.setupCanvas();
        this.uiManager.addToMainBuffer(drawCallback);
        this._WindowManager.fit();
    }
    get drawingContext() { return this._context; }
    get mouseManager() { return this._mouseManager; }
    get panZoomManager() { return this._panZoomManager; }
    get keyboardManager() { return this._keyboardManager; }
    get uiManager() { return this._uiManager; }
    get bounds() { return this._context.canvas.getBoundingClientRect(); }
    get width() { return this._context.canvas.width; }
    get height() { return this._context.canvas.height; }
    set pauseKeys(v) { this._pauseKeys = v; }
    set frameForwardKeys(v) { this.frameForwardKeys = v; }
    set enableGrid(v) { this._enableGrid = v; }
    set overlayAsBackground(v) { this._overlayAsBackground = v; }
    set trackMouse(v) { this._trackMouse = v; }
    start() {
        this.draw();
    }
    saveContext() {
        this._context.save();
    }
    restoreContext() {
        this._context.restore();
    }
    setupManagers() {
        this._WindowManager = new window_manager_1.WindowManager(this._context);
        this._mouseManager = new mouse_manager_1.MouseManager(this._context);
        this._keyboardManager = new keyboard_manager_1.KeyboardManager(this._context);
        this._uiManager = new ui_manager_1.UIManager(this._mouseManager);
        this._panZoomManager = new pan_zoom_manager_1.PanZoomManager(this._context, this._mouseManager);
    }
    setupUtilities() {
        this.helperUtility = new helper_utility_1.HelperUtility(this._context);
    }
    registerEvents() {
        this._mouseManager.on(canvas_enums_1.MOUSE_EVENT_TYPE.MOVE, (e) => {
            this.mouseMoved(e);
        });
        this._mouseManager.on(canvas_enums_1.MOUSE_EVENT_TYPE.DOWN, (e) => {
            this.mouseDown(e);
        });
        this._mouseManager.on(canvas_enums_1.MOUSE_EVENT_TYPE.UP, (e) => {
            this.mouseUp(e);
        });
        this._mouseManager.on(canvas_enums_1.MOUSE_EVENT_TYPE.OUT, (e) => {
            this.mouseLeave(e);
        });
        this._panZoomManager.on(canvas_enums_1.PAN_ZOOM_EVENT_TYPE.ZOOM, (e) => {
            this.panZoomChanged(e);
        });
        this._panZoomManager.on(canvas_enums_1.PAN_ZOOM_EVENT_TYPE.PAN, (e) => {
            this.panZoomChanged(e);
        });
        this._panZoomManager.on(canvas_enums_1.PAN_ZOOM_EVENT_TYPE.RESET, (e) => {
            this.panZoomChanged(e);
        });
    }
    mouseMoved(e) {
        this.currentMouseData = e;
    }
    mouseDown(e) {
        this.currentMouseData = e;
    }
    mouseUp(e) {
        this.currentMouseData = e;
    }
    mouseLeave(e) {
        this.currentMouseData = e;
    }
    panZoomChanged(e) {
        this.transformChanged = true;
        this.PanZoomData = e;
    }
    setupCanvas() {
        this._context.canvas.tabIndex = 1000;
        this._context.canvas.style.outline = 'none';
        this._context.mozImageSmoothingEnabled = false;
        this._context.imageSmoothingEnabled = false;
    }
    draw() {
        if (this._uiManager.debugEnabled) {
            this.delta = performance.now() - this.lastRender;
            this.fps = Math.floor(1000 / this.delta);
        }
        this.checkKeys();
        if (!this.paused || this.frameStep) {
            this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            this.saveContext();
            if (this._overlayAsBackground) {
                this.drawGrid();
            }
            this.applyPanAndZoom();
            this._uiManager.drawMainBuffer();
            if (this._uiManager.uiEnabled) {
                this._uiManager.drawUiBuffer();
            }
            if (this._uiManager.debugEnabled) {
                this._uiManager.drawDebugBuffer();
            }
            this.trackMousePosition();
            if (!this._overlayAsBackground) {
                this.drawGrid();
            }
            this.drawMouse();
            this.restoreContext();
            this.frameStep = false;
        }
        this._keyboardManager.update();
        if (this._uiManager.debugEnabled) {
            this._context.fillStyle = 'yellow';
            this._context.font = '14px courier new';
            this._context.fillText(this.fps.toString(), 15, 15);
            this.lastRender = performance.now();
        }
        requestAnimationFrame(() => this.start());
    }
    applyPanAndZoom() {
        if (this.PanZoomData) {
            this._context.translate(this.PanZoomData.pan.x, this.PanZoomData.pan.y);
            this._context.scale(this.PanZoomData.scale, this.PanZoomData.scale);
            this.mouseManager.contextupdated(this.PanZoomData);
        }
    }
    drawGrid() {
        if (this._enableGrid) {
            this.helperUtility.drawGrid('rgba(30, 30, 30, .80)', 30);
        }
    }
    trackMousePosition() {
        if (this._mouseManager.mouseOnCanvas) {
            if (this.trackMouse) {
                this.helperUtility.trackMouse(this.currentMouseData.mousePosition, 'rgba(255, 255, 255, .80)');
            }
        }
    }
    drawMouse() {
        if (this._mouseManager.mouseOnCanvas) {
            this.helperUtility.drawMouse(this.currentMouseData.mousePosition, this.currentMouseData.uiMouseState);
        }
    }
    checkKeys() {
        let kbm = this._keyboardManager;
        if (kbm.isDirty) {
            if (kbm.hasKeyDown) {
                if (this._pauseKeys.includes(kbm.key)) {
                    this.paused = !this.paused;
                }
                if (this._frameForwardKeys.includes(kbm.key)) {
                    this.frameStep = !this.frameStep;
                }
            }
        }
    }
}
exports.CanvasWrapper = CanvasWrapper;
//# sourceMappingURL=canvas-wrapper.js.map