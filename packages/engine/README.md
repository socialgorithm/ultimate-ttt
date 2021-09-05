# Ultimate Tic Tac Toe - Game Engine
> Ultimate Tic Tac Toe implementation for algorithmic battles & hackathons :)

[![Travis](https://img.shields.io/travis/socialgorithm/ultimate-ttt-js.svg)](https://travis-ci.org/socialgorithm/ultimate-ttt-js)
[![npm](https://img.shields.io/npm/v/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)
[![Coverage Status](https://coveralls.io/repos/github/socialgorithm/ultimate-ttt-js/badge.svg?branch=master)](https://coveralls.io/github/socialgorithm/ultimate-ttt-js?branch=master)
[![npm](https://img.shields.io/npm/dm/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)
[![npm](https://img.shields.io/npm/l/ultimate-ttt.svg)](https://www.npmjs.com/package/ultimate-ttt)

This is a JavaScript implementation of the [Ultimate Tic Tac Toe](https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/) game.

What this package provides is a class that holds all game state and performs all required logic, exposing a simple API.

Example state at a given point:

```js
import UTTT from '@socialgorithm/ultimate-ttt';

const game = new UTTT();

// ... perform some moves ...

console.log(game.prettyPrint());

/*

Outputs the following:

1 - - | - - - | - - -
0 - - | - - - | - - -
1 - - | 1 - - | - - -
------+-------+-------
1 - - | - - - | - - -
- - - | - - - | - - -
- - - | - - - | - - -
------+-------+-------
- 1 - | - - - | - - -
- - - | - - - | - - -
- - - | - - - | - - -
------+-------+-------
*/
```

## Getting started

Install from npm:

```bash
$ npm install --save @socialgorithm/ultimate-ttt
```

Import and use:

```js
import UTTT from '@socialgorithm/ultimate-ttt';
const game = new UTTT();
```

## [API Documentation](https://socialgorithm.org/ultimate-ttt-js/)

## Projects using this

* [**ultimate-ttt-player-js**](https://github.com/socialgorithm/ultimate-ttt-player-js) UTTT Algorithm that plays at random, provided as a base for your own algorithms!
* [**ultimate-ttt/server**](../server/README.md): Game server that uses this package as a game engine to pitch two playing algorithms against each other.