
/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

import Server from './server/Server';
import { Options } from "./lib/cli-options";

/**
 * Start a server with the given options
 * @param options Server options
 */
export default (options: Options) => {
  new Server(options);
}