import Player from "../../tournament/model/Player";
import State from "../../tournament/model/State";
import Game from "./game/Game";
import IMatchOptions from "./MatchOptions";
import TournamentEvents from "../../tournament/TournamentEvents";
export default class Match {
    players: Player[];
    options: IMatchOptions;
    private events;
    uuid: string;
    games: Game[];
    stats: State;
    constructor(players: Player[], options: IMatchOptions, events: TournamentEvents);
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
