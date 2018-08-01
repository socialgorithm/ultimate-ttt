import { expect } from 'chai';
import { mock, instance, when } from 'ts-mockito';
import Player from '../../../src/tournament/model/Player';
import DoubleEliminationMatchmaker from '../../../src/tournament/matchmaker/DoubleEliminationMatchmaker';
import Channel from '../../../src/tournament/model/Channel';
import DoubleEliminationMatch from '../../../src/tournament/matchmaker/DoubleEliminationMatch';

describe('Double Elimination Matchmaker', () => {
    const channelMock = mock(Channel)
    const channelStub = instance(channelMock);
    const p1 = new Player('P1', channelStub);
    const p2 = new Player('P2', channelStub);
    const p3 = new Player('P3', channelStub);
    const p4 = new Player('P4', channelStub);
    const players: Player[] = [p1, p2, p3, p4]
    const matchOptions = { maxGames: 100, timeout: 100 }
    const sendStats = () => { };

    it('matches players correctly', (done) => {
        const matchmaker = new DoubleEliminationMatchmaker(players, matchOptions, sendStats);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];

        //Round 1
        matches = matchmaker.getRemainingMatches({ started: true, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[1].players).to.deep.equal([p3, p4]);
        // parents
        expect(matches[0].parentMatches).to.have.length(0);
        expect(matches[1].parentMatches).to.have.length(0);

        //Round 2
        matches[0].stats.winner = 0; //p1
        matches[1].stats.winner = 1; //p4
        matches = matchmaker.getRemainingMatches({ started: true, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p1, p4]); //winning bracket
        expect(matches[1].players).to.deep.equals([p2, p3]); //losing bracket
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[1].parentMatches).to.have.length(0);
        expect(matches[0].parentMatches).to.deep.equal([
            allMatches[0].uuid, // P1-P2
            allMatches[1].uuid, // P3-P4
        ]);

        //Round 3
        matches[0].stats.winner = 1; //p4
        matches[1].stats.winner = 0; //p2
        matches = matchmaker.getRemainingMatches({ started: true, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        // parents
        expect(matches[0].parentMatches).to.have.length(1);
        expect(matches[0].parentMatches).to.deep.equal([
            allMatches[3].uuid, // P2-P3
        ]);

        //Round 4
        matches[0].stats.winner = 0; //p1
        matches = matchmaker.getRemainingMatches({ started: true, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p4, p1]);
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[0].parentMatches).to.deep.equal([
            allMatches[2].uuid, // P1-P4
            allMatches[4].uuid, // P1-P2
        ]);

        done();
    })
})