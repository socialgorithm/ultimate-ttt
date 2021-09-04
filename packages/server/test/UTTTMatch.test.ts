import { expect } from "chai";
import * as sinon from "sinon";

import UTTTMatch from "../src/UTTTMatch";
import { MatchOutputChannel } from "@socialgorithm/game-server";
import { MatchOptions, Messages } from "@socialgorithm/model";
import Sinon = require("sinon");

type MatchTest = {
    match: UTTTMatch,
    outputChannel: {
        sendGameEnded: Sinon.SinonSpy,
        sendMatchEnded: Sinon.SinonSpy,
        sendMessageToPlayer: Sinon.SinonSpy,
    },
};

const players = [
    "Player0",
    "Player1",
];

const getMatch = (): MatchTest => {
    const sendMessageToPlayer = sinon.spy();
    const sendGameEnded = sinon.spy();
    const sendMatchEnded = sinon.spy();

    const outputChannel: any = {
        sendGameEnded,
        sendMatchEnded,
        sendMessageToPlayer,
    };

    const options: MatchOptions = {
        autoPlay: true,
        maxGames: 10,
        timeout: 100,
    };

    const match = new UTTTMatch(
        options,
        players,
        outputChannel,
    );

    return {
        match,
        outputChannel,
    };
};

describe("UTTTMatch", () => {
    it("Match fails after 5s if no players connect", () => {
        const clock = sinon.useFakeTimers();
        const match = getMatch();

        clock.tick(6000);

        expect(match.outputChannel.sendMatchEnded.getCalls().length).to.equal(1);

        const stats: Messages.MatchEndedMessage = match.outputChannel.sendMatchEnded.getCall(0).args[0];

        expect(stats.winner).to.equal(-1);

        clock.restore();
    });

    it("Match doesnt fail if players connect", () => {
        const clock = sinon.useFakeTimers();
        const match = getMatch();

        match.match.onPlayerConnected(players[0]);
        match.match.onPlayerConnected(players[1]);

        clock.tick(6000);

        expect(match.outputChannel.sendMatchEnded.getCalls().length).to.equal(0);

        clock.restore();
    });
});
