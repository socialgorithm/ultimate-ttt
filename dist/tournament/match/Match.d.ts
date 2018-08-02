import Player from "../../tournament/model/Player";
import State from "../../tournament/model/State";
import ITournamentEvents from "../../tournament/TournamentEvents";
import Game from "./game/Game";
import IMatchOptions from "./MatchOptions";
export default class Match {
    players: Player[];
    options: IMatchOptions;
    private events;
    uuid: string;
    games: Game[];
    stats: State;
    constructor(players: Player[], options: IMatchOptions, events: ITournamentEvents);
    playGames(): Promise<void>;
    getStats(): {
        players: {
            token: string;
        }[];
        stats: State;
        uuid: string;
    };
    toString(): string;
}
