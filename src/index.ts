
/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

import OnlineServer from './lib/OnlineServer';
import { Options } from "./lib/input";

/**
 * Start a server with the given options
 * @param options Server options
 */
export default (options: Options) => {
  new OnlineServer(options);
}