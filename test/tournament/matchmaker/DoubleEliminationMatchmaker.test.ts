import { expect } from 'chai';
import { mock, instance, when } from 'ts-mockito';
import Player from '../../../src/tournament/model/Player';
import DoubleEliminationMatchmaker from '../../../src/tournament/matchmaker/DoubleEliminationMatchmaker';
import Channel from '../../../src/tournament/model/Channel';
import DoubleEliminationMatch from '../../../src/tournament/matchmaker/DoubleEliminationMatch';
import { IMatchOptions } from '../../../src/tournament/match/MatchOptions';

describe('Double Elimination Matchmaker', () => {
    const channelMock = mock(Channel)
    const channelStub = instance(channelMock);
    const p1 = new Player('P1', channelStub);
    const p2 = new Player('P2', channelStub);
    const p3 = new Player('P3', channelStub);
    const p4 = new Player('P4', channelStub);
    const p5 = new Player('P5', channelStub);
    const matchOptions: IMatchOptions = { maxGames: 100, timeout: 100, autoPlay: true }
    const events = {
        sendStats: () => {},
        onGameInit: () => {},
        onGameMove: (move) => {}
    }

     it('matches even number of players', (done) => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2, p3, p4], matchOptions, events);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];

        //Round 1
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
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
        matches[0].stats.state = 'finished';
        matches[1].stats.state = 'finished';
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p1, p4]); //winning bracket
        expect(matches[1].players).to.deep.equals([p2, p3]); //losing bracket
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[1].parentMatches).to.have.length(0);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent:  allMatches[0].uuid, // P1-P2
            },
            {
                playerIndex: 1,
                parent: allMatches[1].uuid, // P3-P4
            },
        ]);

        //Round 3
        matches[0].stats.winner = 1; //p4
        matches[1].stats.winner = 0; //p2
        matches[0].stats.state = 'finished';
        matches[1].stats.state = 'finished';
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        // parents
        expect(matches[0].parentMatches).to.have.length(1);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 1,
                parent: allMatches[3].uuid, // P2-P3
            },
        ]);

        //Round 4
        matches[0].stats.winner = 0; //p1
        matches[0].stats.state = 'finished';
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p4, p1]);
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent: allMatches[2].uuid, // P1-P4
            },
            {
                playerIndex: 1,
                parent: allMatches[4].uuid, // P1-P2
            },
        ]);

        done();
    });

    it('matches odd number of players', (done) => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2, p3, p4, p5], matchOptions, events);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];

        //Round 1
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[1].players).to.deep.equal([p3, p4]);

        //Round 2
        matches[0].stats.winner = 0; //p1
        matches[1].stats.winner = 0; //p3
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p5, p1]); //winning bracket
        expect(matches[1].players).to.deep.equals([p2, p4]); //losing bracket

        //Round 3
        matches[0].stats.winner = 0; //p5
        matches[1].stats.winner = 0; //p2
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p3, p5]);
        expect(matches[1].players).to.deep.equal([p1, p2]);

        //Round 4
        matches[0].stats.winner = 0; //p3
        matches[1].stats.winner = 0; //p1
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p5]);

        //Round 5
        matches[0].stats.winner = 0; //p1
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p3, p1]);

        //Round 6
        matches[0].stats.winner = 1; //p1
        matches = matchmaker.getRemainingMatches({ started: true, waiting: false, finished: false, matches: allMatches });
        allMatches.push(...matches);
        expect(matches).to.be.empty;

        //Test Ranking
        expect(matchmaker.getRanking()).to.deep.equal(['P1', 'P3', 'P5', 'P2', 'P4'])

        done();
    });

    it('resolves ties', (done) => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2], matchOptions, events);
        let matches = matchmaker.getRemainingMatches({started: true, waiting: false, finished: false, matches: []});
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);

        matches[0].stats.winner = -1; //TIE
        let tiedMatchUuid = matches[0].uuid
        matches = matchmaker.getRemainingMatches({started: true, waiting: false, finished: false, matches: matches });
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[0].options.timeout).to.equal(50);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchUuid }, { playerIndex: 1, parent: tiedMatchUuid }]);

        matches[0].stats.winner = -1; //TIE
        tiedMatchUuid = matches[0].uuid
        matches = matchmaker.getRemainingMatches({started: true, waiting: false, finished: false, matches: matches });
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[0].options.timeout).to.equal(25);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchUuid }, { playerIndex: 1, parent: tiedMatchUuid }]);

        done();
    })
})