import * as blessed from 'blessed';
import State from "../tournament/model/State";
export interface GameUI {
    box: blessed.Widgets.BoxElement;
    progressBar: blessed.Widgets.ProgressBarElement;
    players: [string, string];
}
export default class GUI {
    screen: blessed.Widgets.Screen;
    onlineUsers: blessed.Widgets.BoxElement;
    gameArea: blessed.Widgets.BoxElement;
    logger: blessed.Widgets.Log;
    games: Array<GameUI>;
    constructor(title: string, port: number);
    renderOnlinePlayers(players: Array<string>): void;
    addGameBox(playerOne: string, playerTwo: string): number;
    setGameProgress(gameIndex: number, progress: number): void;
    setGameEnd(gameIndex: number, winner: string, state: State): void;
    log(message: string, skipRender?: boolean): void;
    render(): void;
}
