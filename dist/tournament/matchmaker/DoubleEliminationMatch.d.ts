import Match from "../match/Match";
export default class DoubleEliminationMatch extends Match {
    parentMatches: Array<string>;
    getStats(): {
        stats: import("../../../../../../../../../Users/bharat/code/sg/uttt/ultimate-ttt-server/src/tournament/model/State").default;
        players: {
            token: string;
        }[];
        parentMatches: string[];
    };
}
