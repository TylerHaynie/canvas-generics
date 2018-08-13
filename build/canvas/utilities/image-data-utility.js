"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImageDataUtility {
    constructor(context) {
        this.context = context;
    }
    createImageDataBySize(w, h) {
        return this.context.createImageData(w, h);
    }
    createImageDataImageData(id) {
        return this.context.createImageData(id);
    }
}
exports.ImageDataUtility = ImageDataUtility;
//# sourceMappingURL=image-data-utility.js.map