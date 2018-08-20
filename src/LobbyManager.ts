import Lobby  from './tournament/model/Lobby';
import * as PubSub from 'pubsub-js';
import Player from './tournament/model/Player';

export default class LobbyManager {

    lobbies: Map<String, Lobby> = new Map<String, Lobby>();;

    constructor() {
        PubSub.subscribe('lobby create', this.createLobby);
        PubSub.subscribe('lobby tournament start', this.startTournament);
        PubSub.subscribe('lobby join', this.joinLobby);
        PubSub.subscribe('lobby player kick', this.kickPlayer);
        PubSub.subscribe('lobby player ban', this.banPlayer);
    }

    private createLobby(msg: any, data: any): void {
        const lobby: Lobby = new Lobby(data);
        this.lobbies.set(lobby.token, lobby);
        PubSub.publish('lobby created', lobby);
    }

    private startTournament(msg: any, data: any): void {
        const lobby: Lobby = this.getLobbyFrom(data);
        if (lobby) {
            PubSub.publish('tournament start', lobby.players.values);
        }
    }

    private joinLobby(msg: any, data: any): void{
        const lobby: Lobby = this.getLobbyFrom(data);
        if (lobby) {
            const player: Player = new Player(data.playerId);
            lobby.addPlayer(player); 
            PubSub.publish('lobby joined', lobby);
        }
    }

    private kickPlayer(msg: any, data: any)  {
        const lobby = this.getLobbyFrom(data);
        if (lobby) {
            lobby.removePlayer(data.playerId);
            PubSub.publish('player kicked', lobby);
        }
    }

    private banPlayer(msg: any, data: any) {
        const lobby = this.getLobbyFrom(data);
        if (lobby) {
            lobby.banPlayer(data.playerId);
            PubSub.publish('player banned', lobby);
        }
    }

    private getLobbyFrom(data: any): Lobby {
        return this.lobbies.get(data.lobbyId);
    }
}