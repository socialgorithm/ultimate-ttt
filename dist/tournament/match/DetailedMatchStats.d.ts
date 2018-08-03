import { IGameStats } from "../../tournament/match/game/GameStats";
export default class DetailedMatchStats {
    uuid: string;
    games: IGameStats[];
    constructor(uuid: string);
}
