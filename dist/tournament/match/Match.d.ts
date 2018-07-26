import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';
import State from '../model/State';
import PubSubber from '../model/Subscriber';
export default class Match extends PubSubber {
    private tournmentId;
    players: Player[];
    private options;
    private matchID;
    games: Game[];
    stats: State;
    constructor(tournmentId: string, players: Player[], options: MatchOptions);
    start(): void;
    private playNextGame;
    private onGameEnd;
    private onMatchEnd;
}
