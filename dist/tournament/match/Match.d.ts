import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';
import State from '../model/State';
export default class Match {
    players: Player[];
    options: MatchOptions;
    private sendStats;
    uuid: string;
    games: Game[];
    stats: State;
    constructor(players: Player[], options: MatchOptions, sendStats: Function);
    playGames(): Promise<void>;
    getStats(): {
        stats: State;
        players: {
            token: string;
        }[];
    };
    toString(): string;
}
