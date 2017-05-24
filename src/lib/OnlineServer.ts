import {Options} from "./input";
import GUI from "./GUI";
import OnlineGame from "./OnlineGame";
import SocketServer from "./SocketServer";
import Player from "./Player";
import Session from './Session';

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
  /**
   * Current games being played
   */
  private games: Array<Session>;
  /**
   * Index of the next game that will be played
   */
  private nextGame: number;
  /**
   * Optional reference to the server GUI (if it has been enabled in the options)
   */
  private ui?: GUI;
  /**
   * Socket.IO Server reference
   */
  private socketServer: SocketServer;
  /**
   * Server options
   */
  private options: Options;

  constructor(options: Options) {
    this.players = [];
    this.games = [];
    this.nextGame = 0;
    this.options = options;
    
    this.socketServer = new SocketServer(
        this.options.port,
        {
          onPlayerConnect: this.onPlayerConnect,
          onPlayerDisconnect: this.onPlayerDisconnect,
          updateStats: this.updateStats,
        }
    );

    const title = `Ultimate TTT Algorithm Battle v${pjson.version}`;

    if (options.gui) {
      this.ui = new GUI(title, this.options.host, this.options.port);
    } else {
      this.log(title);
      this.log(`Listening on ${this.options.host}:${this.options.port}`);
    }

    this.log('Server started', true);

    if (this.ui) {
      this.ui.render();
    }
  }

  private onPlayerConnect(player: Player): void {
    const playerIndex = this.addPlayer(player);

    if (!this.games[this.nextGame]) {
      this.games[this.nextGame] = new Session([undefined, undefined]);
    } 
    // TODO : Check, can this ever actually happen given logic below?
    else if (this.games[this.nextGame].players.length >= 2) {
      this.nextGame++;
      this.games[this.nextGame] = new Session([undefined, undefined]);
    }

    const session = this.games[this.nextGame];
    session.players[session.players[0] === undefined ? 0 : 1] = player;

    if (session.players.length >= 2) {
      this.startSession(session, this.options);
      this.nextGame++;
    }

    player.deliverAction('waiting');
  }

  private onPlayerDisconnect(player: Player): void {
    console.log('handle player disconnect on his active games');
  }

  private updateStats(): void {
    const payload = { players: this.players.map(p => p.token), games: [] as any[] };
    this.socketServer.emitPayload('stats', 'stats', payload);
  }

  /**
   * Take a game holder with two connected players and start
   * playing
   * @param session Game session with two active players ready
   * @param settings Server options
   */
  private startSession(session: Session, settings: Options = {}) {
    this.log(`Starting games between "${session.players[0].token}" and "${session.players[1].token}"`);

    this.socketServer.emitPayload('stats', 'session-start', { players: session.playerTokens() });

    const onlineGame = new OnlineGame(session, this.socketServer, this.ui, settings);

    session.players[0].socket.on('disconnect', () => {
      if (session.players && session.players[0]) {
        this.removePlayer(session.players[0]);
        onlineGame.handleGameEnd(1, true);
      }
    });
    session.players[1].socket.on('disconnect', () => {
      if (session.players && session.players[1]) {
        this.removePlayer(session.players[1]);
        onlineGame.handleGameEnd(0, true);
      }
    });

    // Receive input from a player
    session.players[0].socket.on('game', onlineGame.handlePlayerMove(session.players[0]));
    session.players[1].socket.on('game', onlineGame.handlePlayerMove(session.players[1]));

    // Start game
    onlineGame.playGame();
  }

  /**
   * Add a player to the server
   * @param player Player token
   * @returns {number} Player index in the player list
   */
  private addPlayer(player: Player): number {
    let index = -1;
    if (this.players.indexOf(player) < 0) {
      index = this.players.push(player) - 1;
    }
    this.log('Connected "' + player + '"', true);
    this.socketServer.emitPayload('stats', 'connect', player);
    if (this.ui) {
      this.ui.renderOnlinePlayers(this.players.map(p => p.token));
    }
    return index;
  }

  /**
   * Remove a player from the server
   * @param player Player token
   */
  private removePlayer(player: Player): void {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }
    this.log('Disconnected "' + player + '"', true);
    this.socketServer.emitPayload('stats', 'disconnect', player);
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

