import Match from "../match/Match";

export default class DoubleEliminationMatch extends Match {
    public parentMatches: Array<string> = [];

    public getStats() {
        return {
            stats: this.stats,
            players: this.players.map(player => ({
                token: player.token,
            })),
            parentMatches: this.parentMatches,
        };
    }
}