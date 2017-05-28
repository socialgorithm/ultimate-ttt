"use strict";
exports.__esModule = true;
exports.round = function (time) {
    return Math.round(time * 100) / 100;
};
exports.convertExecTime = function (nanosecs) {
    return exports.round(nanosecs / 1000000);
};
exports.getPercentage = function (num, total) {
    if (total < 1) {
        return '0%';
    }
    return Math.floor(num * 100 / total) + '%';
};
//# sourceMappingURL=funcs.js.map