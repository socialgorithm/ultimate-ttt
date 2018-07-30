import { expect } from 'chai';
import sinon from 'sinon';
import Player from '../../../src/tournament/model/Player';
import DoubleEliminationMatchmaker from '../../../src/tournament/matchmaker/DoubleEliminationMatchmaker';
import Match from '../../../src/tournament/match/Match';

describe('Double Elimination Matchmaker', () => {
    const channelStub = sinon.newStubInstance();
    const p1 = new Player('P1', channelStub);
    const p2 = new Player('P2', channelStub);
    const p3 = new Player('P3', channelStub);
    const p4 = new Player('P4', channelStub);
    const players: Player[] = [p1, p2, p3, p4]
    const matchOptions = { maxGames: 100, timeout: 100 }
    const sendStats = sinon.stub();

    it('matches all players in round 1', () => {
        const matchmaker = new DoubleEliminationMatchmaker(players, matchOptions, sendStats);
        let matches = matchmaker.getRemainingMatches({ started: true, finished: false, matches: []});
        expect(matches).to.deep.equal([new Match([p1, p2], matchOptions, sendStats)]);
    })
})