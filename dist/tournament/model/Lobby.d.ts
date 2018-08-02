import { Tournament } from "tournament/Tournament";
import Player from "./Player";
export declare class Lobby {
    admin: Player;
    token: string;
    players: Player[];
    tournament: Tournament;
    bannedPlayers: string[];
    constructor(admin: Player);
    toObject(): {
        players: {
            token: string;
        }[];
        token: string;
        tournament: {
            finished: boolean;
            matches: {
                players: {
                    token: string;
                }[];
                stats: import("tournament/model/State").default;
                uuid: string;
            }[];
            options: import("tournament/Tournament").ITournamentOptions;
            ranking: string[];
            started: boolean;
            waiting: boolean;
        };
    };
}
