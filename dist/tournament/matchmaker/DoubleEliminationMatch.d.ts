import Match from "../../tournament/match/Match";
export interface IMatchParent {
    playerIndex: number;
    parent: string;
}
export default class DoubleEliminationMatch extends Match {
    parentMatches: IMatchParent[];
    getStats(): any;
}
