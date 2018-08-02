import { Tournament } from 'tournament/Tournament';
import Player from './Player';
export declare class Lobby {
    admin: Player;
    token: string;
    players: Array<Player>;
    tournament: Tournament;
    bannedPlayers: Array<string>;
    constructor(admin: Player);
    toObject(): {
        token: string;
        players: {
            token: string;
        }[];
        tournament: {
            options: import("tournament/Tournament").TournamentOptions;
            started: boolean;
            finished: boolean;
            matches: {
                uuid: string;
                stats: import("tournament/model/State").default;
                players: {
                    token: string;
                }[];
            }[];
            ranking: string[];
            waiting: boolean;
        };
    };
}
