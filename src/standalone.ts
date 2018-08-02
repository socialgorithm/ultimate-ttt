/**
 * Ultimate TTT Server - Standalone option
 *
 * Start a server with the default options. You can override some defaults with the following env vars:
 *   - HOST Server host
 *   - PORT Server port
 *   - TTT_GAMES Number of games per session between users
 *   - TTT_TIMEOUT Timeout per game
 *
 * Take a look at src/lib/input.js for the whole list of options available.
 */
import {DEFAULT_OPTIONS} from "lib/cli-options";
import Server from "server/Server";

// tslint:disable-next-line:no-unused-expression
new Server(DEFAULT_OPTIONS);
