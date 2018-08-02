import { IMove } from "../tournament/match/game/GameStats";

export default interface TournamentEvents {
    sendStats: () => void;
    onGameInit: () => void;
    onGameMove: (move: IMove) => void;
}