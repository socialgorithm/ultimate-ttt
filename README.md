# Ultimate TTT - Server
> Ultimate Tic Tac Toe Algorithm - Game Server

[![Travis](https://img.shields.io/travis/aurbano/ultimate-ttt-server.svg)](https://travis-ci.org/aurbano/ultimate-ttt-server)
[![npm](https://img.shields.io/npm/v/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)
[![Coverage Status](https://coveralls.io/repos/github/aurbano/ultimate-ttt-server/badge.svg?branch=master)](https://coveralls.io/github/aurbano/ultimate-ttt-server?branch=master)
[![npm](https://img.shields.io/npm/l/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)

This is a system intended for games & hackathons mainly, for teams to write their own bot and compete against other bots.

They will be playing games of ["Ultimate Tic Tac Toe"](https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/), which provides a great opportunity for learning, predicting moves...

### Online mode

By default, the server will start in online mode and listen for players on port `3141`.
The server starts up a terminal GUI displaying the current online players and game stats. Players are paired automatically as soon as there are two available players.

By default the server will have players play 1000 games per session.

You can launch the server using:

```bash
$ uttt
```

[![Online demo](https://github.com/aurbano/ultimate-ttt-server/raw/master/demos/online.gif "Online demo")](https://asciinema.org/a/105087)

Options:

```
uttt

  Ultimate Tic Tac Toe - Game Server

Options

  --verbose           The input to process.
  -v, --version       Display the server version
  -p, --port 3141     Port on which the server should be started (defaults to 3141)
  -l, --local         Play games locally executing the players code directly (not recommended)
  -a, --a file        Client 1 for the algorithm competition (for local games only)
  -b, --b file        Client 2 for the algorithm competition (for local games only)
  -g, --games 1000    Number of games to play, defaults to 1000
  -t, --timeout 100   Milliseconds after which a player loses (defaults to 100)
  -h, --help          Print this guide

Synopsis

  $ uttt
  $ uttt --games 100
  $ uttt --port 5000
  $ uttt --local -a path/to/programOne -b path/to/programTwo
  $ uttt --help
```

### Local mode

The game server can run games locally, if the players have been written in JavaScript and are reachable from the server.

```bash
$ uttt --local -a path/to/programOne -b path/to/programTwo
```

To run a quick test you can use the sample implementation provided:

```bash
$ uttt --local -a sample/random -b sample/random
```

Sample output:

```
+----------------------------------+
|   Ultimate TTT Algorithm Fight   |
+----------------------------------+

Games played: 1000
Winner: 1

Player 1 wins: 495 (49.5%)
Player 2 wins: 448 (44.8%)
Ties: 57 (5.7%)

Player 1 timeouts: 0
Player 2 timeouts: 0

Total time: 154.96ms
Avg game: 0.15ms
Max game: 5.21ms
Min game: 0.04ms
```

The server uses the [`ultimate-ttt`](https://github.com/aurbano/ultimate-ttt) Nodejs implementation of the game to validate and verify game states.

If you're developing a client in JavaScript you can also use that package to maintain your local state easily.

## Writing a client

For local executions only JS clients are supported. They must be a constructor class that returns an object with at least the following methods:

* `constructor(player, size = 3)` - Initialize the client, player will be either 1 or 2.
* `addOponentMove(board, move)` - Add an opponent move (to maintain this client in sync)
* `addMove(board, move)` - Add a player move (to maintain this client in sync)
* `getMove()` - Return a move proposal to send to the game engine. It must be in the form `{board: [row, col], move: [row, col]}`

You can check the [sample implementation](https://github.com/aurbano/ultimate-ttt-server/blob/master/sample/random.js) provided, that plays at random.

## Roadmap

* <del>Execute X number of games and display stats</del>
* <del>Setup a server so clients can play over a socket</del>
* Setup a DB so players can use a token to identify
* Create a web frontend to see stats and manage the competition

## Testing a client

This repository includes a test file that can be run against a custom client to verify that it does the basics right.
Simply copy [`tests/client.test.js`](https://github.com/aurbano/ultimate-ttt-server/blob/master/tests/client.test.js) and point it to your implementation. The tests can be run by installing `ava` and then adding it as the test runner in your `package.json` file.