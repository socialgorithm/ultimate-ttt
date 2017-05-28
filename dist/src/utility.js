"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};
//# sourceMappingURL=utility.js.map