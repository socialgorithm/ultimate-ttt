"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(error, data) {
    return new UTTTError(error.message.replace("%s", data), error.code);
}
exports.default = default_1;
class UTTTError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.code = code;
    }
}
//# sourceMappingURL=Error.js.map