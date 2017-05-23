/// <reference path="../../custom-types/blessed/index.d.ts" />
import * as blessed from 'blessed';
import * as ip from "ip";
import State from "./State";
const pjson = require('../../package.json');

/**
 * UI Holder for each game in the server
 */
export interface GameUI {
    box: blessed.Widgets.BoxElement;
    progressBar: blessed.Widgets.ProgressBarElement;
    players: [string, string];
}

/**
 * Terminal GUI manager using ncurses
 * All GUI references and interactions are handled through this so the server is
 * independent from it.
 */
export default class GUI {
    /**
     * Main screen UI reference
     */
    public screen: blessed.Widgets.Screen;
    /**
     * Online users box UI reference
     */
    public onlineUsers: blessed.Widgets.BoxElement;
    /**
     * Game list UI reference
     */
    public gameArea: blessed.Widgets.BoxElement;
    /**
     * Log box UI reference
     */
    public logger: blessed.Widgets.Log;
    /**
     * List of games currently being played
     */
    public games: Array<GameUI>;

    /**
     * Start a GUI for the server
     * @param title Window title
     * @param host Server host
     * @param port Server port
     */
    constructor(title: string, host: string, port: number) {
        this.screen = blessed.screen({
            smartCSR: true,
            warnings: true
        });

        this.games = [];

        this.screen.title = title;

        const header = blessed.box({
            parent: this.screen,
            top: 0,
            left: 0,
            width: '100%',
            height: 3,
            align: 'center',
            tags: true,
            content: '{bold}{red-fg}Ultimate TTT Algorithm Battle v' + pjson.version + '{/red-fg}{/bold}',
        });

        header.insertBottom('{yellow-fg}Local address:{/yellow-fg}   http://' + host + ':' + port);
        header.insertBottom('{yellow-fg}Network address:{/yellow-fg} http://' + ip.address() + ':' + port);

        this.screen.key(['escape', 'q', 'C-c'], () => {
            return process.exit(0);
        });

        this.onlineUsers = blessed.box({
            parent: this.screen,
            top: 4,
            left: 0,
            width: 20,
            height: '100%-4',
            tags: true,
            content: '{bold}Online users{/bold}',
            border: 'line',
            style: {
                border: {
                    fg: 'blue',
                }
            }
        });

        this.gameArea = blessed.box({
            parent: this.screen,
            top: 4,
            left: 21,
            width: '100%-22',
            height: '100%-14',
            content: '{bold}Games{/bold}',
            tags: true,
            border: 'line',
            style: {
                border: {
                    fg: 'blue',
                }
            }
        });

        // The definitions for blessed are wrong here
        // will submit a PR to fix them
        this.logger = blessed.log({
            parent: this.screen,
            bottom: 0,
            left: 21,
            width: '100%-22',
            height: 10,
            border: 'line',
            tags: true,
            keys: true,
            vi: true,
            mouse: true,
            scrollback: 100,
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'yellow'
                },
                style: {
                    inverse: true
                }
            },
            style: {
                border: {
                    fg: 'blue',
                }
            }
        });
    }

    /**
     * Render the given list of player tokens
     * @param players Player list
     */
    public renderOnlinePlayers(players: Array<string>) {
        this.onlineUsers.content = '{bold}Online players{/bold}';
        this.onlineUsers.render();
        players.forEach((player: string) => {
            this.onlineUsers.insertBottom(' ' + player);
        });

        this.render();
    }

    /**
     * Add a new game UI
     * @param playerOne Token of player 1
     * @param playerTwo Token of player 2
     * @returns {number} Game Box ID
     */
    public addGameBox(playerOne: string, playerTwo: string): number {
        const height = 3;
        const gameUI: GameUI = {
            box: blessed.box({
                parent: this.gameArea,
                top: 2 + (this.games.length - 1) * height,
                left: 0,
                width: '100%-2',
                height: height,
                tags: true,
                style: {
                    bg: 'black'
                }
            }),
            progressBar: null,
            players: [
                playerOne,
                playerTwo
            ]
        };

        gameUI.box.append(blessed.text({
            top: 0,
            left: 0,
            style: {
                bg: 'black'
            },
            tags: true,
            content: '{red-fg}"' +
            playerOne +
            '"{/red-fg} vs {red-fg}"' +
            playerTwo +
            '"{/red-fg}'
        }));

        gameUI.progressBar = blessed.progressbar({
            top: 2,
            left: 0,
            pch: ' ',
            orientation: 'horizontal',
            keys: false,
            mouse: false,
            filled: 0,
            value: 0,
            style: {
                bg: 'black',
                bar: {
                    bg: 'blue'
                },
                border: {
                    bg: 'black'
                }
            },
            width: '100%',
            height: 1,
        });
        gameUI.box.append(gameUI.progressBar);

        this.gameArea.render();
        this.render();

        return this.games.push(gameUI);
    }

    /**
     * Update the game progress between two players
     * @param gameIndex Game Box ID
     * @param progress Progress from 0 o 100
     */
    public setGameProgress(gameIndex: number, progress: number): void {
        if (this.games[gameIndex]) {
            this.games[gameIndex].progressBar.setProgress(progress);
            this.render();
        }
    }

    /**
     * Change a game UI to finished mode
     * @param gameIndex Game Box ID
     * @param winner Winner token
     * @param state Game state
     */
    public setGameEnd(gameIndex: number, winner: string, state: State): void {
        const game = this.games[gameIndex];
        const stats = state.getStats();
        game.progressBar.destroy();

        game.box.append(blessed.text({
            top: 1,
            left: 0,
            style: {
                bg: 'black'
            },
            tags: true,
            content: '{blue-fg}Winner:{/blue-fg} ' + winner +
            '. {blue-fg}Wins:{/blue-fg} {yellow-fg}Player "' + game.players[0] +
            '"{/yellow-fg} ' + state.wins[0] + ' (' + stats.winPercentages[0] + ') - ' +
            '{yellow-fg}Player "' + game.players[1] + '"{/yellow-fg} ' + state.wins[1] +
            ' (' + stats.winPercentages[1] + ') - ' +
            '{blue-fg}Ties{/blue-fg} ' + state.ties + ' (' + stats.tiePercentage + ')'
        }));

        game.box.append(blessed.text({
            top: 2,
            left: 0,
            style: {
                bg: 'black'
            },
            tags: true,
            content: '{yellow-fg}Total time:{/yellow-fg} ' + stats.total + 'ms. ' +
            '{yellow-fg}Avg:{/yellow-fg} ' + stats.avg + 'ms. ' +
            '{yellow-fg}Max:{/yellow-fg} ' + stats.max + 'ms. ' +
            '{yellow-fg}Min:{/yellow-fg} ' + stats.min + 'ms'
        }));

        this.render();
    }

    /**
     * Log a message to the log box
     * @param message Message
     * @param skipRender Avoid rendering, useful if multiple messages will be logged
     */
    public log (message: string, skipRender: boolean = false): void {
        const time = (new Date()).toTimeString().substr(0,5);
        this.logger.log('{blue-fg}[' + time + ']{/blue-fg} ' + message);
        if (!skipRender) {
            this.render();
        }
    }

    /**
     * Render the UI
     */
    public render() {
        this.screen.render();
    }
}