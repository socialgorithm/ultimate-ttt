import PubSub from 'pubsub-js';
import Player from './tournament/model/Player';
import { Tournament, ITournamentOptions } from './tournament/Tournament';

export default class TournamentManager {

    private tournamentDefaults: ITournamentOptions = {
        numberOfGames: 30,
        type: 'DoubleElimination',
        timeout: 100,
        autoPlay: true,
    }

    constructor() {
        PubSub.subscribe('tournament start', this.startTournament);
    }

    private startTournament(msg: any, data: any) {
        const players = data.players;
        const tournament = this.createTournament(players);
        tournament.start();
        PubSub.publish('tournament started', tournament);
    }

    private createTournament(players: Player[]) {
        return new Tournament(this.tournamentDefaults, null, players, null);
    }
}