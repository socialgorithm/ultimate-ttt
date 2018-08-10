import Channel from "./Channel";

export default class Player {

    constructor(public token: string) { }

    public alive(): boolean {
        return this.channel.isConnected();
    }

}
