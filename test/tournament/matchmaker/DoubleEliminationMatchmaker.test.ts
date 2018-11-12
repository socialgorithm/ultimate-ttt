/* tslint:disable */

import { expect } from 'chai';

import DoubleEliminationMatch from '../../../src/tournament/matchmaker/DoubleEliminationMatch';
import DoubleEliminationMatchmaker from '../../../src/tournament/matchmaker/DoubleEliminationMatchmaker';
import { IMatchOptions } from '../../../src/tournament/match/MatchOptions';
import DetailedMatchStats from '../../../src/tournament/match/DetailedMatchStats';
import PlayerGenerator from '../../PlayerGenerator';

describe('Double Elimination Matchmaker', () => {
    const matchOptions: IMatchOptions = { maxGames: 100, timeout: 100, autoPlay: true }
    const events = {
        onMatchEnd: (stats: DetailedMatchStats) => { },
        sendStats: () => { },
    }

    it('matches even number of players', done => {
        const players = PlayerGenerator.generateArrayOf(4);
        const matchmaker = new DoubleEliminationMatchmaker(players, matchOptions, events);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];

        // Round 1
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([players[0], players[1]]);
        expect(matches[1].players).to.deep.equal([players[2], players[3]]);
        // parents
        expect(matches[0].parentMatches).to.have.length(0);
        expect(matches[1].parentMatches).to.have.length(0);

        // Round 2
        matches[0].stats.winner = 0; //players[0]
        matches[1].stats.winner = 1; //players[3]
        matches[0].stats.state = 'finished';
        matches[1].stats.state = 'finished';
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([players[0], players[3]]); //winning bracket
        expect(matches[1].players).to.deep.equals([players[1], players[2]]); //losing bracket
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[1].parentMatches).to.have.length(0);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent: allMatches[0].uuid, // players[0]-players[1]
            },
            {
                playerIndex: 1,
                parent: allMatches[1].uuid, // players[2]-players[3]
            },
        ]);

        //Round 3
        matches[0].stats.winner = 1; //players[3]
        matches[1].stats.winner = 0; //players[1]
        matches[0].stats.state = 'finished';
        matches[1].stats.state = 'finished';
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([players[0], players[1]]);
        // parents
        expect(matches[0].parentMatches).to.have.length(1);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 1,
                parent: allMatches[3].uuid, // players[1]-players[2]
            },
        ]);

        // Round 4
        matches[0].stats.winner = 0; //players[0]
        matches[0].stats.state = 'finished';
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([players[3], players[0]]);
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent: allMatches[2].uuid, // players[0]-players[3]
            },
            {
                playerIndex: 1,
                parent: allMatches[4].uuid, // players[0]-players[1]
            },
        ]);

        done();
    });

    it('matches odd number of players', done => {
        const players = PlayerGenerator.generateArrayOf(5);
        const matchmaker = new DoubleEliminationMatchmaker(players, matchOptions, events);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];

        // Round 1
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        expect(matchmaker.getRanking()).to.deep.equal(['P0', 'P1', 'P2', 'P3', 'P4'])
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([players[0], players[1]]);
        expect(matches[1].players).to.deep.equal([players[2], players[3]]);

        // Round 2
        matches[0].stats.winner = 0; //players[0]
        matches[1].stats.winner = 0; //players[2]
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        expect(matchmaker.getRanking()).to.deep.equal(['P0', 'P2', 'P1', 'P3', 'P4'])
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([players[4], players[0]]); //winning bracket
        expect(matches[1].players).to.deep.equals([players[1], players[3]]); //losing bracket

        // Round 3
        matches[0].stats.winner = 0; //players[4]
        matches[1].stats.winner = 0; //players[1]
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        expect(matchmaker.getRanking()).to.deep.equal(['P2', 'P4', 'P0', 'P1', 'P3'])
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([players[2], players[4]]);
        expect(matches[1].players).to.deep.equal([players[0], players[1]]);

        // Round 4
        matches[0].stats.winner = 0; //players[2]
        matches[1].stats.winner = 0; //players[0]
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        expect(matchmaker.getRanking()).to.deep.equal(['P2', 'P0', 'P4', 'P1', 'P3'])
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([players[0], players[4]]);

        // Round 5
        matches[0].stats.winner = 0; //players[0]
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: allMatches });
        expect(matchmaker.getRanking()).to.deep.equal(['P2', 'P0', 'P1', 'P4', 'P3'])
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([players[2], players[0]]);

        // Round 6
        matches[0].stats.winner = 1; //players[0]
        matchmaker.updateStats({ started: true, waiting: false, finished: true, matches: allMatches });
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.be.empty;

        // Test Ranking
        expect(matchmaker.getRanking()).to.deep.equal(['P0', 'P2', 'P4', 'P1', 'P3'])

        done();
    });

    it('resolves ties', done => {
        const players = PlayerGenerator.generateArrayOf(2);
        const matchmaker = new DoubleEliminationMatchmaker(players, matchOptions, events);
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: [] });
        let matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([players[0], players[1]]);

        matches[0].stats.winner = -1; // TIE
        let tiedMatchUuid = matches[0].uuid
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: matches });
        matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([players[0], players[1]]);
        expect(matches[0].options.timeout).to.equal(50);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchUuid }, { playerIndex: 1, parent: tiedMatchUuid }]);

        matches[0].stats.winner = -1; // TIE
        tiedMatchUuid = matches[0].uuid
        matchmaker.updateStats({ started: true, waiting: false, finished: false, matches: matches });
        matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([players[0], players[1]]);
        expect(matches[0].options.timeout).to.equal(25);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchUuid }, { playerIndex: 1, parent: tiedMatchUuid }]);

        done();
    })
})
