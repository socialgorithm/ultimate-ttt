// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:uttt:match");

import { IMatch, MatchOutputChannel, Player } from "@socialgorithm/game-server";
import { Game, MatchOptions, Messages } from "@socialgorithm/model";
import UTTTGame from "./UTTTGame";

export default class UTTTMatch implements IMatch {
  private currentGame: UTTTGame;
  private gamesCompleted: Game[] = [];
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
    this.currentGame = new UTTTGame(this.players, this.onGameMessageToPlayer, this.onGameEnded);
    this.currentGame.start();
  }

  private onGameMessageToPlayer = (player: Player, message: any) => {
    this.outputChannel.sendMessageToPlayer(player, message);
  }

  private onGameEnded = (stats: Game) => {
    this.outputChannel.sendGameEnded(stats);
    this.gamesCompleted.push(stats);

    if (stats.winner) {
      const winningIndex = this.players.indexOf(stats.winner);
      if (winningIndex !== -1) {
        this.onGameMessageToPlayer(this.players[winningIndex], "game win");
        this.onGameMessageToPlayer(this.players[1 - winningIndex], "game lose " + (stats.stats.previousMove));
      }
    } else {
      this.onGameMessageToPlayer(this.players[0], "game tie" + (stats.stats.playedPlayerIndex !== 0 ? ` ${stats.stats.previousMove}` : ''));
      this.onGameMessageToPlayer(this.players[1], "game tie" + (stats.stats.playedPlayerIndex !== 1 ? ` ${stats.stats.previousMove}` : ''));
    }

    if (this.gamesCompleted.length < this.options.maxGames) {
      if (this.isMatchWinnable()) this.playNextGame();
      else this.endMatch();
    } else if (this.hasUnaminusWinner()) {
      this.endMatch();
    } else {
      this.playNextGame();
    }
  }

  private isMatchWinnable() : boolean {
    const gameWonPlayer1 : number = this.gamesCompleted.filter((game: Game) => !game.tie && this.players[0] === game.winner).length;
    const gameWonPlayer2 : number = this.gamesCompleted.filter((game: Game) => !game.tie && this.players[1] === game.winner).length;
    const matchesLeft : number = this.options.maxGames - this.gamesCompleted.length;
    const diffBetweenScore = Math.abs(gameWonPlayer1 - gameWonPlayer2);

    if (matchesLeft > 0) {
      return matchesLeft >= diffBetweenScore;
    }
    return false;
  }

  private hasUnaminusWinner() : boolean {
    const gameWonPlayer1 : number = this.gamesCompleted.filter((game: Game) => !game.tie && this.players[0] === game.winner).length;
    const gameWonPlayer2 : number = this.gamesCompleted.filter((game: Game) => !game.tie && this.players[1] === game.winner).length;

    // Assuming Games > Max Games
    // Even Number Of Games
    // Just Have To Be One Ahead
    // Odd Number Games
    // Have To Be Two Ahead
    if (this.gamesCompleted.length % 2 === 0) {
      if (gameWonPlayer1 > gameWonPlayer2) return true;
      if (gameWonPlayer2 > gameWonPlayer1) return true;
    } else {
      if (gameWonPlayer1 - 1 > gameWonPlayer2) return true;
      if (gameWonPlayer2 - 1 > gameWonPlayer1) return true;
    }

    return false;
  }

  private endMatch = () => {
    const gamesTied : number = this.gamesCompleted.filter((game: Game) => game.tie).length;
    const gameWonPlayer1 : number = this.gamesCompleted.filter((game: Game) => !game.tie && this.players[0] === game.winner).length;
    const gameWonPlayer2 : number = this.gamesCompleted.filter((game: Game) => !game.tie && this.players[1] === game.winner).length;
    const winner : 0 | 1 | -1 = gameWonPlayer1 === gameWonPlayer2 ? -1 : gameWonPlayer1 > gameWonPlayer2 ? 0 : 1;
    const winningMessage = winner === -1 ? `Game Tie` : `${this.players[winner]} Won`;

    if (winner !== -1) {
      this.onGameMessageToPlayer(this.players[winner], "match win");
      this.onGameMessageToPlayer(this.players[1 - winner], "match lose");
    } else {
      this.onGameMessageToPlayer(this.players[winner], "match tie");
      this.onGameMessageToPlayer(this.players[1 - winner], "match tie");
    }

    const matchEndedMessage: Messages.MatchEndedMessage = {
      games: this.gamesCompleted,
      matchID: "--",
      messages: [ winningMessage ],
      options: this.options,
      players: this.players,
      state: "finished",
      stats: {
        gamesCompleted: this.gamesCompleted.length,
        gamesTied: gamesTied,
        wins: [gameWonPlayer1, gameWonPlayer2],
      },
      winner: winner,
    };
    this.outputChannel.sendMatchEnded(matchEndedMessage);
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
