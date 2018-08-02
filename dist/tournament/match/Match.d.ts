import Player from 'tournament/model/Player';
import State from 'tournament/model/State';
import MatchOptions from './MatchOptions';
import Game from './game/Game';
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
        uuid: string;
        stats: State;
        players: {
            token: string;
        }[];
    };
    toString(): string;
}
