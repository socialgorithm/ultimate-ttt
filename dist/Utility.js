"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = (value) => {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};
//# sourceMappingURL=Utility.js.map