import Player from "../../tournament/model/Player";
import State from "../../tournament/model/State";
import Game from "./game/Game";
import IMatchOptions from "./MatchOptions";
import { IMove } from "../../tournament/match/game/GameStats";
export default class Match {
    players: Player[];
    options: IMatchOptions;
    private sendStats;
    private sendMove;
    uuid: string;
    games: Game[];
    stats: State;
    constructor(players: Player[], options: IMatchOptions, sendStats: () => void, sendMove: (move: IMove) => void);
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
