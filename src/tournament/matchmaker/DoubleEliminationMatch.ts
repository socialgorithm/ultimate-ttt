import Match from "tournament/match/Match";

export type MatchParent = {
    playerIndex: number,
    parent: string,
};

export default class DoubleEliminationMatch extends Match {
    public parentMatches: Array<MatchParent> = [];

    public getStats() {
        const stats: any = super.getStats();
        stats.parentMatches = this.parentMatches;
        return stats;
    }
}