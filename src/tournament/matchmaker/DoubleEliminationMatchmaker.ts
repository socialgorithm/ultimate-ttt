import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../model/TournamentStats";
import MatchOptions from "../match/MatchOptions";
import { match } from "../../../node_modules/@types/minimatch";

type PlayerStats = {
    player: Player;
    wins: number;
    losses: number;
}

type MatchingResult = {
    matches?: Match[];
    oddPlayer?: Player;
}

/**
 * DoubleElimination is a strategy where each player plays atleast two games before
 * being eliminated.
 * 
 */
export default class DoubleEliminationMatchmaker implements Matchmaker {
    private finished: boolean;
    private tournamentStats: TournamentStats;
    private processedMatches: string[];
    private playerStats: { [key: string]: PlayerStats }
    private zeroLossOddPlayer: Player;
    private oneLossOddPlayer: Player;
    private waitingForFinal: Player[];

    constructor(private players: Player[], private options: MatchOptions, private sendStats: Function) {
        this.processedMatches = [];
        this.playerStats = {};
        this.players.forEach(player => {
            this.playerStats[player.token] = { player: player, wins: 0, losses: 0 };
        });
        this.waitingForFinal = [];
    }

    isFinished(): boolean {
        return this.finished;
    }

    getRemainingMatches(tournamentStats: TournamentStats): Match[] {
        this.tournamentStats = tournamentStats
        
        let matches: Match[];

        if(tournamentStats.matches.length === 0) {
            const matchResult = this.matchPlayers(this.players);
            this.zeroLossOddPlayer = matchResult.oddPlayer;
            return matchResult.matches;
        }

        const justPlayedMatches = this.tournamentStats.matches.filter(match =>
            this.processedMatches.indexOf(match.uuid) === -1
        );

        justPlayedMatches.forEach(match => {
                this.processedMatches.push(match.uuid);
                const winnerToken = match.players[match.stats.winner].token
                const loserToken = match.players[match.stats.winner === 1 ? 0 : 1].token
                this.playerStats[winnerToken].wins++
                this.playerStats[loserToken].losses++
            }
        );

        if(justPlayedMatches.length === 1 && this.waitingForFinal.length < 1) {
            this.finished = true;
            return [];
        }

        const zeroLossPlayers = [];
        const oneLossPlayers = [];
        for(const playerToken in this.playerStats) {
            const stats = this.playerStats[playerToken];
            if(stats.losses === 0 && this.waitingForFinal.indexOf(stats.player) === -1) {
                zeroLossPlayers.push(stats.player);   
            } else if(stats.losses === 1 && this.waitingForFinal.indexOf(stats.player) === -1) {
                oneLossPlayers.push(stats.player);
            }
        }

        if(this.zeroLossOddPlayer != null) {
            zeroLossPlayers.unshift(this.zeroLossOddPlayer);
            delete this.zeroLossOddPlayer;
        }
        if(this.oneLossOddPlayer != null) {
            oneLossPlayers.unshift(this.oneLossOddPlayer);
            delete this.oneLossOddPlayer;
        }

        if(zeroLossPlayers.length > 1) {
            const matchResult = this.matchPlayers(zeroLossPlayers);
            matches.push(...matchResult.matches)
            this.zeroLossOddPlayer = matchResult.oddPlayer
        } else if(zeroLossPlayers.length === 1) {
            this.waitingForFinal.push(zeroLossPlayers[0]);
        }
        if(oneLossPlayers.length > 1) {
            const matchResult = this.matchPlayers(oneLossPlayers);
            matches.push(...matchResult.matches)
            this.oneLossOddPlayer = matchResult.oddPlayer
        } else if(oneLossPlayers.length === 1) {
            this.waitingForFinal.push(oneLossPlayers[0]);
        }

        if(this.waitingForFinal.length > 1) {
            const matchResult = this.matchPlayers(this.waitingForFinal);
            matches.push(...matchResult.matches)
            this.waitingForFinal = [];
        }
        
        return matches
    }

    private matchPlayers(players: Player[]): MatchingResult {
        const matches: Match[] = [];
        let oddPlayer: Player;

        if(players.length < 2) {
            return { }
        }

        if(players.length % 2 !== 0) {
            oddPlayer = players[players.length-1]
            players = players.slice(0, -1);
        }

        for(let i = 0; i < players.length; i+=2) {
            const playerA = players[i];
            const playerB = players[i+1];
            matches.push(new Match([playerA, playerB], this.options, this.sendStats));
        }

        return { matches, oddPlayer }
    } 

    getRanking(): string[] {
        return this.players
            .sort((a: Player, b: Player) => this.playerStats[b.token].wins - this.playerStats[a.token].wins)
            .map(player => player.token);
    }
}