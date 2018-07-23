import MatchOptions from './MatchOptions';
import Player from '../model/Player';
export default class Match {
    private players;
    private options;
    private games;
    private state;
    private game;
    private gameStart;
    private gameIDForUI;
    private active;
    constructor(players: Player[], options: MatchOptions);
    playGames(): Promise<void>;
}
