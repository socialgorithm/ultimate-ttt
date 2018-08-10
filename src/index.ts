
/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

import { IOptions } from "./lib/cli-options";
import Server from "./server/Server";

/**
 * Start a server with the given options
 * @param options Server options
 */
export default (options: IOptions) => new Server(options.port);
