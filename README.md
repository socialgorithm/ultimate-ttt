# Ultimate TTT - Server
> Ultimate Tic Tac Toe Algorithm - Game Server

This is a system intended for games & hackathons mainly, for teams to write their own bot and compete against other bots.

They will be playing games of ["Ultimate Tic Tac Toe"](https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/), which provides a great opportunity for learning, predicting moves...

For now only local "battles" can be performed, using the cli version:

```bash
$ uttt -a path/to/programOne -b path/to/programTwo
```

To run a quick test you can use the sample implementation provided:

```bash
$ uttt -a sample/random -b sample/random
```

Sample output:

```
Starting game!
Game Finished!
Winner: Player 1
Moves: 69

1 2 1 | 1 2 2 | 1 1 2
2 2 2 | 2 1 2 | 2 2 0
2 1 2 | 0 1 2 | 1 1 1
------+-------+-------
1 1 0 | 2 2 1 | 2 1 1
1 1 2 | 1 2 1 | 0 1 1
0 2 2 | 2 1 1 | 2 2 0
------+-------+-------
1 1 0 | 2 1 2 | 0 1 2
0 1 0 | 2 2 1 | 1 2 2
0 0 1 | 2 2 1 | 2 1 1
------+-------+-------
```

The server uses the [`ultimate-ttt`](https://github.com/aurbano/ultimate-ttt) Nodejs implementation of the game to validate and verify game states.

If you're developing a client in JavaScript you can also use that package to maintain your local state easily.

## Writing a client

For local executions only JS clients can work. They must be a constructor class that returns an object with at least the following methods:

* `constructor(player, size = 3)` - Initialize the client, player will be either 1 or 2.
* `addOponentMove(board, move)` - Add an opponent move (to maintain this client in sync)
* `addMove(board, move)` - Add a player move (to maintain this client in sync)
* `getMove()` - Return a move proposal to send to the game engine. It must be in the form `{board: [row, col], move: [row, col]}`

## Roadmap

* Execute X number of games and display stats
* Setup a server so clients can play over a socket
* Setup a DB so players can use a token to identify
* Create a web frontend to see stats and manage the competition