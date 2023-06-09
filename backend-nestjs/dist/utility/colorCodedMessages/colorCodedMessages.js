"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorCodedMessages = void 0;
class ColorCodedMessages {
    static RedMessage(message) {
        console.error(`\u001b[31m${message}\u001b[0m`);
    }
    static GreenMessage(message) {
        console.log(`\u001b[32m${message}\u001b[0m`);
    }
}
exports.ColorCodedMessages = ColorCodedMessages;
//# sourceMappingURL=colorCodedMessages.js.map