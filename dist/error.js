"use strict";
exports.__esModule = true;
function default_1(error, data) {
    return new Error(error.message.replace('%s', data), error.code);
}
exports["default"] = default_1;
//# sourceMappingURL=error.js.map