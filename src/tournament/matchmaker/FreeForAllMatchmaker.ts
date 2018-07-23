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

    constructor(private players: Player[], private options: MatchOptions) {
        this.maxMatches = Math.pow(players.length, players.length)
    }

    isFinished(): boolean {
        return this.finished;
    }

    getRemainingMatches(tournamentStats: TournamentStats): Match[] {
        let match: Match[] = []
        return this.players.map((playerA, $index) => {
            return this.players.splice($index + 1).map(
                playerB => {
                    return new Match(
                        [playerA, playerB],
                        {
                            maxGames: this.options.maxGames,
                            timeout: this.options.timeout,
                        }
                    );
                }
            )
        }).reduce((result, current, idx) =>
            result.concat(current)
        );
    }

}