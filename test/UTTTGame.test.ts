import { expect } from "chai";
import * as sinon from "sinon";

import UTTTGame from "../src/UTTTGame";

describe("UTTTGame", () => {
    it("start() sends relevant messages", () => {
        const players = [
            'player1',
            'player2',
        ];

        const sendMessageToPlayer = sinon.spy();
        const sendGameEnded = sinon.spy();

        const game = new UTTTGame(
            players,
            sendMessageToPlayer,
            sendGameEnded,
        );

        game.start();

        players.forEach((player, $index) => {
            expect(sendMessageToPlayer.getCall($index).args[0]).to.equal(player);
            expect(sendMessageToPlayer.getCall($index).args[1]).to.equal("init");
        });

        // First move
        const nextCall = players.length;
        expect(sendMessageToPlayer.getCall(nextCall).args[0]).to.equal(players[0]);
        expect(sendMessageToPlayer.getCall(nextCall).args[1]).to.equal("move");
    });
});
