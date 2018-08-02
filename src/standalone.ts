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
import Server from 'server/Server';
import {DEFAULT_OPTIONS} from "lib/cli-options";

new Server(DEFAULT_OPTIONS);