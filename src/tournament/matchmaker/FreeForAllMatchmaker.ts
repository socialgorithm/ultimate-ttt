import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../stats/TournamentStats";
import MatchOptions from "../match/MatchOptions";

/**
 * FreeForAll is a strategy where only one round is played, in which every player
 * plays against every other player in the tournament.
 * 
 * The winner will be the player that has won the most games.
 * 
 * In case of a tie the tied players will play against each other once more.
 */
export default class FreeForAllMatchmaker implements Matchmaker {

    private maxMatches: number;
    private finished: boolean;
    private stats: TournamentStats;
    private index: number = 0;

    constructor(private players: Player[], private options: MatchOptions, private sendStats: Function) {
    }

    isFinished(): boolean {
        return this.finished;
    }

    getRemainingMatches(tournamentStats: TournamentStats): Match[] {
        this.stats = tournamentStats;

        if (this.index >= this.players.length) {
            return [];
        }

        let match: Match[] = [];
        const matches = this.players.map((playerA, $index) => {
            if (this.index === $index) return [];
            return [this.players[this.index]].filter(
                playerB => {
                    return !(tournamentStats.matches.find(match =>
                        match.players[0].token === playerA.token && match.players[1].token === playerB.token ||
                        match.players[1].token === playerA.token && match.players[0].token === playerB.token
                    ));
                }
            ).map(
                playerB => {
                    return new Match(
                        [playerA, playerB],
                        {
                            maxGames: this.options.maxGames,
                            timeout: this.options.timeout,
                            autoPlay: this.options.autoPlay
                        },
                        this.sendStats
                    );
                }
            )
        }).reduce((result, current, idx) => result.concat(current), []);

        ++this.index;
        this.finished = this.index >= this.players.length;

        return matches;
    }

    getRanking(): string[] {
        const playerStats: any = {};
        this.stats.matches.forEach(match => {
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
            player: token,
            gamesWon: playerStats[token],
        })).sort(
            (a: any, b: any) => b.gamesWon - a.gamesWon
        ).map(
            playerRank => playerRank.player
        );
    }
}