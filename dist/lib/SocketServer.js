"use strict";
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var fs = require("fs");
var Player_1 = require("./Player");
var SocketServer = (function () {
    function SocketServer(port, socketEvents) {
        var _this = this;
        var app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(port);
        this.socketEvents = socketEvents;
        this.io.use(function (socket, next) {
            var isClient = socket.request._query.client || false;
            if (isClient) {
                return next();
            }
            var token = socket.request._query.token;
            if (!token) {
                return next(new Error('Missing token'));
            }
            socket.request.testToken = token;
            next();
        });
        this.io.on('connection', function (socket) {
            if (socket.handshake.query.client) {
                _this.socketEvents.updateStats();
                return true;
            }
            var player = new Player_1["default"](socket.handshake.query.token, socket);
            socket.on('disconnect', function () {
                _this.socketEvents.onPlayerDisconnect(player);
            });
            _this.socketEvents.onPlayerConnect(player);
        });
    }
    SocketServer.prototype.emit = function (type, data) {
        this.io.emit(type, data);
    };
    SocketServer.prototype.emitPayload = function (emitType, type, payload) {
        this.emit(emitType, { type: type, payload: payload });
    };
    SocketServer.prototype.handler = function (req, res) {
        fs.readFile(__dirname + '/../../public/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
    };
    return SocketServer;
}());
exports["default"] = SocketServer;
//# sourceMappingURL=SocketServer.js.map