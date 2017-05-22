"use strict";
exports.__esModule = true;
var ava_1 = require("ava");
var UTTT_1 = require("../UTTT");
var errors_1 = require("../model/errors");
var SubBoard_1 = require("../model/SubBoard");
var error_1 = require("../error");
function validateBoard(board, t) {
    t["true"](Array.isArray(board));
    board.forEach(function (row) {
        t["true"](Array.isArray(row));
        row.forEach(function (cell) {
            t.is(cell.winner, SubBoard_1.RESULT_TIE - 1);
        });
    });
}
ava_1["default"]('Returns a valid UTTT model', function (t) {
    var game = new UTTT_1["default"]();
    t.is(typeof (game), 'object');
    t.is(typeof (game.isFinished), 'function');
    t.is(typeof (game.getResult), 'function');
    t.is(typeof (game.isValidMove), 'function');
    t.is(typeof (game.addMyMove), 'function');
    t.is(typeof (game.addOpponentMove), 'function');
    t.is(typeof (game.prettyPrint), 'function');
    validateBoard(game.board, t);
});
ava_1["default"]('Moves correctly update the board', function (t) {
    var game = new UTTT_1["default"]();
    game = game.addMyMove([1, 0], [0, 0]);
    game = game.addOpponentMove([0, 0], [2, 1]);
    game = game.addMyMove([2, 1], [1, 0]);
    game = game.addOpponentMove([1, 0], [0, 1]);
    t.is(game.board[1][0].board[0][0].player, SubBoard_1.ME);
    t.is(game.board[1][0].board[0][0].mainIndex, 0);
    t.is(game.board[1][0].board[0][0].subBoardIndex, 0);
    t.is(game.board[0][0].board[2][1].player, SubBoard_1.OPPONENT);
    t.is(game.board[0][0].board[2][1].mainIndex, 1);
    t.is(game.board[0][0].board[2][1].subBoardIndex, 0);
    t.is(game.board[2][1].board[1][0].player, SubBoard_1.ME);
    t.is(game.board[2][1].board[1][0].mainIndex, 2);
    t.is(game.board[2][1].board[1][0].subBoardIndex, 0);
    t.is(game.board[1][0].board[0][1].player, SubBoard_1.OPPONENT);
    t.is(game.board[1][0].board[0][1].mainIndex, 3);
    t.is(game.board[1][0].board[0][1].subBoardIndex, 1);
});
ava_1["default"]('Move rejects moves to the wrong board', function (t) {
    var game = new UTTT_1["default"]();
    game = game.addMyMove([1, 0], [0, 0]);
    t.throws(function () {
        game.addOpponentMove([2, 0], [2, 1]);
    }, error_1["default"](errors_1["default"].board, [2, 0]).message);
});
ava_1["default"]('Move rejects invalid moves', function (t) {
    var game = new UTTT_1["default"]();
    t.throws(function () {
        game.addMyMove([0, 0], [-1, 0]);
    }, error_1["default"](errors_1["default"].move, [-1, 0]).message);
    t.throws(function () {
        game.addMyMove([-1, 0], [-1, 1]);
    }, error_1["default"](errors_1["default"].board, [-1, 0]).message);
});
ava_1["default"]('isValidMove returns false on invalid board/move', function (t) {
    var game = new UTTT_1["default"]();
    t["true"](game.isValidMove([0, 0], [0, 0]));
    t["false"](game.isValidMove([-1, 0], [0, 0]));
    t["false"](game.isValidMove([1, 0], [-1, 0]));
});
ava_1["default"]('_move fails on invalid player', function (t) {
    var game = new UTTT_1["default"]();
    t.throws(function () {
        game._move([0, 0], -1, [1, 0]);
    }, error_1["default"](errors_1["default"].player, -1).message);
});
ava_1["default"]('Detect game ending', function (t) {
    var game = new UTTT_1["default"]();
    game = game.addMyMove([0, 0], [0, 0]);
    game = game.addMyMove([0, 0], [1, 0]);
    game = game.addMyMove([1, 0], [0, 0]);
    game = game.addMyMove([0, 0], [2, 0]);
    game = game.addMyMove([2, 0], [1, 0]);
    game = game.addMyMove([1, 0], [1, 0]);
    game = game.addMyMove([1, 0], [2, 0]);
    game = game.addMyMove([2, 0], [2, 0]);
    game = game.addMyMove([2, 0], [0, 0]);
    t["true"](game.isFinished());
    t.throws(function () {
        game.addMyMove([0, 0], [1, 1]);
    }, error_1["default"](errors_1["default"].gameFinished).message);
    t.is(game.getResult(), SubBoard_1.ME);
});
ava_1["default"]('Move doesn\'t allow playing on already won boards', function (t) {
    var game = new UTTT_1["default"]();
    game = game.addMyMove([0, 0], [0, 0]);
    game = game.addMyMove([0, 0], [1, 0]);
    game = game.addMyMove([1, 0], [0, 0]);
    game = game.addMyMove([0, 0], [2, 0]);
    game = game.addMyMove([2, 0], [0, 0]);
    t["false"](game.isFinished());
    t.throws(function () {
        game.addMyMove([0, 0], [1, 1]);
    }, error_1["default"](errors_1["default"].boardFinished).message);
});
ava_1["default"]('Move allows any board after being sent to one that is won', function (t) {
    var game = new UTTT_1["default"]();
    game = game.addMyMove([0, 0], [0, 0]);
    game = game.addMyMove([0, 0], [1, 0]);
    game = game.addMyMove([1, 0], [0, 0]);
    game = game.addMyMove([0, 0], [2, 0]);
    t.notThrows(function () {
        game.addMyMove([2, 0], [0, 0]);
    });
});
ava_1["default"]('A tie in a board works properly', function (t) {
    var game = new UTTT_1["default"]();
    game = game.addMyMove([0, 0], [0, 0]);
    game = game.addOpponentMove([0, 0], [1, 0]);
    game = game.addMyMove([1, 0], [0, 0]);
    game = game.addOpponentMove([0, 0], [2, 0]);
    game = game.addMyMove([2, 0], [0, 0]);
    game = game.addOpponentMove([0, 0], [0, 1]);
    game = game.addMyMove([0, 1], [0, 0]);
    game = game.addOpponentMove([0, 0], [1, 1]);
    game = game.addMyMove([1, 1], [0, 0]);
    game = game.addOpponentMove([0, 0], [1, 2]);
    game = game.addMyMove([1, 2], [0, 0]);
    game = game.addOpponentMove([0, 2], [2, 1]);
    game = game.addMyMove([2, 1], [0, 0]);
    game = game.addOpponentMove([2, 2], [0, 2]);
    game = game.addMyMove([0, 2], [1, 1]);
    game = game.addOpponentMove([1, 1], [2, 2]);
    game = game.addMyMove([2, 2], [1, 2]);
    t.notThrows(function () {
        game.prettyPrint();
    });
});
//# sourceMappingURL=UTTT.test.js.map