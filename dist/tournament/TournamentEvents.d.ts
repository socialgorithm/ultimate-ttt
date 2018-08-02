import { IMove } from "../tournament/match/game/GameStats";
export default interface ITournamentEvents {
    sendStats: () => void;
    onGameInit: () => void;
    onGameMove: (move: IMove) => void;
}
