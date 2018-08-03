import DetailedMatchStats from "../tournament/match/DetailedMatchStats";
export default interface ITournamentEvents {
    sendStats: () => void;
    onMatchEnd: (detailedMatchStats: DetailedMatchStats) => void;
}
