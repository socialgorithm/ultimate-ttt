import { IMove } from "../tournament/match/game/GameStats";

export default interface ITournamentEvents {
    sendStats: () => void;
    onMatchEnd: () => void;
}
