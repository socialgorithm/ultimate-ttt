import UTTT from '@socialgorithm/ultimate-ttt/dist/UTTT';
import {Coords, PlayerNumber, PlayerOrTie, RESULT_TIE} from "@socialgorithm/ultimate-ttt/dist/model/constants";

import State from "./State";
import {Options} from "../../lib/cli-options";
import GUI from "../../server/GUI";
import * as funcs from '../../lib/funcs';
import SocketServer from '../../server/SocketServer';
import Player from './Player';
import Session from './Session';
import { Tournament } from '../Tournament';
import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';

/*
 * A set of games between two players
 */
export default class Match {
    private games: Game[];
    private state: State;
    private game: UTTT;
    private gameStart: [number, number];
    private gameIDForUI: number;
    private active: boolean;

    constructor(private players: Player[], private options: MatchOptions) {
        this.games = [];
        for(let i = 0; i < options.maxGames; i++) {
            this.games[i] = new Game(
                {timeout: options.timeout},
                {onGameStart: () => {}}
            )
        }
    }

    /**
     * Play all the games in this match
     */
    public playGames() {
        this.games.forEach((game) => {
            game.playGame()
        });
    }
}