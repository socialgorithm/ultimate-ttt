import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../model/TournamentStats";
import { RESULT_LOSE } from "@socialgorithm/ultimate-ttt/dist/model/constants";
import MatchOptions from "../match/MatchOptions";

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
                    return new Match([playerA, playerB], { maxGames: this.options.maxGames, timeout: 100});
                }
            )
        }).reduce((result, current, idx) =>
            result.concat(current)
        );
    }

}