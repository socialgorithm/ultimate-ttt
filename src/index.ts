
/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

import localGame from './lib/local';
import OnlineServer from './lib/OnlineServer';
import { Options } from "./lib/input";

export default function server(options: Options) {
  // env overrides
  options.host = process.env.HOST || options.host || 'localhost';
  options.port = process.env.PORT || options.port;
  options.games = process.env.TTT_GAMES || options.games;
  options.timeout = process.env.TTT_TIMEOUT || options.timeout;

  if (options.local) {
    localGame(options);
  } else if (options.a || options.b) {
    console.error('Error: Player files may only be specified for local games (use --local with -a and -b)');
  } else {
    new OnlineServer(options);
  }
}