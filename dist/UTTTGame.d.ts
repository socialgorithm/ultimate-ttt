import { Messages, Player } from "@socialgorithm/game-server";
export default class UTTTGame {
    private players;
    private sendMessageToPlayer;
    private sendGameEnded;
    private board;
    private nextPlayerIndex;
    private startTime;
    constructor(players: Player[], sendMessageToPlayer: (player: Player, message: any) => void, sendGameEnded: (stats: Messages.GameEndedMessage) => void);
    start(): void;
    onMessageFromPlayer(player: string, payload: any): void;
    private onPlayerMove;
    private parseMove;
    private askForMoveFromNextPlayer;
    private switchNextPlayer;
    private handleGameEnd;
    private handleGameTied;
    private handleGameWon;
    private getTimeFromStart;
}
