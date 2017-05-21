"use strict";
exports.__esModule = true;
var ava_1 = require("ava");
var SubBoard_1 = require("../model/SubBoard");
var Cell_1 = require("../model/Cell");
var SubBoard_2 = require("../model/SubBoard");
var errors_1 = require("../model/errors");
var error_1 = require("../error");
function validateBoard(board, t) {
    t["true"](Array.isArray(board));
    board.forEach(function (row) {
        t["true"](Array.isArray(row));
        row.forEach(function (cell) {
            t["true"](cell.player >= -1);
            t["true"](cell.player <= 2);
            t["true"](cell.subBoardIndex >= -1);
            t["true"](cell.mainIndex >= -1);
        });
    });
}
ava_1["default"]('Returns a valid SubBoard model', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.is(typeof (subBoard), 'object');
    t.is(typeof (subBoard.isFinished), 'function');
    t.is(typeof (subBoard.getResult), 'function');
    t.is(typeof (subBoard.isValidMove), 'function');
    t.is(typeof (subBoard.addMyMove), 'function');
    t.is(typeof (subBoard.addOpponentMove), 'function');
    t.is(typeof (subBoard.prettyPrint), 'function');
    validateBoard(subBoard.board, t);
});
ava_1["default"]('getResult fails if unfinished', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.throws(function () {
        subBoard.getResult();
    }, error_1["default"](errors_1["default"].gameNotFinished).message);
});
ava_1["default"]('Move correctly updates the board', function (t) {
    var subBoard = new SubBoard_1["default"]();
    subBoard = subBoard.addMyMove([0, 0]);
    subBoard = subBoard.addOpponentMove([2, 1]);
    var emptyCell = new Cell_1["default"]();
    var myCell = new Cell_1["default"](SubBoard_2.ME, 0);
    var opponentCell = new Cell_1["default"](SubBoard_2.OPPONENT, 1);
    t.deepEqual(subBoard.board[0][0], myCell);
    t.deepEqual(subBoard.board[0][1], emptyCell);
    t.deepEqual(subBoard.board[0][2], emptyCell);
    t.deepEqual(subBoard.board[1][0], emptyCell);
    t.deepEqual(subBoard.board[1][1], emptyCell);
    t.deepEqual(subBoard.board[1][2], emptyCell);
    t.deepEqual(subBoard.board[2][0], emptyCell);
    t.deepEqual(subBoard.board[2][1], opponentCell);
    t.deepEqual(subBoard.board[2][2], emptyCell);
});
ava_1["default"]('Move rejects invalid player', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.throws(function () { subBoard._move(-1, 1); }, error_1["default"](errors_1["default"].player, '-1').message);
    t.throws(function () { subBoard._move('abc', 1); }, error_1["default"](errors_1["default"].player, 'abc').message);
    t.throws(function () { subBoard._move(3, 1); }, error_1["default"](errors_1["default"].player, '3').message);
});
ava_1["default"]('Move rejects invalid moves', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.throws(function () { subBoard._move(1); }, error_1["default"](errors_1["default"].move).message);
    t.throws(function () { subBoard._move(1, 1); }, error_1["default"](errors_1["default"].move, 1).message);
    t.throws(function () { subBoard._move(1, 'abc'); }, error_1["default"](errors_1["default"].move, 'abc').message);
    t.throws(function () { subBoard._move(1, []); }, error_1["default"](errors_1["default"].move, []).message);
    t.throws(function () { subBoard._move(1, [1]); }, error_1["default"](errors_1["default"].move, [1]).message);
    t.throws(function () { subBoard._move(1, [1, 4]); }, error_1["default"](errors_1["default"].move, [1, 4]).message);
    t.throws(function () { subBoard._move(1, [-1, 4]); }, error_1["default"](errors_1["default"].move, [-1, 4]).message);
    t.throws(function () { subBoard._move(1, [1, 1, 1]); }, error_1["default"](errors_1["default"].move, [1, 1, 1]).message);
});
ava_1["default"]('Move rejects repeated moves', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.notThrows(function () { subBoard.addMyMove([1, 1]); });
    t.throws(function () { subBoard.addOpponentMove([1, 1]); }, error_1["default"](errors_1["default"].move, [1, 1]).message);
});
ava_1["default"]('Move rejects moves after board is full', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 0]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([0, 1]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 2]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([1, 0]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([2, 0]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([1, 1]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([1, 2]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([2, 2]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([2, 1]); });
    t["true"](subBoard.isFinished());
    t.throws(function () { subBoard.addOpponentMove([1, 1]); }, error_1["default"](errors_1["default"].boardFinished).message);
});
ava_1["default"]('Can pretty print a board', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.notThrows(function () {
        subBoard.prettyPrint();
        t.is(typeof subBoard.prettyPrint(), 'string');
    });
});
ava_1["default"]('Detect winning row', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 0]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([1, 1]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 2]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([1, 0]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 1]); });
    t["true"](subBoard.isFinished());
    t.is(subBoard.getResult(), SubBoard_2.ME);
});
ava_1["default"]('Detect winning column', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 0]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([1, 1]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([2, 0]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([0, 1]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([1, 0]); });
    t["true"](subBoard.isFinished());
    t.is(subBoard.getResult(), SubBoard_2.ME);
});
ava_1["default"]('Detect winning RtL diagonal', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 0]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([2, 1]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([1, 1]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([2, 0]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([2, 2]); });
    t["true"](subBoard.isFinished());
    t.is(subBoard.getResult(), SubBoard_2.ME);
});
ava_1["default"]('Detect winning LtR diagonal', function (t) {
    var subBoard = new SubBoard_1["default"]();
    t.notThrows(function () { subBoard = subBoard.addMyMove([2, 0]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([2, 1]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([1, 1]); });
    t.notThrows(function () { subBoard = subBoard.addOpponentMove([1, 0]); });
    t.notThrows(function () { subBoard = subBoard.addMyMove([0, 2]); });
    t["true"](subBoard.isFinished());
    t.is(subBoard.getResult(), SubBoard_2.ME);
});
//# sourceMappingURL=SubBoard.test.js.map