# Ultimate Tic-Tac-Toe

An Ultimate Tic-Tac-Toe game engine and accompanying server that can run games compatible with a [Socialgorithm Tournament Server](https://www.npmjs.com/package/@socialgorithm/tournament-server) and [UI](https://tournaments.socialgorithm.org/).

Usage Guides:
* [Game Engine](packages/engine/README.md)
* [Server](packages/server/README.md)

## Developer Guide

### Add dependencies

Add a dependency using lerna

```
npx lerna add <package> --scope=<package>
```

e.g. 

```
npx lerna add @socialgorithm/game-server --scope=@socialgorithm/ultimate-ttt-server
```

### Install dependencies

```
npm run bootstrap
```

### Build and Test

```
npm run build
npm run test
```

### Publishing NPM package

```
npm run publish
```

This will publish to the latest tag in NPM.

You can also publish a prerelease tag to test changes:

```
npm run publish:prerelease
```
