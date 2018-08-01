import Match from "../match/Match";
declare type MatchParent = {
    playerIndex: number;
    parent: string;
};
export default class DoubleEliminationMatch extends Match {
    parentMatches: Array<MatchParent>;
    getStats(): any;
}
export {};
