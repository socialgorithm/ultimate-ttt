# Ultimate Tic Tac Toe
> Ultimate Tick Tack Toe implementation for algorithmic battles & hackathons :)

[![Travis](https://img.shields.io/travis/aurbano/ultimate-ttt.svg)](https://travis-ci.org/aurbano/ultimate-ttt)
[![npm](https://img.shields.io/npm/v/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)
[![Coverage Status](https://coveralls.io/repos/github/aurbano/ultimate-ttt/badge.svg?branch=master)](https://coveralls.io/github/aurbano/ultimate-ttt?branch=master)
[![npm](https://img.shields.io/npm/dm/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)
[![npm](https://img.shields.io/npm/l/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)

This is a JavaScript implementation of the [Ultimate Tic Tac Toe](https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/) game.

What this package provides is a class that holds all game state and performs all required logic, exposing a simple API.

Example state at a given point:

```js
import UTTT from 'ultimate-ttt';

const game = new UTTT();

// ... perform some moves ...

console.log(game.prettyPrint());

/*

Outputs the following:

1 0 0 | 0 0 0 | 0 0 0
1 0 0 | 0 0 0 | 0 0 0
1 0 0 | 1 0 0 | 0 0 0
------+-------+-------
1 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
------+-------+-------
0 1 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
------+-------+-------
*/
```

## Getting started

Install from npm:

```bash
$ npm install --save ultimate-ttt
```

Import and use:

```js
import UTTT from 'ultimate-ttt';
const game = new UTTT();
```

## Examples

* [**Ultimate-ttt-server**](https://github.com/aurbano/ultimate-ttt-server): Game server that uses this package as a game engine to pitch two playing algorithms agains each other.

## API

### `UTTT([size])`

Create a new UTTT game object, with an optional setting for the size (which defaults to 3) for the typical 3x3 Tic Tac Toe game.

### `move(board, player, move)`

* **board** `[row, col]` coordinates object to select which board to use. In the first turn any board can be chosen, but on subsequent turns it will be validated.
* **player** Identifier for the current player (can be either `1` or `2`)
* **move** `[row, col]` coordinates for the cell that the player wants to play, in the selected board.

It may throw the following exceptions:

* `Invalid player, it must be either 1 or 2`
* `Invalid move coordinates, they must be an array in the form [x, y]`
* `Position already played`
* `Invalid next board, it must be the same as the last valid move\'s coordinates`
* `Board already finished`
* `Game already finishedd`

### `isFinished()`

Returns true if the game has finished, false otherwise. It is computed on every move.

### `winner`

Attribute that returns the winner number (`1` or `2`), `0` if there is a tie, and `-1 if the game hasn't finished.`

### `isValidBoard(board)`

Validates a board selection, useful before making a move. It's the same check that the `move()` method will use.
Returns `true` or `false`.

### `prettyPrint()`

Returns a nicely formatted `string` with the board.

```
1 0 0 | 0 0 0 | 0 0 0
1 0 0 | 0 0 0 | 0 0 0
1 0 0 | 1 0 0 | 0 0 0
------+-------+-------
1 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
------+-------+-------
0 1 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
------+-------+-------
```