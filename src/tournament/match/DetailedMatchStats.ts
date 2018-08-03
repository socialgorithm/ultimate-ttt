import { IGameStats } from "../../tournament/match/game/GameStats";

export default class DetailedMatchStats {
    games: IGameStats[];

    constructor(public uuid: string) {}
}