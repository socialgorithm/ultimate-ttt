import { IGameStats } from "../../tournament/match/game/GameStats";

export default class DetailedMatchStats {
    public games: IGameStats[];

    constructor(public uuid: string) {
        this.games = [];
    }
}