"use strict";
exports.__esModule = true;
function round(time) {
    return Math.round(time * 100) / 100;
}
exports.round = round;
function convertExecTime(nanosecs) {
    return round(nanosecs / 1000000);
}
exports.convertExecTime = convertExecTime;
function getPercentage(num, total) {
    if (total < 1) {
        return '0%';
    }
    return Math.floor(num * 100 / total) + '%';
}
exports.getPercentage = getPercentage;
//# sourceMappingURL=funcs.js.map