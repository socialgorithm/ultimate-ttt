"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UTTTError_1 = require("./model/UTTTError");
function default_1(error, data) {
    return new UTTTError_1.default(error.message.replace('%s', data), error.code);
}
exports.default = default_1;
//# sourceMappingURL=error.js.map