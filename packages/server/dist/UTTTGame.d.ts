import { Messages, Player } from "@socialgorithm/game-server";
import { MatchOptions } from "@socialgorithm/model";
export default class UTTTGame {
    private players;
    private sendMessageToPlayer;
    private sendGameEnded;
    private options;
    private board;
    private nextPlayerIndex;
    private startTime;
    private timeout;
    private hasTimedOut;
    constructor(players: Player[], sendMessageToPlayer: (player: Player, message: any) => void, sendGameEnded: (stats: Messages.GameEndedMessage) => void, options: MatchOptions);
    start(): void;
    onMessageFromPlayer(player: string, payload: any): void;
    getNextPlayer(): Player;
    private onPlayerMove;
    private parseMove;
    private askForMoveFromNextPlayer;
    private switchNextPlayer;
    private handleGameEnd;
    private handleGameTied;
    private handleGameWon;
    private getTimeFromStart;
    private printCoords;
}
