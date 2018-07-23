import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../model/TournamentStats";
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

    constructor(private players: Player[], private options: MatchOptions, private sendStats: Function) {
        this.maxMatches = Math.pow(players.length, players.length)
    }

    isFinished(): boolean {
        return this.finished;
    }

    getRemainingMatches(tournamentStats: TournamentStats): Match[] {
        let match: Match[] = [];
        this.finished = true; // Free for all only runs matchmaking once
        return this.players.map((playerA, $index) => {
            return this.players.splice($index + 1).map(
                playerB => {
                    return new Match(
                        [playerA, playerB],
                        {
                            maxGames: this.options.maxGames,
                            timeout: this.options.timeout,
                        },
                        this.sendStats
                    );
                }
            )
        }).reduce((result, current, idx) =>
            result.concat(current)
        , []);
    }

    getRanking(stats: TournamentStats): string[] {
        const playerStats: any = {};
        stats.matches.forEach(match => {
            if (!playerStats[match.players[0].token]) {
                playerStats[match.players[0].token] = 0;
            }
            if (!playerStats[match.players[1].token]) {
                playerStats[match.players[1].token] = 0;
            }
            playerStats[match.players[0].token] += match.stats.wins[0];
            playerStats[match.players[1].token] += match.stats.wins[1];
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