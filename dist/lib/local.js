"use strict";
exports.__esModule = true;
var ultimate_ttt_1 = require("ultimate-ttt");
var funcs = require('./funcs');
var State = require('./State');
function localGame(options) {
    var player = [];
    player.push(funcs.loadPlayer(options.a, 1));
    player.push(funcs.loadPlayer(options.b, 2));
    try {
        funcs.validatePlayer(player[0]);
    }
    catch (e) {
        console.error('Error: Player 1 is invalid.', e);
        return;
    }
    try {
        funcs.validatePlayer(player[1]);
    }
    catch (e) {
        console.error('Error: Player 2 is invalid.', e);
        return;
    }
    var timeout = options.timeout || 100;
    var games = options.games || 1000;
    var state = new State();
    var currentPlayer;
    process.on('uncaughtException', function () {
        state.wins[1 - currentPlayer]++;
        state.timeouts[currentPlayer]++;
        console.log('Player %d timed out', currentPlayer + 1);
        funcs.printState(state);
    });
    while (state.games < games) {
        var hrstart = process.hrtime();
        var iterations = 0;
        currentPlayer = 0;
        player[0].init();
        player[1].init();
        state.games++;
        var game = new ultimate_ttt_1["default"]();
        try {
            while (!game.isFinished()) {
                var nextStep = player[currentPlayer].getMove();
                var playerNumber = currentPlayer + 1;
                game.move(nextStep.board, playerNumber, nextStep.move);
                player[currentPlayer].addMove(nextStep.board, nextStep.move);
                currentPlayer = 1 - currentPlayer;
                player[currentPlayer].addOpponentMove(nextStep.board, nextStep.move);
                iterations++;
                if (iterations > 100) {
                    console.error('Limit reached');
                    console.error(game.prettyPrint());
                    return;
                }
            }
            if (game.winner > 0) {
                state.wins[game.winner - 1]++;
            }
            else {
                state.ties++;
            }
        }
        catch (e) {
            state.wins[1 - currentPlayer]++;
        }
        finally {
            var hrend = process.hrtime(hrstart);
            state.times.push(funcs.convertExecTime(hrend[1]));
        }
    }
    funcs.printState(state);
}
exports["default"] = localGame;
//# sourceMappingURL=local.js.map