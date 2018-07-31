import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../model/TournamentStats";
import MatchOptions from "../match/MatchOptions";
import * as uuid from 'uuid/v4';

type PlayerStats = {
    player: Player;
    wins: number;
    losses: number;
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
    private waitingToPlay: Player[];

    constructor(private players: Player[], private options: MatchOptions, private sendStats: Function) {
        this.processedMatches = [];
        this.playerStats = {};
        this.players.forEach(player => {
            this.playerStats[player.token] = { player: player, wins: 0, losses: 0 };
        });
        this.waitingToPlay = [];
    }

    isFinished(): boolean {
        return this.finished;
    }

    getRemainingMatches(tournamentStats: TournamentStats): Match[] {
        this.tournamentStats = tournamentStats
        
        let matches: Match[] = [];

        if(tournamentStats.matches.length === 0) {
            return this.matchPlayers(this.players);
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

        console.log(this.playerStats)

        if(justPlayedMatches.length === 1 && this.waitingToPlay.length < 1) {
            this.finished = true;
            return [];
        }

        const zeroLossPlayers = [];
        const oneLossPlayers = [];
        for(const playerToken in this.playerStats) {
            const stats = this.playerStats[playerToken];
            if(stats.losses === 0) {
                zeroLossPlayers.push(stats.player);   
            } else if(stats.losses === 1) {
                oneLossPlayers.push(stats.player);
            }
        }

        if(zeroLossPlayers.length > 1) {
            matches = matches.concat(this.matchPlayers(zeroLossPlayers));
        } else if(zeroLossPlayers.length === 1) {
            console.log(`zero loss last: ${zeroLossPlayers[0].token}`);
            this.waitingToPlay.push(zeroLossPlayers[0]);
        }
        if(oneLossPlayers.length > 1) {
            matches = matches.concat(this.matchPlayers(oneLossPlayers));
        } else if(oneLossPlayers.length === 1) {
            console.log(`one loss last: ${zeroLossPlayers[0].token}`);
            this.waitingToPlay.push(oneLossPlayers[0]);
        }

        if(this.waitingToPlay.length > 1) {
            console.log("Matching waiters")
            matches = matches.concat(this.matchPlayers(this.waitingToPlay));
            this.waitingToPlay = [];
        }
        
        return matches
    }

    private matchPlayers(players: Player[]): Match[] {
        let matches: Match[] = []; 
        let oddPlayerExists: boolean = false;
        let evenLimit: number = players.length

        if(players.length < 2) {
            return matches
        }

        if(players.length % 2 !== 0) {
            oddPlayerExists = true;
            evenLimit = players.length - 1;
        }

        for(let i = 0; i < evenLimit; i+=2) {
            const playerA = players[i];
            const playerB = players[i+1];
            matches.push(new Match([playerA, playerB], this.options, this.sendStats));
        }

        if(oddPlayerExists) {
            const oddPlayer = players[evenLimit + 1]
            const randomlyPickedPlayer = players[Math.floor(Math.random() * evenLimit)]
            matches.push(new Match([oddPlayer, randomlyPickedPlayer], this.options, this.sendStats));
        }

        return matches
    } 

    getRanking(): string[] {
        return this.players
            .sort((a: Player, b: Player) => this.playerStats[b.token].wins - this.playerStats[a.token].wins)
            .map(player => player.token);
    }
}