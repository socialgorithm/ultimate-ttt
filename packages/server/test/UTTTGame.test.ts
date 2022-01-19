import { expect } from "chai";
import * as sinon from "sinon";

import UTTTGame from "../src/UTTTGame";
import { Messages, MatchOptions } from "@socialgorithm/model";
import { Player } from "@socialgorithm/game-server";

type TestGame = {
    game: UTTTGame,
    channel: {
        sendMessageToPlayer: sinon.SinonSpy,
        sendGameEnded: sinon.SinonSpy,
    },
};

const players = [
    "p0",
    "p1",
];

const options : MatchOptions = {
    maxGames: 50,
    timeout: 20,
    autoPlay: false,
}

const getGame = (): TestGame => {
    const sendMessageToPlayer = sinon.spy();
    const sendGameEnded = sinon.spy();

    const game = new UTTTGame(
        players,
        sendMessageToPlayer,
        sendGameEnded,
        options
    );

    return {
        channel: {
            sendGameEnded,
            sendMessageToPlayer,
        },
        game,
    };
};

const printCoords = (coords: [Coord, Coord]): string  => {
    return coords[0].join(",") + ";" + coords[1].join(",");
};

type Coord = [number, number];

const sequenceOfPairs = (pairs: Coord[]): Array<[Coord, Coord]> => {
    return pairs.map((current, index): [Coord, Coord] => {
      if (index === 0) {
        return undefined;
      } else {
        const previous = pairs[index - 1];
        return [previous, current];
      }
    }).slice(1);
  };

const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));

describe("UTTTGame", () => {
    it("start() sends relevant messages", () => {
        const testGame = getGame();
        const firstPlayer: Player = testGame.game.getNextPlayer();
        testGame.game.start();

        players.forEach((player, $index) => {
            expect(testGame.channel.sendMessageToPlayer.getCall($index).args[0]).to.equal(player);
            expect(testGame.channel.sendMessageToPlayer.getCall($index).args[1]).to.equal("init");
        });

        // First move
        const nextCall = players.length;
        expect(testGame.channel.sendMessageToPlayer.getCall(nextCall).args[0]).to.equal(firstPlayer);
        expect(testGame.channel.sendMessageToPlayer.getCall(nextCall).args[1]).to.equal("move");
    });

    it("winning game sends correct stats", () => {
        const testGame = getGame();

        testGame.game.start();

        const winningMoves: Array<[Coord, Coord]> = sequenceOfPairs([
            [0, 0], [0, 0], [1, 1], [1, 0], [0, 0], [1, 0],
            [1, 1], [1, 1], [0, 0], [2, 0], [1, 1], [1, 2],
            [2, 2], [2, 0], [2, 2], [2, 1], [2, 2], [2, 2],
        ]);
        let nextPlayer = testGame.game.getNextPlayerIndex();

        winningMoves.forEach((move, index) => {
            const moveStr = printCoords(move);
            testGame.game.onMessageFromPlayer(players[nextPlayer], moveStr);

            if (index === winningMoves.length - 1) {
                return;
            }

            nextPlayer = 1 - nextPlayer;

            expect(testGame.channel.sendMessageToPlayer.lastCall.args[0]).to.equal(players[nextPlayer]);
            expect(testGame.channel.sendMessageToPlayer.lastCall.args[1]).to.equal(`opponent ${moveStr}`);
        });

        // Game should be over now
        const stats: Messages.GameEndedMessage = testGame.channel.sendGameEnded.lastCall.args[0];
        expect(stats.winner).to.equal(players[nextPlayer]);
        expect(stats.tie).to.be.false;
    });

    it("timeout game send correct message", async () => {
        const testGame = getGame();

        testGame.game.start();

        let nextPlayer = testGame.game.getNextPlayerIndex();
        const moveStr = printCoords([[0, 0], [0, 0]]);
        testGame.game.onMessageFromPlayer(players[nextPlayer], moveStr);
        nextPlayer = 1 - nextPlayer;
        expect(testGame.channel.sendMessageToPlayer.lastCall.args[0]).to.equal(players[nextPlayer]);
        expect(testGame.channel.sendMessageToPlayer.lastCall.args[1]).to.equal(`opponent ${moveStr}`);

        await sleep((options.timeout * 1.2) + 1)
        const respondStr = printCoords([[0, 0], [1, 0]]);
        testGame.game.onMessageFromPlayer(players[nextPlayer], respondStr);
        expect(testGame.channel.sendMessageToPlayer.lastCall.args[0]).to.equal(players[nextPlayer]);
        expect(testGame.channel.sendMessageToPlayer.lastCall.args[1]).to.equal(`timeout`);
        // // Game should be over now
        const stats: Messages.GameEndedMessage = testGame.channel.sendGameEnded.lastCall.args[0];
        expect(stats.winner).to.equal(players[1-nextPlayer]);
        expect(stats.tie).to.be.false;
        
    });

    it("wrong player game send correct message", async () => {
        const testGame = getGame();

        testGame.game.start();

        let nextPlayer = testGame.game.getNextPlayerIndex();
        const moveStr = printCoords([[0, 0], [0, 0]]);
        testGame.game.onMessageFromPlayer(players[nextPlayer], moveStr);
        nextPlayer = 1 - nextPlayer;
        expect(testGame.channel.sendMessageToPlayer.lastCall.args[0]).to.equal(players[nextPlayer]);
        expect(testGame.channel.sendMessageToPlayer.lastCall.args[1]).to.equal(`opponent ${moveStr}`);
        nextPlayer = 1 - nextPlayer;
        const respondStr = printCoords([[0, 0], [1, 0]]);
        testGame.game.onMessageFromPlayer(players[nextPlayer], respondStr);
        // // Game should be over now
        const stats: Messages.GameEndedMessage = testGame.channel.sendGameEnded.lastCall.args[0];
        expect(stats.winner).to.equal(players[1-nextPlayer]);
        expect(stats.tie).to.be.false;
        
    });
});
