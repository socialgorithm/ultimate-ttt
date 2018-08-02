import * as randomWord from "random-word";

import { Tournament } from "tournament/Tournament";

import Player from "./Player";

export class Lobby {
    public admin: Player;
    public token: string;
    public players: Player[];
    public tournament: Tournament;
    public bannedPlayers: string[];

    constructor(admin: Player) {
        this.admin = admin;
        this.players = [];
        this.bannedPlayers = [];
        this.token = `${randomWord()}-${randomWord()}`;
    }

    public toObject() {
        return {
            players: this.players.map(player => ({
                token: player.token,
            })),
            token: this.token,
            tournament: this.tournament ? this.tournament.getStats() : null,
        };
    }
}
