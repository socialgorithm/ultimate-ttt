"use strict";
exports.__esModule = true;
var blessed = require("blessed");
var ip = require("ip");
var pjson = require('../../package.json');
var GUI = (function () {
    function GUI(title, port) {
        this.screen = blessed.screen({
            smartCSR: true,
            warnings: true
        });
        this.games = [];
        this.screen.title = title;
        var header = blessed.box({
            parent: this.screen,
            top: 0,
            left: 0,
            width: '100%',
            height: 3,
            align: 'center',
            tags: true,
            content: '{bold}{red-fg}Ultimate TTT Algorithm Battle v' + pjson.version + '{/red-fg}{/bold}'
        });
        header.insertBottom('{yellow-fg}Local address:{/yellow-fg}   http://localhost:' + port);
        header.insertBottom('{yellow-fg}Network address:{/yellow-fg} http://' + ip.address() + ':' + port);
        this.screen.key(['escape', 'q', 'C-c'], function () {
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
                    fg: 'blue'
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
                    fg: 'blue'
                }
            }
        });
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
                    fg: 'blue'
                }
            }
        });
    }
    GUI.prototype.renderOnlinePlayers = function (players) {
        var _this = this;
        this.onlineUsers.content = '{bold}Online players{/bold}';
        this.onlineUsers.render();
        players.forEach(function (player) {
            _this.onlineUsers.insertBottom(' ' + player);
        });
        this.render();
    };
    GUI.prototype.addGameBox = function (playerOne, playerTwo) {
        var height = 3;
        var gameUI = {
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
            height: 1
        });
        gameUI.box.append(gameUI.progressBar);
        this.gameArea.render();
        this.render();
        return this.games.push(gameUI);
    };
    GUI.prototype.setGameProgress = function (gameIndex, progress) {
        if (this.games[gameIndex]) {
            this.games[gameIndex].progressBar.setProgress(progress);
            this.render();
        }
    };
    GUI.prototype.setGameEnd = function (gameIndex, winner, state) {
        var game = this.games[gameIndex];
        if (!game) {
            return;
        }
        var stats = state.getStats();
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
    };
    GUI.prototype.log = function (message, skipRender) {
        if (skipRender === void 0) { skipRender = false; }
        var time = (new Date()).toTimeString().substr(0, 8);
        this.logger.log('{blue-fg}[' + time + ']{/blue-fg} ' + message);
        if (!skipRender) {
            this.render();
        }
    };
    GUI.prototype.render = function () {
        this.screen.render();
    };
    return GUI;
}());
exports["default"] = GUI;
//# sourceMappingURL=GUI.js.map