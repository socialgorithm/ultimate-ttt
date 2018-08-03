import {IOptions} from "../lib/cli-options";
import { Lobby } from "../tournament/model/Lobby";
import Player from "../tournament/model/Player";
import { ITournamentOptions, Tournament } from "../tournament/Tournament";

import SocketServer from "./SocketServer";

/**
 * Load the package.json to get the version number
 */
// tslint:disable-next-line:no-var-requires
const pjson = require("../../package.json");

/**
 * Online Server class
 * Handles the sockets, players, games...
 */
export default class Server {

  /**
   * List of players in the server
   */
  private players: Player[];

  private lobbies: Lobby[];

  /**
   * Socket.IO Server reference
   */
  private socketServer: SocketServer;

  constructor(private options: IOptions) {
    this.players = [];
    this.lobbies = [];

    this.socketServer = new SocketServer(this.options.port, {
      onLobbyBan: this.onLobbyBan.bind(this),
      onLobbyCreate: this.onLobbyCreate.bind(this),
      onLobbyJoin: this.onLobbyJoin.bind(this),
      onLobbyKick: this.onLobbyKick.bind(this),
      onLobbyTournamentContinue: this.onLobbyTournamentContinue.bind(this),
      onLobbyTournamentStart: this.onLobbyTournamentStart.bind(this),
      onPlayerConnect: this.onPlayerConnect.bind(this),
      onPlayerDisconnect: this.onPlayerDisconnect.bind(this),
    });

    const title = `Ultimate TTT Algorithm Battle v${pjson.version}`;

    this.log(title);
    this.log(`Listening on localhost:${this.options.port}`);

    this.log("Server started");
  }

  private onPlayerConnect(player: Player): void {
    this.addPlayer(player);
    player.channel.send("waiting");
  }

  private onPlayerDisconnect = (player: Player): void => {
    this.log("Handle player disconnect on his active games");
    // TODO Remove the player from any lobbies
    this.lobbies.forEach(lobby => {
      const playerIndex = lobby.players.findIndex(eachPlayer => eachPlayer.token === player.token);
      if (playerIndex < 0) {
        return;
      }
      // Remove the player, and notify lobby of changes
      lobby.players.splice(playerIndex, 1);
      this.socketServer.emitToLobbyInfo(lobby.token, "lobby disconnected", {
        payload: {
          lobby: lobby.toObject(),
        },
        type: "player left",
      });
    });
  }

    private onLobbyKick = (lobbyToken: string, playerToken: string): Lobby => {
        this.log("Player " + playerToken + " is being kicked from " + lobbyToken);
        const foundLobby = this.lobbies.find(l => l.token === lobbyToken);
        if (foundLobby == null) {
            this.log("Lobby not found (" + lobbyToken + ")");
            return null;
        }

        const playerIndex = foundLobby.players.findIndex(p => p.token === playerToken);
        foundLobby.players.splice(playerIndex, 1);

        return foundLobby;
    }

  private onLobbyBan = (lobbyToken: string, playerToken: string): Lobby => {
    this.log("Player " + playerToken + " is being banned from " + lobbyToken);
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken);
    if (foundLobby == null) {
      this.log("Lobby not found (" + lobbyToken + ")");
      return null;
    }

    const playerIndex = foundLobby.players.findIndex(p => p.token === playerToken);
    foundLobby.players.splice(playerIndex, 1);
    foundLobby.bannedPlayers.push(playerToken);

    return foundLobby;
  }

  private onLobbyCreate = (creator: Player): Lobby => {
    const lobby = new Lobby(creator);
    this.lobbies.push(lobby);
    this.log("Created lobby " + lobby.token);
    return lobby;
  }

  private onLobbyJoin = (player: Player, lobbyToken: string, spectating: boolean = false): Lobby => {
    this.log("Player " + player.token + " wants to join " + lobbyToken + " - spectating? " + spectating);
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken);
    if (foundLobby == null) {
      this.log("Lobby not found (" + lobbyToken + ")");
      return null;
    }

    if (foundLobby.bannedPlayers.find(p => p === player.token)) {
      return null;
    }

    // If the user is spectating, we wont add it to the players list (e.g. web client)
    if (!spectating && foundLobby.players.find(p => p.token === player.token) == null) {
      foundLobby.players.push(player);
      this.log("Player " + player.token + " joined " + lobbyToken);
    }

    return foundLobby;
  }

  private onLobbyTournamentStart(lobbyToken: string, tournamentOptions: ITournamentOptions, players: string[]): Lobby {
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken);
    if (foundLobby == null) {
      return null;
    }

    if (foundLobby.tournament == null || foundLobby.tournament.isFinished()) {
      this.log(`Starting tournament in lobby ${foundLobby.token}!`);
      const playersToPlay = foundLobby.players.filter(p => players.includes(p.token));
      foundLobby.tournament = new Tournament(tournamentOptions, this.socketServer, playersToPlay, foundLobby.token);
      foundLobby.tournament.start();
    }

    return foundLobby;
  }

  private onLobbyTournamentContinue(lobbyToken: string): Lobby {
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken);
    if (foundLobby == null) {
      return null;
    }

    if (foundLobby.tournament == null || foundLobby.tournament.isFinished()) {
        return null;
    }

    foundLobby.tournament.continue();

    return foundLobby;
  }

  /**
   * Add a player to the server
   * @param player Player token
   */
  private addPlayer(player: Player): void {
    const matches = this.players.filter(p => p.token === player.token);
    if (matches.length > 0) {
      matches[0].channel.disconnect();
      this.removePlayer(matches[0]);
    }

    process.nextTick(() => {
      if (this.players.filter(p => p.token === player.token).length === 0) {
        this.players.push(player);
      }
      this.log(`Connected "${player.token}"`);
    });
  }

  /**
   * Remove a player from the server
   * @param player Player token
   */
  private removePlayer(player: Player): void {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    } else {
      return;
    }
    this.log(`Disconnected ${player.token}`);
  }

  /**
   * Log a message to the console
   * @param message
   */
  private log(message: string): void {
    const time = (new Date()).toTimeString().substr(0, 5);
    // tslint:disable-next-line:no-console
    console.log(`[${time}]`, message);
  }
}
