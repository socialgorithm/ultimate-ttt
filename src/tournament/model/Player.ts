import Session from './Session';
import Game from '../match/game/Game';
import Server from '../../server/Server';
import { Tournament } from '../Tournament';
import {PlayerNumber} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import Channel from './Channel';

export default class Player {

    constructor(public token: string, public channel: Channel) { }

    alive(): boolean {
        return this.channel.isConnected();
    }

}