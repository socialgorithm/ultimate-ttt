# Ultimate Tic-Tac-Toe - Server

[![Travis](https://img.shields.io/travis/socialgorithm/ultimate-ttt.svg)](https://travis-ci.org/socialgorithm/ultimate-ttt)

An Ultimate Tic-Tac-Toe game server wrapping [a game engine](../engine/README.md), used by the Socialgorithm Tournament server to run games. See more info at https://socialgorithm.org/docs.

## Build

If running from source, you must build this package at the root of the monorepo:

```
ultimate-ttt # <-- RUN THE NEXT COMMAND HERE
  - packages
    - engine
    - server # <-- The readme is here

```
npm run build
```

## Run

Start the server locally by running

```
npm run start:dev
```

### Deploy

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/socialgorithm/ultimate-ttt/tree/master)
