// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:uttt:match");

import { IMatch, MatchOutputChannel, Player } from "@socialgorithm/game-server";
import { Game, MatchOptions, Messages } from "@socialgorithm/model";
import UTTTGame from "./UTTTGame";

export default class UTTTMatch implements IMatch {
  private currentGame: UTTTGame;
  private gamesCompleted: number = 0;
  private missingPlayers: Player[] = [];

  constructor(public options: MatchOptions, public players: Player[], private outputChannel: MatchOutputChannel) {
    this.missingPlayers.push(...players);
    // Start a timeout for player connects
    setTimeout(() => {
      // If one of the players didn't connect, they lose
      if (this.missingPlayers.length === 1) {
        debug(`${this.missingPlayers[0]} did not connect to match, sending match end`);
        this.sendMatchEndDueToTimeout(this.missingPlayers[0]);
      } else if (this.missingPlayers.length > 1) {
        debug(`Players did not connect to match, sending match end`);
        this.sendMatchEndDueToTimeout();
      }
    }, 5000);
  }

  public onPlayerConnected(player: Player) {
    debug(`Player ${player} connected to match`);
    this.missingPlayers = this.missingPlayers.filter(missingPlayer => player !== missingPlayer);
  }

  public onPlayerDisconnected(player: Player) {
    debug(`Player ${player} disconnected from match`);
    if (!this.missingPlayers.find(missingPlayer => missingPlayer === player)) {
      this.missingPlayers.push(player);
    }
    this.sendMatchEndDueToTimeout(player);
  }

  public start() {
    debug("Starting new UTTT Match");
    this.playNextGame();
  }

  public onMessageFromPlayer(player: Player, message: any) {
    this.currentGame.onMessageFromPlayer(player, message);
  }

  private playNextGame = () => {
    this.currentGame = new UTTTGame(this.players, this.onGameMessageToPlayer, this.onGameEnded, this.options);
    this.currentGame.start();
  }

  private onGameMessageToPlayer = (player: Player, message: any) => {
    this.outputChannel.sendMessageToPlayer(player, message);
  }

  private onGameEnded = (stats: Game) => {
    this.outputChannel.sendGameEnded(stats);

    this.gamesCompleted++;
    if (this.gamesCompleted < this.options.maxGames) {
      this.playNextGame();
    } else {
      this.endMatch();
    }
  }

  private endMatch = () => {
    this.outputChannel.sendMatchEnded();
  }

  private sendMatchEndDueToTimeout = (missingPlayer?: Player) => {
    let winnerIndex = -1;
    let timeoutMessage = "Players did not connect in time";
    if (missingPlayer) {
      const winner = this.players.find(player => player !== missingPlayer);
      winnerIndex = this.players.findIndex(player => player === winner);
      timeoutMessage = `${missingPlayer} did not connect in time, or disconnected`;
    }
    const matchEndedMessage: Messages.MatchEndedMessage = {
      games: [],
      matchID: "--",
      messages: [ timeoutMessage ],
      options: this.options,
      players: this.players,
      state: "finished",
      stats: {
        gamesCompleted: 0,
        gamesTied: 0,
        wins: [0, 0],
      },
      winner: winnerIndex,
    };
    debug("Sending match ended due to timeout %O", matchEndedMessage);
    this.outputChannel.sendMatchEnded(matchEndedMessage);
  }
}
