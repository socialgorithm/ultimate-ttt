import Match from "../../tournament/match/Match";
import IMatchOptions from "../../tournament/match/MatchOptions";
import Player from "../../tournament/model/Player";
import { ITournamentStats } from "../../tournament/stats/TournamentStats";

import { IMove } from "../../tournament/match/game/GameStats";
import ITournamentEvents from "../../tournament/TournamentEvents";
import IMatchmaker from "./Matchmaker";

/**
 * FreeForAll is a strategy where only one round is played, in which every player
 * plays against every other player in the tournament.
 *
 * The winner will be the player that has won the most games.
 *
 * In case of a tie the tied players will play against each other once more.
 */
export default class FreeForAllMatchmaker implements IMatchmaker {

    private maxMatches: number;
    private finished: boolean;
    private tournamentStats: ITournamentStats;
    private index: number = 0;

    constructor(private players: Player[], private options: IMatchOptions, private events: ITournamentEvents) {
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public updateStats(tournamentStats: ITournamentStats) {
        this.tournamentStats = tournamentStats;
    }

    public getRemainingMatches(): Match[] {
        if (this.index >= this.players.length) {
            return [];
        }

        const match: Match[] = [];
        const matches = this.players.map((playerA, $index) => {
            if (this.index === $index) { return []; }
            return [this.players[this.index]].filter(playerB => {
                    return !(this.tournamentStats.matches.find(eachMatch =>
                        eachMatch.players[0].token === playerA.token && eachMatch.players[1].token === playerB.token ||
                        eachMatch.players[1].token === playerA.token && eachMatch.players[0].token === playerB.token,
                    ));
                },
            ).map(playerB => {
                    return new Match(
                        [playerA, playerB],
                        {
                            autoPlay: this.options.autoPlay,
                            maxGames: this.options.maxGames,
                            timeout: this.options.timeout,
                        },
                        this.events,
                    );
                },
            );
        }).reduce((result, current, idx) => result.concat(current), []);

        ++this.index;
        this.finished = this.index >= this.players.length;

        return matches;
    }

    public getRanking(): string[] {
        const playerStats: any = {};
        this.tournamentStats.matches.forEach(match => {
            if (!playerStats[match.players[0].token]) {
                playerStats[match.players[0].token] = 0;
            }
            if (!playerStats[match.players[1].token]) {
                playerStats[match.players[1].token] = 0;
            }
            const p0wins = match.stats.wins[0];
            const p1wins = match.stats.wins[1];
            if (p0wins === p1wins) {
                return;
            }
            if (p0wins > p1wins) {
                playerStats[match.players[0].token]++;
            }
            if (p1wins > p0wins) {
                playerStats[match.players[1].token]++;
            }
        });
        return Object.keys(playerStats).map(token => ({
            gamesWon: playerStats[token],
            player: token,
        })).sort(
            (a: any, b: any) => b.gamesWon - a.gamesWon,
        ).map(playerRank => playerRank.player,
        );
    }
}
