import {Options} from "../lib/cli-options";
import GUI from "./GUI";
import SocketServer from "./SocketServer";
import Player from "../tournament/model/Player";
import { Tournament, TournamentOptions } from '../tournament/Tournament';
import { Lobby } from "../tournament/model/Lobby";
import * as events from '../events';
import PubSubber from "../tournament/model/Subscriber";

/**
 * Load the package.json to get the version number
 */
const pjson = require('../../package.json');

/**
 * Online Server class
 * Handles the sockets, players, games...
 */
export default class Server extends PubSubber {

  /**
   * List of players in the server
   */
  private players: Array<Player>;

  private lobbies: Array<Lobby>;
  
  /**
   * Optional reference to the server GUI (if it has been enabled in the options)
   */
  private ui?: GUI;
  
  /**
   * Socket.IO Server reference
   */
  private socketServer: SocketServer;

  constructor(private options: Options) {
    super();
    this.players = [];
    this.lobbies = [];

    this.socketServer = new SocketServer(this.options.port);

    const title = `Ultimate TTT Algorithm Battle v${pjson.version}`;

    if (options.gui) {
      this.ui = new GUI(title, this.options.port);
    } else {
      this.log(title);
      this.log(`Listening on localhost:${this.options.port}`);
    }

    this.log('Server started', true);

    if (this.ui) {
      this.ui.render();
    }

    // Setup the listeners
    this.subscribe(events.PLAYER_CONNECT, this.onPlayerConnect);
    this.subscribe(events.PLAYER_DISCONNECT, this.onPlayerDisconnect);
    this.subscribe(events.LOBBY_CREATE, this.onLobbyCreate);
    this.subscribe(events.LOBBY_JOIN, this.onLobbyJoin);
    this.subscribe(events.TOURNAMENT_START, this.onLobbyTournamentStart);
    // this.subscribe(events.UPDATE_STATS, this.updateStats);
    this.subscribe(events.LOG, this.log);
  }

  private onPlayerConnect(player: Player): void {
    // const matches = this.players.filter(p => p.token === player.token);
    // if (matches.length > 0) {
    //   matches[0].channel.disconnect();
    //   this.removePlayer(matches[0]);
    // }

    if (this.players.filter(p => p.token === player.token).length === 0) {
      this.players.push(player);
    }
    this.log(`Connected "${player.token}"`, true);
  }

  private onPlayerDisconnect = (player: Player): void => {
    this.log('Handle player disconnect on his active games');
    const lobbyList: Array<Lobby> = [];
    this.lobbies.forEach(lobby => {
      const playerIndex = lobby.players.findIndex(eachPlayer => eachPlayer.token === player.token);
      if (playerIndex < 0) {
        return;
      }
      // Remove the player, and notify lobby of changes
      lobby.players.splice(playerIndex, 1);
      lobbyList.push(lobby);
    });

    this.publish(events.success(events.PLAYER_DISCONNECT), {
      lobbyList,
      player,
    });
  }

  private onLobbyCreate = (creator: Player): Lobby => {
    const lobby = new Lobby(creator)
    this.lobbies.push(lobby)
    this.log('Created lobby ' + lobby.token);
    return lobby
  }

  private onLobbyJoin = (player: Player, lobbyToken: String, spectating: boolean = false): Lobby => {
    this.log('Player ' + player.token + ' wants to join ' + lobbyToken + ' - spectating? ' + spectating);
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken)
    if(foundLobby == null) {
      this.log('Lobby not found (' + lobbyToken + ')');
      return null;
    }

    // If the user is spectating, we wont add it to the players list (e.g. web client)
    if(!spectating && foundLobby.players.find(p => p.token === player.token) == null) {
      foundLobby.players.push(player)
      this.log('Player ' + player.token + ' joined ' + lobbyToken);
    }

    this.publish(events.success(events.LOBBY_JOIN), {
      lobby: foundLobby,
      player,
    });
    
    return foundLobby;
  }

  private onLobbyTournamentStart(lobbyToken: string, tournamentOptions: TournamentOptions): Tournament {
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken)
    if(foundLobby == null) {
      return null;
    }

    if(foundLobby.tournament == null || foundLobby.tournament.isFinished()) {
      this.log(`Starting tournament in lobby ${foundLobby.token}!`);
      foundLobby.tournament = new Tournament(tournamentOptions, this.socketServer, foundLobby.players, foundLobby.token);
      foundLobby.tournament.start();
    }

    return foundLobby.tournament
  }

  // private updateStats(): void {
  //   const payload = { players: this.players.map(p => p.token), games: [] as any[] };
  //   this.socketServer.emitPayload('stats', 'stats', payload);
  // }

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
    this.log(`Disconnected ${player.token}`, true);
    if (this.ui) {
      this.ui.renderOnlinePlayers(this.players.map(p => p.token));
    }
  }

  /**
   * Log a message to the console or the GUI if it's enabled
   * @param message
   * @param skipRender only for GUI mode, set to true to avoid rerendering
   */
  private log(message: string, skipRender: boolean = false): void {
    const time = (new Date()).toTimeString().substr(0,5);
    if (this.ui) {
      this.ui.log(message, skipRender);
    } else {
      console.log(`[${time}]`, message);
    }
  }
}

