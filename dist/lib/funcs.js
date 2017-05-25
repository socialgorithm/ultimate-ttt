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
exports.winner = function (board) {
    var count = 0;
    for (var i = 0; i < 3; ++i)
        for (var j = 0; j < 3; ++j)
            if (board[i][j] > -1 || board[i][j] < -1)
                ++count;
    if (count == 9)
        return -2;
    for (var i = 0; i < 3; ++i) {
        var r = board[i][0] == board[i][1] && board[i][1] == board[i][2];
        if (r)
            return board[i][0];
        var c = board[0][i] == board[1][i] && board[1][i] == board[2][i];
        if (c)
            return board[0][i];
    }
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
        return board[0][0];
    if (board[2][0] == board[1][1] && board[1][1] == board[0][2])
        return board[0][0];
    return -1;
};
//# sourceMappingURL=funcs.js.map