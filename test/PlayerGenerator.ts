import { instance, mock } from "ts-mockito";
import Channel from "../src/tournament/model/Channel";
import Player from "../src/tournament/model/Player";

export default class PlayerGenerator {

    public static generateArrayOf(num: number): Player[] {
        const players = [];
        for (let i = 0; i < num; i++) {
            players.push(new Player("P" + i, this.channelStub));
        }
        return players;
    }

    private static channelStub = instance(mock(Channel));

}
