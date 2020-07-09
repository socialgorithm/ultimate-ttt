// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:uttt:game");

import { Messages, Player } from "@socialgorithm/game-server";
import UTTT from "@socialgorithm/ultimate-ttt/dist/UTTT";
import { Coords } from "@socialgorithm/ultimate-ttt/dist/model/constants";
import { MatchOptions } from "@socialgorithm/model";

export default class UTTTGame {
  private board: UTTT;
  private nextPlayerIndex: number;
  private startTime: number;
  private timeout: NodeJS.Timeout;
  private hasTimedOut: boolean;

  constructor(
    private players: Player[],
    private sendMessageToPlayer: (player: Player, message: any) => void,
    private sendGameEnded: (stats: Messages.GameEndedMessage) => void,
    private options: MatchOptions,
    ) {
      this.board = new UTTT(3);
      this.nextPlayerIndex = Math.round(Math.random());
      this.hasTimedOut = false;
    }

  public start(): void {
    this.startTime = Math.round(Date.now() / 1000);
    this.sendMessageToPlayer(this.players[0], "init");
    this.sendMessageToPlayer(this.players[1], "init");
    this.askForMoveFromNextPlayer();
  }

  public onMessageFromPlayer(player: string, payload: any): void {
    this.onPlayerMove(player, payload);
  }

  public getNextPlayer(): Player {
    return this.players[this.nextPlayerIndex];
  }

  private onPlayerMove(player: Player, moveStr: any) {
    if (this.hasTimedOut) {
      return;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    const coords = this.parseMove(moveStr);
    const expectedPlayerIndex: any = this.nextPlayerIndex;
    const playedPlayerIndex: any = this.players.indexOf(player);
    if (expectedPlayerIndex !== playedPlayerIndex) {
      const expectedPlayer = this.players[expectedPlayerIndex];
      debug(`Expected ${expectedPlayer} to play, but ${player} played`);
      this.handleGameWon(this.players[expectedPlayerIndex], undefined, playedPlayerIndex);
      return;
    }

    this.board = this.board.move(playedPlayerIndex, coords.board, coords.move);

    const previousMove = coords;
    if (this.board.isFinished()) {
      this.handleGameEnd(previousMove, playedPlayerIndex);
      return;
    } else {
      this.switchNextPlayer();
      this.askForMoveFromNextPlayer(previousMove);
    }
  }

  /**
   * Converts a move string into an object
   * @param data board.row,board.col;move.row,move.col
   */
  private parseMove(data: string): Coords {
    const [board, move] = data.trim().split(";")
        .map(part => part.split(",").map(n => parseInt(n, 10)) as [number, number]);
    return { board, move };
  }

  private askForMoveFromNextPlayer(previousMove?: Coords) {
    const nextPlayer = this.players[this.nextPlayerIndex];
    if (previousMove) {
      const coords = this.printCoords(previousMove);
      this.sendMessageToPlayer(nextPlayer, `opponent ${coords}` );
    } else {
      this.sendMessageToPlayer(nextPlayer, "move");
    }
    this.timeout = setTimeout(() => {
      this.hasTimedOut = true;
      this.sendMessageToPlayer(this.players[this.nextPlayerIndex], "timeout");
      this.handleGameWon(this.players[1 - this.nextPlayerIndex]);
    }, this.options.timeout * 1.2);
  }

  private switchNextPlayer() {
    this.nextPlayerIndex = this.nextPlayerIndex === 0 ? 1 : 0;
  }

  private handleGameEnd(previousMove: Coords, playedPlayerIndex: number) {
    if (this.board.winner === -1) {
      this.handleGameTied(previousMove, playedPlayerIndex);
    } else {
      const winnerName = this.players[this.board.winner];
      this.handleGameWon(winnerName, previousMove, playedPlayerIndex);
    }
  }

  private handleGameTied(previousMove: Coords, playedPlayerIndex: number) {
    this.sendGameEnded({
      duration: this.getTimeFromStart(),
      players: this.players,
      stats: {
        playedPlayerIndex,
        previousMove: previousMove ? this.printCoords(previousMove) : "",
      },
      tie: true,
      winner: null,
    });
  }

  private handleGameWon(winner: string, previousMove: Coords, playedPlayerIndex: number) {
    this.sendGameEnded({
      duration: this.getTimeFromStart(),
      players: this.players,
      stats: {
        playedPlayerIndex,
        previousMove: previousMove ? this.printCoords(previousMove) : "",
      },
      tie: false,
      winner,
    });
  }

  private getTimeFromStart() {
    const timeNow = Math.round(Date.now() / 1000);
    return timeNow - this.startTime;
  }

  private printCoords(coords: Coords): string {
    return coords.board.join(",") + ";" + coords.move.join(",");
  }

}
