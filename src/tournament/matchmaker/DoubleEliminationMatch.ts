import Match from "../../tournament/match/Match";

export interface IMatchParent {
    playerIndex: number;
    parent: string;
}

export default class DoubleEliminationMatch extends Match {
    public parentMatches: IMatchParent[] = [];

    public getStats() {
        const stats: any = super.getStats();
        stats.parentMatches = this.parentMatches;
        return stats;
    }
}
