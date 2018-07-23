import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';
import State from '../model/State';
export default class Match {
    private players;
    private options;
    private sendStats;
    games: Game[];
    state: State;
    constructor(players: Player[], options: MatchOptions, sendStats: Function);
    playGames(): Promise<void>;
}
