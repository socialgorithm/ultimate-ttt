"use strict";
exports.__esModule = true;
var resolve = require('path').resolve;
function loadPlayer(path, player) {
    try {
        var name_1 = resolve(path);
        var Player = require.main.require(name_1);
        return new Player(player);
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(path) !== -1) {
            console.warn('Cannot find player "%s".\n  Did you forget to install it?\n', path);
        }
        else {
            console.warn('Error during loading "%s" player:\n  %s', path, e.message);
        }
        return false;
    }
}
exports.loadPlayer = loadPlayer;
function validateMethod(player, method) {
    if (typeof (player[method]) !== 'function') {
        throw new Error("Player is missing the " + method + "() method");
    }
}
exports.validateMethod = validateMethod;
function validatePlayer(player) {
    if (!player || typeof (player) !== 'object') {
        throw new Error('Invalid player object');
    }
    validateMethod(player, 'init');
    validateMethod(player, 'getMove');
    validateMethod(player, 'addMove');
    validateMethod(player, 'addOpponentMove');
}
exports.validatePlayer = validatePlayer;
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