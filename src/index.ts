
/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

import OnlineServer from './lib/OnlineServer';
import { Options } from "./lib/input";

export default function server(options: Options) {
  // env overrides
  options.host = process.env.HOST || options.host || 'localhost';
  options.port = process.env.PORT || options.port;
  options.games = process.env.TTT_GAMES || options.games;
  options.timeout = process.env.TTT_TIMEOUT || options.timeout;

  new OnlineServer(options);
}