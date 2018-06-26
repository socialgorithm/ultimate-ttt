import {Options} from "./input";
import GUI from "./GUI";
import OnlineGame from "./OnlineGame";
import { SocketServer, SocketServerImpl } from "./SocketServer";
import { Player } from "./Player";
import Session from './Session';
import { Tournament } from './Tournament';
import randomWord from "random-word"
import { Lobby } from "./Lobby";

/**
 * Load the package.json to get the version number
 */
const pjson = require('../../package.json');

/**
 * Online Server class
 * Handles the sockets, players, games...
 */
export default class OnlineServer {

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
    this.players = [];
    this.lobbies = [];

    this.socketServer = new SocketServerImpl(this.options.port, {
      onPlayerConnect: (player: Player) => this.onPlayerConnect(player), 
      onPlayerDisconnect: (player: Player) => this.onPlayerDisconnect(player), 
      onLobbyCreate: (player: Player) => this.onLobbyCreate(player),
      onLobbyJoin: (player: Player, lobbyToken: string) => this.onLobbyJoin(player, lobbyToken),
      onLobbyTournamentStart: (lobbyToken: string) => this.onLobbyTournamentStart(lobbyToken),
      updateStats: () => this.updateStats()
    });

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
  }

  private onPlayerConnect(player: Player): void {
    this.addPlayer(player);
    player.deliverAction('waiting');
  }

  private onPlayerDisconnect(player: Player): void {
    this.log('Handle player disconnect on his active games');
  }

  private onLobbyCreate(creator: Player): Lobby {
    const lobby = new Lobby(creator)
    this.lobbies.push(lobby)
    return lobby
  }

  private onLobbyJoin(player: Player, lobbyToken: String): Lobby {
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken)
    if(foundLobby == null) {
      return null;
    }

    if(foundLobby.players.find(p => p.token === player.token) == null) {
      foundLobby.players.push(player)
    }
    
    return foundLobby;
  }

  private onLobbyTournamentStart(lobbyToken: string): Tournament {
    const foundLobby = this.lobbies.find(l => l.token === lobbyToken)
    if(foundLobby == null) {
      return null;
    }

    if(foundLobby.tournament == null || foundLobby.tournament.isFinished()) {
      this.log('Starting tournament in lobby ${foundLobby.token}!');
      foundLobby.tournament = new Tournament('Tournament', this.socketServer, foundLobby.players, this.options, this.ui);
      foundLobby.tournament.start();
    }

    return foundLobby.tournament
  }

  private updateStats(): void {
    const payload = { players: this.players.map(p => p.token), games: [] as any[] };
    this.socketServer.emitPayload('stats', 'stats', payload);
  }

  /**
   * Add a player to the server
   * @param player Player token
   */
  private addPlayer(player: Player): void {
    const matches = this.players.filter(p => p.token === player.token);
    if (matches.length > 0) {
      matches[0].socket.disconnect();
      this.removePlayer(matches[0]);
    }

    process.nextTick(() => {
      if (this.players.filter(p => p.token === player.token).length === 0) {
        this.players.push(player);
      }
      this.log(`Connected "${player.token}"`, true);
      this.socketServer.emitPayload('stats', 'connect', player.token);
      if (this.ui) {
        this.ui.renderOnlinePlayers(this.players.map(p => p.token));
      }
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
    this.log(`Disconnected ${player.token}`, true);
    this.socketServer.emitPayload('stats', 'disconnect', player.token);
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
      console.log(time, message);
    }
  }
}

