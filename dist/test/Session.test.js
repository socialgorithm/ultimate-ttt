"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var Session_1 = require("../src/lib/Session");
describe('Session', function () {
    var subject;
    var player0;
    var player1;
    beforeEach(function () {
        player0 = {
            token: 'player0',
            session: undefined,
            socket: undefined,
            getIndexInSession: function () { return 0; },
            deliverAction: function (action) { return undefined; },
            otherPlayerInSession: function () { return undefined; },
            alive: function () { return true; }
        };
        player1 = {
            token: 'player1',
            session: undefined,
            socket: undefined,
            getIndexInSession: function () { return 1; },
            deliverAction: function (action) { return undefined; },
            otherPlayerInSession: function () { return player0; },
            alive: function () { return true; }
        };
        player0.otherPlayerInSession = function () { return player1; };
        subject = new Session_1["default"]([player0, player1]);
        player0.session = subject;
        player1.session = subject;
    });
    describe('#playerTokens()', function () {
        it('will yield the expected value', function () {
            chai_1.expect(subject.playerTokens()).to.deep.equal([player0.token, player1.token]);
        });
    });
});
//# sourceMappingURL=Session.test.js.map