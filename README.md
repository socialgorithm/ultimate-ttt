# Ultimate TTT - Server
> Ultimate Tic Tac Toe Algorithm - Game Server

[![Travis](https://img.shields.io/travis/socialgorithm/ultimate-ttt-server.svg)](https://travis-ci.org/socialgorithm/ultimate-ttt-server)
[![npm](https://img.shields.io/npm/v/@socialgorithm/uttt.svg)](https://www.npmjs.com/package/@socialgorithm/uttt )
[![Coverage Status](https://coveralls.io/repos/github/socialgorithm/ultimate-ttt-server/badge.svg?branch=master)](https://coveralls.io/github/socialgorithm/ultimate-ttt-server?branch=master)
[![npm](https://img.shields.io/npm/l/@socialgorithm/uttt.svg)](https://www.npmjs.com/package/@socialgorithm/uttt )

This is a system intended for games & hackathons mainly, for teams to write their own bot and compete against other bots.

They will be playing games of ["Ultimate Tic Tac Toe"](https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/), which provides a great opportunity for learning, predicting moves...

## Getting started

### Deploy online

You can directly deploy the server to Heroku for a quick start:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/socialgorithm/ultimate-ttt-server/tree/master)

When deploying, choose any available App Name (or let Heroku decide for you), and click on Deploy. Once it's finished browse to `https://{app-name}.herokuapp.com` and you should see the server welcome message.

If you open our [web client](https://uttt.socialgorithm.org), you can then connect it to the server by clicking on "Connect" and entering `https://{app-name}.herokuapp.com` as the server host.

### Install locally
 
```bash
 $ npm install -g @socialgorithm/uttt
```

### Run in online mode

By default, the server will start in online mode and listen for players on port `3141`.
The server starts up a terminal GUI displaying the current online players and game stats. Players are paired automatically as soon as there are two available players.

By default the server will have players play 1000 games per session.

You can launch the server using:

```bash
$ uttt --gui
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
  -u, --gui           Display a fancy GUI in the terminal (only available in online mode)
  -g, --games 1000    Number of games to play, defaults to 1000
  -t, --timeout 100   Milliseconds after which a player loses (defaults to 100)
  -h, --help          Print this guide

Synopsis

  $ uttt --gui
  $ uttt --games 100
  $ uttt --port 5000
  $ uttt --help
```

When running in online mode you can also use env variables to override the settings (which is very useful when deploying to a server for example)

- `PORT` overrides the port
- `TTT_TIMEOUT` overrides the timeout
- `TTT_GAMES` overrides the number of games that are played per round


The server uses the [`ultimate-ttt`](https://github.com/aurbano/ultimate-ttt) Nodejs implementation of the game to validate and verify game states.

If you're developing a client in JavaScript you can also use that package to maintain your local state easily.

## [Developer Docs](https://socialgorithm.org/ultimate-ttt-server/)

## Roadmap

* <del>Execute X number of games and display stats</del>
* <del>Setup a server so clients can play over a socket</del>
* Setup a DB so players can use a token to identify
* <del>Create a web frontend to see stats and manage the competition</del> ([ultimate-ttt-web](https://github.com/socialgorithm/ultimate-ttt-web))

## Testing a client

This repository includes a test file that can be run against a custom client to verify that it does the basics right.
Simply copy [`tests/client.test.js`](https://github.com/aurbano/ultimate-ttt-server/blob/master/tests/client.test.js) and point it to your implementation. The tests can be run by installing `ava` and then adding it as the test runner in your `package.json` file.
