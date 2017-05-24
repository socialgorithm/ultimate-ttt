import {Options} from "./input";
import GUI from "./GUI";
import OnlineGame from "./OnlineGame";
import Socket from "./Socket";
import Player from "./Player";
/**
 * Load the package.json to get the version number
 */
const pjson = require('../../package.json');

/**
 * Game object
 */
export interface Game {
  /**
   * Array of players in this game
   */
  players: Array<Player>;
}

/**
 * Online Server class
 * Handles the sockets, players, games...
 */
export default class OnlineServer {
  /**
   * List of players in the server
   */
  private players: Array<string>;
  /**
   * Current games being played
   */
  private games: Array<Game>;
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
  private socket: Socket;
  /**
   * Server options
   */
  private options: Options;

  constructor(options: Options) {
    this.players = [];
    this.games = [];
    this.nextGame = 0;
    this.options = options;

    this.socket = new Socket(
        this.options.port,
        {
          onPlayerConnect: this.onPlayerConnect,
          onPlayerDisconnect: this.onPlayerDisconnect,
          updateStats: this.updateStats,
        }
    );

    const title = 'Ultimate TTT Algorithm Battle v' + pjson.version;

    if (options.gui) {
      this.ui = new GUI(title, this.options.host, this.options.port);
    } else {
      this.log(title);
      this.log('Listening on ' + this.options.host + ':' + this.options.port);
    }

    this.log('Server started', true);

    if (this.ui) {
      this.ui.render();
    }
  }

  private onPlayerConnect(player: Player): void {
    const playerIndex = this.addPlayer(player.token);

    if (!this.games[this.nextGame]) {
      this.games[this.nextGame] = {
        players: []
      };
    } else if (this.games[this.nextGame].players.length >= 2) {
      this.nextGame++;
      this.games[this.nextGame] = {
        players: []
      };
    }

    const session = this.games[this.nextGame];
    const sessionPlayer = session.players.length;
    session.players[sessionPlayer] = player;

    if (session.players.length >= 2) {
      this.startSession(session, this.options);
      this.nextGame++;
    }

    player.socket.emit('game', {
      action: 'waiting'
    });
  }

  private onPlayerDisconnect(player: Player): void {
    console.log('handle player disconnect on his active games');
  }

  private updateStats(): void {
    this.socket.emit('stats', {
      type: 'stats',
      payload: {
        players: this.players,
        games: [],
      },
    });
  }

  /**
   * Take a game holder with two connected players and start
   * playing
   * @param session Game session with two active players ready
   * @param settings Server options
   */
  private startSession(session: Game, settings: Options = {}) {
    this.log('Starting games between "' +
        this.players[session.players[0].playerIndex] +
        '" and "' +
        this.players[session.players[1].playerIndex] +
        '"'
    );

    this.socket.emit(
      'stats',
      {
        type: 'session-start',
        payload: {
          players: [
            this.players[session.players[0].playerIndex],
            this.players[session.players[1].playerIndex]
          ],
        },
      }
    );

    const onlineGame = new OnlineGame(
        session,
        this.socket,
        this.players,
        this.ui,
        settings
    );

    session.players[0].socket.on('disconnect', () => {
      if (session.players && session.players[0]) {
        this.removePlayer(this.players[session.players[0].playerIndex]);
        onlineGame.handleGameEnd(1, true);
      }
    });
    session.players[1].socket.on('disconnect', () => {
      if (session.players && session.players[1]) {
        this.removePlayer(this.players[session.players[1].playerIndex]);
        onlineGame.handleGameEnd(0, true);
      }
    });

    // Receive input from a player
    session.players[0].socket.on('game', onlineGame.handlePlayerMove(0));
    session.players[1].socket.on('game', onlineGame.handlePlayerMove(1));

    // Start game
    onlineGame.playGame();
  }

  /**
   * Add a player to the server
   * @param player Player token
   * @returns {number} Player index in the player list
   */
  private addPlayer(player: string): number {
    let index = -1;
    if (this.players.indexOf(player) < 0) {
      index = this.players.push(player) - 1;
    }
    this.log('Connected "' + player + '"', true);
    this.socket.emit('stats', {
      type: 'connect',
      payload: player,
    });
    if (this.ui) {
      this.ui.renderOnlinePlayers(this.players);
    }
    return index;
  }

  /**
   * Remove a player from the server
   * @param player Player token
   */
  private removePlayer(player: string): void {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }
    this.log('Disconnected "' + player + '"', true);
    this.socket.emit('stats', {
      type: 'disconnect',
      payload: player,
    });
    if (this.ui) {
      this.ui.renderOnlinePlayers(this.players);
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

