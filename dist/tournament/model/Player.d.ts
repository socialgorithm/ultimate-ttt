import Channel from "./Channel";
export default class Player {
    token: string;
    channel: Channel;
    constructor(token: string, channel: Channel);
    alive(): boolean;
}
