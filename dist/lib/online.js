"use strict";
exports.__esModule = true;
var ultimate_ttt_1 = require("ultimate-ttt");
var ip = require("ip");
var blessed = require("blessed");
var pjson = require('../../package.json');
var funcs = require("./funcs");
var state_1 = require("./state");
var serverInfo = {
    players: [],
    games: [],
    nextGame: 0,
    ui: {},
    io: null
};
var OnlineServer = (function () {
    function OnlineServer(options) {
        var _this = this;
        this.players = [];
        this.games = [];
        this.nextGame = 0;
        this.ui = {
            enabled: options.gui || false,
            render: function () {
                if (_this.ui.enabled) {
                    _this.ui.screen.render();
                }
            }
        };
    }
    return OnlineServer;
}());
exports["default"] = OnlineServer;
function onlineGame(options) {
    serverInfo.ui.enabled = options.gui || false;
    serverInfo.ui.render = function () {
        if (serverInfo.ui.enabled) {
            serverInfo.ui.screen.render();
        }
    };
    var host = options.host;
    var port = options.port || 3141;
    var title = 'Ultimate TTT Algorithm Battle v' + pjson.version;
    var app = require('http').createServer(handler);
    var io = require('socket.io')(app);
    var fs = require('fs');
    app.listen(port);
    serverInfo.io = io;
    if (serverInfo.ui.enabled) {
        var screen_1 = blessed.screen({
            dump: __dirname + '/layout.log',
            smartCSR: true,
            warnings: true
        });
        screen_1.title = title;
        var header = blessed.box({
            parent: screen_1,
            top: 0,
            left: 0,
            width: '100%',
            height: 3,
            align: 'center',
            tags: true,
            content: '{bold}{red-fg}Ultimate TTT Algorithm Battle v' + pjson.version + '{/red-fg}{/bold}'
        });
        header.insertBottom('{yellow-fg}Local address:{/yellow-fg}   http://' + host + ':' + port);
        header.insertBottom('{yellow-fg}Network address:{/yellow-fg} http://' + ip.address() + ':' + port);
        screen_1.key(['escape', 'q', 'C-c'], function () {
            return process.exit(0);
        });
        serverInfo.ui.screen = screen_1;
        serverInfo.ui.onlineUsers = blessed.box({
            parent: screen_1,
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
        serverInfo.ui.gameArea = blessed.box({
            parent: screen_1,
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
        serverInfo.ui.logger = blessed.log({
            parent: screen_1,
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
    else {
        log(title);
        log('Listening on ' + host + ':' + port);
    }
    log('Server started', true);
    function handler(req, res) {
        fs.readFile(__dirname + '/../../public/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
    }
    io.set('authorization', function (data, accept) {
        var isClient = data._query.client || false;
        if (isClient) {
            return accept(null, true);
        }
        var token = data._query.token;
        if (!token) {
            return accept('Missing token', false);
        }
        data.testToken = token;
        accept(null, true);
    });
    io.on('connection', function (socket) {
        if (socket.handshake.query.client) {
            socket.emit('stats', {
                type: 'stats',
                payload: {
                    players: serverInfo.players,
                    games: []
                }
            });
            return true;
        }
        var playerIndex = addPlayer(socket.handshake.query.token);
        if (!serverInfo.games[serverInfo.nextGame]) {
            serverInfo.games[serverInfo.nextGame] = {
                players: []
            };
        }
        else if (serverInfo.games[serverInfo.nextGame].players.length >= 2) {
            serverInfo.nextGame++;
            serverInfo.games[serverInfo.nextGame] = {
                players: []
            };
        }
        var session = serverInfo.games[serverInfo.nextGame];
        var player = session.players.length;
        session.players[player] = {
            playerIndex: playerIndex,
            socket: socket
        };
        if (session.players.length >= 2) {
            startSession(session, options);
            serverInfo.nextGame++;
        }
        socket.emit('game', {
            action: 'waiting'
        });
    });
    serverInfo.ui.render();
}
function log(text, skipRender) {
    var time = (new Date()).toTimeString().substr(0, 5);
    if (serverInfo.ui.enabled) {
        serverInfo.ui.logger.log('{blue-fg}[' + time + ']{/blue-fg} ' + text);
        if (!skipRender) {
            serverInfo.ui.render();
        }
    }
    else {
        console.log(time, text);
    }
}
function addPlayer(player) {
    var index = -1;
    if (serverInfo.players.indexOf(player) < 0) {
        index = serverInfo.players.push(player) - 1;
    }
    log('Connected "' + player + '"', true);
    serverInfo.io.emit('stats', {
        type: 'connect',
        payload: player
    });
    renderOnlinePlayers();
    return index;
}
function removePlayer(player) {
    var index = serverInfo.players.indexOf(player);
    if (index > -1) {
        serverInfo.players.splice(index, 1);
    }
    log('Disconnected "' + player + '"', true);
    serverInfo.io.emit('stats', {
        type: 'disconnect',
        payload: player
    });
    renderOnlinePlayers();
}
function renderOnlinePlayers() {
    if (serverInfo.ui.enabled) {
        serverInfo.ui.onlineUsers.content = '{bold}Online players{/bold}';
        serverInfo.ui.onlineUsers.render();
        serverInfo.players.forEach(function (player) {
            serverInfo.ui.onlineUsers.insertBottom(' ' + player);
        });
        serverInfo.ui.render();
    }
}
function startSession(session, settings) {
    var options = settings || {};
    log('Starting games between "' +
        serverInfo.players[session.players[0].playerIndex] +
        '" and "' +
        serverInfo.players[session.players[1].playerIndex] +
        '"');
    serverInfo.io.emit('stats', {
        type: 'session-start',
        payload: {
            players: [
                serverInfo.players[session.players[0].playerIndex],
                serverInfo.players[session.players[1].playerIndex]
            ]
        }
    });
    var server = {
        timeout: options.timeout || 100,
        maxGames: options.games || 1000,
        state: new state_1["default"](),
        session: session,
        currentPlayer: 0,
        firstPlayer: 0,
        game: new ultimate_ttt_1["default"](),
        gameStart: null,
        progressBar: null
    };
    if (serverInfo.ui.enabled) {
        server.ui = getGameBox();
        server.ui.append(blessed.text({
            top: 0,
            left: 0,
            style: {
                bg: 'black'
            },
            tags: true,
            content: '{red-fg}"' +
                serverInfo.players[session.players[0].playerIndex] +
                '"{/red-fg} vs {red-fg}"' +
                serverInfo.players[session.players[1].playerIndex] +
                '"{/red-fg}'
        }));
        server.progressBar = getProgressBar();
        server.ui.append(server.progressBar);
        server.ui.render();
        serverInfo.ui.gameArea.render();
        serverInfo.ui.render();
    }
    session.players[0].socket.on('disconnect', function () {
        removePlayer(serverInfo.players[session.players[0].playerIndex]);
        handleGameEnd(1, true);
    });
    session.players[1].socket.on('disconnect', function () {
        removePlayer(serverInfo.players[session.players[1].playerIndex]);
        handleGameEnd(0, true);
    });
    session.players[0].socket.on('game', handlePlayerMove(0));
    session.players[1].socket.on('game', handlePlayerMove(1));
    playGame();
    function handleGameEnd(winner, playerDisconnected) {
        var hrend = process.hrtime(server.gameStart);
        server.state.times.push(funcs.convertExecTime(hrend[1]));
        if (winner > -1) {
            server.state.wins[winner]++;
            server.firstPlayer = winner;
        }
        else {
            server.firstPlayer = 1 - server.firstPlayer;
            server.state.ties++;
        }
        if (serverInfo.ui.enabled) {
            var progress = Math.floor(server.state.games * 100 / server.maxGames);
            server.progressBar.setProgress(progress);
            serverInfo.ui.render();
        }
        if (!playerDisconnected && server.state.games < server.maxGames) {
            playGame(server.session, server.firstPlayer);
        }
        else {
            sessionEnd();
        }
    }
    function sessionEnd() {
        var players = [
            serverInfo.players[session.players[0].playerIndex],
            serverInfo.players[session.players[1].playerIndex],
        ];
        log('Finished games between "' +
            players[0] +
            '" and "' +
            players[1] +
            '"');
        var stats = funcs.getStats(server.state);
        if (stats.winner === -1) {
            sendAction(server.session, 'end tie', 0);
            sendAction(server.session, 'end tie', 1);
        }
        else if (stats.winner === 0) {
            sendAction(server.session, 'end win', 0);
            sendAction(server.session, 'end lose', 1);
        }
        else {
            sendAction(server.session, 'end lose', 0);
            sendAction(server.session, 'end win', 1);
        }
        serverInfo.io.emit('stats', {
            type: 'session-end',
            payload: {
                players: [
                    serverInfo.players[session.players[0].playerIndex],
                    serverInfo.players[session.players[1].playerIndex]
                ],
                stats: stats
            }
        });
        var winner = '-';
        if (stats.winner > -1) {
            winner = players[stats.winner];
        }
        if (serverInfo.ui.enabled) {
            server.progressBar.destroy();
            server.ui.append(blessed.text({
                top: 1,
                left: 0,
                style: {
                    bg: 'black'
                },
                tags: true,
                content: '{blue-fg}Winner:{/blue-fg} ' + winner +
                    '. {blue-fg}Wins:{/blue-fg} {yellow-fg}Player "' + players[0] + '"{/yellow-fg} ' + server.state.wins[0] + ' (' + stats.winPercentages[0] + ') - ' +
                    '{yellow-fg}Player "' + players[1] + '"{/yellow-fg} ' + server.state.wins[1] + ' (' + stats.winPercentages[1] + ') - ' +
                    '{blue-fg}Ties{/blue-fg} ' + server.state.ties + ' (' + stats.tiePercentage + ')'
            }));
            server.ui.append(blessed.text({
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
            serverInfo.ui.render();
        }
        else {
            log('Session ended between ' + players[0] + ' and ' + players[1] + '. Winner ' + winner);
        }
    }
    function playGame() {
        server.gameStart = process.hrtime();
        server.state.games++;
        server.game = new ultimate_ttt_1["default"]();
        server.currentPlayer = server.firstPlayer;
        server.game.init();
        serverInfo.io.emit('stats', {
            type: 'game-start',
            payload: {
                players: [
                    serverInfo.players[server.session.players[0].playerIndex],
                    serverInfo.players[server.session.players[1].playerIndex]
                ]
            }
        });
        sendAction(server.session, 'init', 0);
        sendAction(server.session, 'init', 1);
        sendAction(server.session, 'move', server.firstPlayer);
    }
    function handlePlayerMove(player) {
        return function (data) {
            if (server.currentPlayer !== player) {
                log('Game ' + server.state.games + ': Player ' + player + ' played out of time (it was ' + server.currentPlayer + ' turn)');
                handleGameEnd(server.currentPlayer);
                return;
            }
            if (data === 'fail') {
                handleGameEnd(1 - server.currentPlayer);
                return;
            }
            try {
                var coords = parseMove(data);
                server.game.move(coords.board, server.currentPlayer + 1, coords.move);
                if (server.game.isFinished()) {
                    handleGameEnd(server.game.winner - 1);
                    return;
                }
                server.currentPlayer = 1 - server.currentPlayer;
                sendAction(session, 'opponent ' + writeMove(coords), server.currentPlayer);
            }
            catch (e) {
                log('Game ' + server.state.games + ': Player ' + server.currentPlayer + ' errored: ' + e.message);
                handleGameEnd(1 - server.currentPlayer);
            }
        };
    }
}
function getGameBox() {
    var height = 3;
    return blessed.box({
        parent: serverInfo.ui.gameArea,
        top: 2 + (serverInfo.games.length - 1) * height,
        left: 0,
        width: '100%-2',
        height: height,
        tags: true,
        style: {
            bg: 'black'
        }
    });
}
function getProgressBar() {
    return blessed.progressbar({
        top: 2,
        left: 0,
        orientation: 'horizontal',
        keys: false,
        mouse: false,
        filled: 0,
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
}
function sendAction(session, action, player) {
    if (session.players[player]) {
        session.players[player].socket.emit('game', {
            action: action
        });
    }
}
function parseMove(data) {
    var parts = data.trim().split(';');
    return {
        board: parts[0].split(',').map(function (coord) { return parseInt(coord, 10); }),
        move: parts[1].split(',').map(function (coord) { return parseInt(coord, 10); })
    };
}
function writeMove(coords) {
    return coords.board[0] + ',' + coords.board[1] + ';' +
        coords.move[0] + ',' + coords.move[1];
}
//# sourceMappingURL=online.js.map