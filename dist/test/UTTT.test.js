"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var UTTT_1 = require("../src/UTTT");
var constants_1 = require("../src/model/constants");
var playerPairs = [['player 0', constants_1.ME], ['player 1', constants_1.OPPONENT]];
var coordinates = [0, 1, 2].map(function (x) { return [0, 1, 2].map(function (y) { return [x, y]; }); }).reduce(function (a, b) { return a.concat(b); }, []);
var sampleMove = [1, 2];
var sequenceOfPairs = function () {
    var pairs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pairs[_i] = arguments[_i];
    }
    return pairs.map(function (current, index) {
        if (index === 0) {
            return undefined;
        }
        else {
            var previous = pairs[index - 1];
            return [previous, current];
        }
    }).slice(1);
};
describe('UTTT', function () {
    var subject;
    var runWinningSequence = function (player) {
        sequenceOfPairs([0, 0], [0, 0], [1, 0], [0, 0], [2, 0], [1, 0], [1, 0], [2, 0], [2, 0], [0, 0]).forEach(function (_a) {
            var board = _a[0], move = _a[1];
            subject = subject.move(player, board, move);
        });
    };
    beforeEach(function () {
        subject = new UTTT_1.default();
    });
    describe('#constructor()', function () {
        it('will construct correctly', function () {
            chai_1.expect(subject).to.be.an('object');
            chai_1.expect(subject.isFinished).to.be.a('function');
            chai_1.expect(subject.getResult).to.be.a('function');
            chai_1.expect(subject.isValidMove).to.be.a('function');
            chai_1.expect(subject.addMyMove).to.be.a('function');
            chai_1.expect(subject.addOpponentMove).to.be.a('function');
            chai_1.expect(subject.prettyPrint).to.be.a('function');
        });
        it('will correctly populate an initial board', function () {
            chai_1.expect(subject.board).to.be.an('array');
            subject.board.forEach(function (row) {
                chai_1.expect(row).to.be.an('array');
                row.forEach(function (cell) {
                    chai_1.expect(cell.winner).to.be.undefined;
                });
            });
        });
    });
    describe('#move(), #addMyMove(), #addOpponent()', function () {
        playerPairs.forEach(function (_a) {
            var label = _a[0], player = _a[1];
            var opponent = 1 - player;
            var testSequence = function () {
                sequenceOfPairs([1, 0], [0, 0], [2, 1], [1, 0], [0, 1]).forEach(function (_a, index) {
                    var board = _a[0], move = _a[1];
                    var current = (player + index) % 2;
                    subject = subject.move(current, board, move);
                });
            };
            it("will correctly use the player wrapper for " + label, function () {
                if (player === constants_1.ME) {
                    subject = subject.addMyMove([1, 0], [0, 0]);
                }
                else if (player === constants_1.OPPONENT) {
                    subject = subject.addOpponentMove([1, 0], [0, 0]);
                }
                var target = subject.board[1][0].board[0][0];
                chai_1.expect(target.player).to.equal(player);
                chai_1.expect(target.mainIndex).to.equal(0);
                chai_1.expect(target.subBoardIndex).to.equal(0);
            });
            it("will correctly update the board when " + label + " moves", function () {
                testSequence();
                var target = subject.board[1][0].board[0][0];
                chai_1.expect(target.player).to.equal(player);
                chai_1.expect(target.mainIndex).to.equal(0);
                chai_1.expect(target.subBoardIndex).to.equal(0);
            });
            it("will correctly update the board whenthe opponent of " + label + " moves in a different board", function () {
                testSequence();
                var target = subject.board[0][0].board[2][1];
                chai_1.expect(target.player).to.equal(opponent);
                chai_1.expect(target.mainIndex).to.equal(1);
                chai_1.expect(target.subBoardIndex).to.equal(0);
            });
            it("will correctly update when the second move of " + label + " is in a different board", function () {
                testSequence();
                var target = subject.board[2][1].board[1][0];
                chai_1.expect(target.player).to.equal(player);
                chai_1.expect(target.mainIndex).to.equal(2);
                chai_1.expect(target.subBoardIndex).to.equal(0);
            });
            it("will correctly update when " + label + " returns to move in the same board", function () {
                testSequence();
                var target = subject.board[1][0].board[0][1];
                chai_1.expect(target.player).to.equal(opponent);
                chai_1.expect(target.mainIndex).to.equal(3);
                chai_1.expect(target.subBoardIndex).to.equal(1);
            });
            it("will reject a move by " + label + " in the wrong board", function () {
                subject = subject.move(opponent, [1, 0], [0, 0]);
                chai_1.expect(function () { return subject.move(player, [2, 0], [2, 1]); }).to.throw();
            });
            it("will reject an invalid move by " + label, function () {
                chai_1.expect(function () { return subject.move(player, [0, 0], [-1, 0]); }).to.throw();
                chai_1.expect(function () { return subject.move(player, [-1, 0], [0, 0]); }).to.throw();
                chai_1.expect(function () { return subject.move(player, [-1, -1], [-1, -1]); }).to.throw();
            });
            it("will not allow " + label + " to play on a board that has already been won", function () {
                sequenceOfPairs([0, 0], [0, 0], [1, 0], [0, 0], [2, 0], [0, 0]).forEach(function (_a) {
                    var board = _a[0], move = _a[1];
                    subject = subject.move(player, board, move);
                });
                chai_1.expect(function () { return subject.move(player, [0, 0], [1, 1]); });
            });
            it("will throw if " + label + " tries to move and the game is over", function () {
                runWinningSequence(opponent);
                chai_1.expect(function () { return subject.move(player, [0, 0], [0, 0]); }).to.throw();
            });
        });
        it("will throw if an invalid player attempts to move", function () {
            chai_1.expect(function () { return subject.move(3, [0, 0], [0, 0]); }).to.throw();
        });
    });
    describe('#isValidMove()', function () {
        playerPairs.forEach(function (_a) {
            var label = _a[0], player = _a[1];
            it("will reject an invalid move by " + label, function () {
                chai_1.expect(subject.isValidMove([0, 0], [-1, 0])).to.be.false;
                chai_1.expect(subject.isValidMove([-1, 0], [0, 0])).to.be.false;
                chai_1.expect(subject.isValidMove([-1, -1], [-1, -1])).to.be.false;
            });
        });
    });
    describe('#isFinished(), #getResult()', function () {
        it("will correctly report when a game has yet to finish", function () {
            chai_1.expect(subject.isFinished()).to.be.false;
        });
        playerPairs.forEach(function (_a) {
            var label = _a[0], player = _a[1];
            var opponent = player - 1;
            it("will correctly report when " + label + " has won", function () {
                runWinningSequence(player);
                chai_1.expect(subject.isFinished()).to.be.true;
                chai_1.expect(subject.getResult()).to.equal(player);
            });
        });
    });
    describe('#getValidBoards()', function () {
        it('will list all valid moves', function () {
            sequenceOfPairs([0, 0], [0, 0], [1, 0], [0, 0], [2, 0]).forEach(function (_a) {
                var board = _a[0], move = _a[1];
                subject = subject.addMyMove(board, move);
            });
            var remaining = coordinates.slice().filter(function (m) { return !(m[0] === 0 && m[1] === 0); });
            chai_1.expect(subject.getValidBoards()).to.have.deep.members(remaining);
        });
    });
    describe('#prettyPrint()', function () {
        it('will yield the expected string', function () {
            chai_1.expect(subject.prettyPrint()).to.be.a('string');
        });
    });
    describe('#getMoves()', function () {
        it('will yield the expected count', function () {
            chai_1.expect(subject.getMoves()).to.equal(0);
            subject = subject.move(constants_1.ME, [0, 0], [0, 0]);
            chai_1.expect(subject.getMoves()).to.equal(1);
        });
    });
});
//# sourceMappingURL=UTTT.test.js.map