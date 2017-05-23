import * as http from 'http';
import * as io from 'socket.io';
import * as fs from 'fs';

import {Options} from "./input";
import GUI from "./GUI";
import OnlineGame from "./OnlineGame";
/**
 * Load the package.json to get the version number
 */
const pjson = require('../../package.json');

/**
 * Player object
 */
export interface Player {
  /**
   * Index in the player list
   */
  playerIndex: number;
  /**
   * Socket to connect to this player directly
   */
  socket: SocketIO.Socket;
}

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
  private io: SocketIO.Server;
  /**
   * Server host
   */
  private host: string;
  /**
   * Server port
   */
  private port: number;

  constructor(options: Options) {
    this.players = [];
    this.games = [];
    this.nextGame = 0;
    this.host = options.host;
    this.port = parseInt(options.port, 10) || 3141;

    const app = http.createServer(this.handler);
    this.io = io(app);
    app.listen(this.port);

    const title = 'Ultimate TTT Algorithm Battle v' + pjson.version;

    if (options.gui) {
      this.ui = new GUI(title, this.host, this.port);
    } else {
      this.log(title);
      this.log('Listening on ' + this.host + ':' + this.port);
    }

    this.log('Server started', true);

    this.io.use((socket: SocketIO.Socket, next) => {
      const isClient = socket.request._query.client || false;
      if (isClient) {
        return next();
      }
      const token = socket.request._query.token;
      if (!token) {
        return next(new Error('Missing token'));
      }
      socket.request.testToken = token;
      next();
    });

    this.io.on('connection', (socket) => {
      if (socket.handshake.query.client) {
        // a client (observer) has connected, don't add to player list
        // send a summary of the server
        socket.emit('stats', {
          type: 'stats',
          payload: {
            players: this.players,
            games: [],
          },
        });
        return true;
      }

      const playerIndex = this.addPlayer(socket.handshake.query.token);

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
      const player = session.players.length;
      session.players[player] = {
        playerIndex: playerIndex,
        socket: socket
      };

      if (session.players.length >= 2) {
        this.startSession(session, options);
        this.nextGame++;
      }

      socket.emit('game', {
        action: 'waiting'
      });
    });

    if (this.ui) {
      this.ui.render();
    }
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

    this.io.emit('stats', {
      type: 'session-start',
      payload: {
        players: [
          this.players[session.players[0].playerIndex],
          this.players[session.players[1].playerIndex]
        ],
      },
    });

    const onlineGame = new OnlineGame(
        session,
        this.io,
        this.players,
        this.ui,
        settings
    );

    session.players[0].socket.on('disconnect', function () {
      this.removePlayer(this.players[session.players[0].playerIndex]);
      onlineGame.handleGameEnd(1, true);
    });
    session.players[1].socket.on('disconnect', function () {
      this.removePlayer(this.players[session.players[1].playerIndex]);
      onlineGame.handleGameEnd(0, true);
    });

    // Receive input from a player
    session.players[0].socket.on('game', onlineGame.handlePlayerMove(0));
    session.players[1].socket.on('game', onlineGame.handlePlayerMove(1));

    // Start game
    onlineGame.playGame();
  }

  /**
   * Handler for the WebSocket server. It returns a static HTML file for any request
   * that links to the server documentation and Github page.
   * @param req
   * @param res
   */
  private handler(req: http.IncomingMessage, res: http.ServerResponse) {
    fs.readFile(__dirname + '/../../public/index.html',
      (err: any, data: any) => {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
      });
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
    this.io.emit('stats', {
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
    this.io.emit('stats', {
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

