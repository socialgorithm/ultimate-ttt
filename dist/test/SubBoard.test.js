"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var SubBoard_1 = require("../src/SubBoard");
var constants_1 = require("../src/model/constants");
var playerPairs = [['player 0', constants_1.ME], ['player 1', constants_1.OPPONENT]];
var coordinates = [0, 1, 2].map(function (x) { return [0, 1, 2].map(function (y) { return [x, y]; }); }).reduce(function (a, b) { return a.concat(b); }, []);
var sampleMove = [1, 2];
describe('SubBoard', function () {
    var subject;
    var addMoves = function (target) {
        var moves = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            moves[_i - 1] = arguments[_i];
        }
        return moves.forEach(function (move) { subject = subject.move(target, move); });
    };
    var fillBoard = function () {
        coordinates.forEach(function (coords, idx) {
            subject = subject.move((idx > 5 ? ((idx + 1) % 2) : (idx % 2)), coords);
        });
    };
    beforeEach(function () {
        subject = new SubBoard_1.default();
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
        it('will correctly populate the board', function () {
            coordinates.forEach(function (_a) {
                var row = _a[0], col = _a[1];
                chai_1.expect(subject.board[row][col].player).to.equal(-1);
            });
        });
    });
    describe('#move(), #addMyMove(), #addOpponentMove()', function () {
        playerPairs.map(function (_a) {
            var label = _a[0], player = _a[1];
            it("will correctly add a move for " + label, function () {
                subject = subject.move(player, sampleMove);
                coordinates.forEach(function (_a) {
                    var row = _a[0], col = _a[1];
                    var isTarget = row == sampleMove[0] && col == sampleMove[1];
                    chai_1.expect(subject.board[row][col].player).to.equal(isTarget ? player : -1);
                });
            });
        });
        it('will reject an invalid player', function () {
            [-1, 'abc', 3].forEach(function (player) {
                chai_1.expect(function () { return subject.move(player, [1, 1]); }).to.throw();
            });
        });
        playerPairs.map(function (_a) {
            var label = _a[0], player = _a[1];
            it("will reject an invalid move by " + label, function () {
                [undefined, 1, 'abc', [], [1], [1, 4], [-1, 4], [1, 1, 1]].forEach(function (move) {
                    chai_1.expect(function () { return subject.move(player, move); }).to.throw();
                });
            });
            it("will reject " + label + " repeating their opponent's move", function () {
                subject = subject.move(1 - player, sampleMove);
                chai_1.expect(function () { return subject.move(player, sampleMove); }).to.throw();
            });
            it("will reject " + label + " repeating their own move", function () {
                subject = subject.move(player, sampleMove);
                chai_1.expect(function () { return subject.move(player, sampleMove); }).to.throw();
            });
            it("will reject a move by " + label + " on a full board", function () {
                fillBoard();
                chai_1.expect(function () { return subject.move(player, sampleMove); }).to.throw();
            });
            it("will reject a move by " + label + " where the board has been won", function () {
                addMoves(player, [0, 0], [1, 1], [2, 2]);
                chai_1.expect(function () { return subject.move(player, sampleMove); }).to.throw();
            });
        });
    });
    describe('#isFull()', function () {
        it("will correctly report a non-full board", function () {
            chai_1.expect(subject.isFull()).to.be.false;
        });
        it("will correctly report a full board", function () {
            fillBoard();
            chai_1.expect(subject.isFull()).to.be.true;
        });
    });
    describe('#isFinished(), #getResult()', function () {
        it('will correctly report an unfinished board', function () {
            chai_1.expect(subject.isFinished()).to.be.false;
            chai_1.expect(subject.winner).to.be.undefined;
        });
        it('will fail to get the result of an unfinished board', function () {
            chai_1.expect(function () { return subject.getResult(); }).to.throw();
        });
        it('will correctly report a full board', function () {
            fillBoard();
            chai_1.expect(subject.isFinished()).to.be.true;
            chai_1.expect(subject.winner).to.equal(-1);
        });
        playerPairs.forEach(function (_a) {
            var label = _a[0], player = _a[1];
            it("will detect a winning right to left diagonal for " + label, function () {
                addMoves(player, [0, 0], [1, 1], [2, 2]);
                chai_1.expect(subject.isFinished()).to.be.true;
                chai_1.expect(subject.getResult()).to.equal(player);
            });
            it("will detect a winning left to right diagonal for " + label, function () {
                addMoves(player, [2, 0], [1, 1], [0, 2]);
                chai_1.expect(subject.isFinished()).to.be.true;
                chai_1.expect(subject.getResult()).to.equal(player);
            });
            [0, 1, 2].forEach(function (index) {
                it("will detect a win on row " + index + " by " + label, function () {
                    addMoves(player, [index, 0], [index, 1], [index, 2]);
                    chai_1.expect(subject.isFinished()).to.be.true;
                    chai_1.expect(subject.getResult()).to.equal(player);
                });
                it("will detect a win on column " + index + " by " + label, function () {
                    addMoves(player, [0, index], [1, index], [2, index]);
                    chai_1.expect(subject.isFinished()).to.be.true;
                    chai_1.expect(subject.getResult()).to.equal(player);
                });
            });
        });
    });
    describe('#prettyPrint()', function () {
        it('will yield the expected string', function () {
            chai_1.expect(subject.prettyPrint()).to.be.a('string');
        });
    });
    describe('#getValidMoves', function () {
        it('will list all valid moves', function () {
            subject = subject.move(constants_1.ME, [0, 0]);
            var remaining = coordinates.slice().filter(function (m) { return !(m[0] === 0 && m[1] === 0); });
            chai_1.expect(subject.getValidMoves()).to.have.deep.members(remaining);
        });
    });
});
//# sourceMappingURL=SubBoard.test.js.map