import * as randomWord from "random-word";

import { Tournament } from "../../tournament/Tournament";

import Player from "./Player";

export class Lobby {
    public admin: Player;
    public token: string;
    public players: Map<String, Player>
    public tournament: Tournament;
    public bannedPlayers: String[]

    constructor(admin: Player) {
        this.admin = admin;
        this.players = new Map<String, Player>();
        this.bannedPlayers = [];
        this.token = `${randomWord()}-${randomWord()}`;
    }

    public addPlayer(player: Player) {
        if (!this.isBanned(player.token)) {
            this.players.set(player.token, player);
        }
    }

    public removePlayer(playerToken: String) {
        this.players.delete(playerToken);
    }

    public banPlayer(playerToken: String) {
        this.bannedPlayers.push(playerToken);
    }

    //TODO: should just use object instead of map?
    public getPlayers(): Player[] {
        return Array.from(this.players, ([key, value]) => value);
    }

    private isBanned(playerToken: String) {
        return !this.bannedPlayers.includes(playerToken);
    }

    public toObject(): String {
        return {
            players: this.players.values,
            token: this.token,
            tournament: this.tournament ? this.tournament.getStats() : null,
        };
    }
}
