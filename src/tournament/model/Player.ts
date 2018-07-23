import Channel from './Channel';

export default class Player {

    constructor(public token: string, public channel: Channel) { }

    alive(): boolean {
        return this.channel.isConnected();
    }

}