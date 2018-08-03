import Player from "../../tournament/model/Player";
import State from "../../tournament/model/State";
import ITournamentEvents from "../../tournament/TournamentEvents";
import Game from "./game/Game";
import IMatchOptions from "./MatchOptions";
import DetailedMatchStats from "../../tournament/match/DetailedMatchStats";
export default class Match {
    players: Player[];
    options: IMatchOptions;
    private events;
    uuid: string;
    games: Game[];
    stats: State;
    detailedStats: DetailedMatchStats;
    constructor(players: Player[], options: IMatchOptions, events: ITournamentEvents);
    playGames(): Promise<void>;
    getStats(): {
        players: {
            token: string;
        }[];
        stats: State;
        uuid: string;
    };
    getDetailedStats(): DetailedMatchStats;
    toString(): string;
}
