import { expect } from 'chai';
import * as io from 'socket.io-client';

describe('Server', () => {

    var server,
        socketOptions ={
            transports: ['websocket'],
            'force new connection': true
        };

    beforeEach(() => {
        server = require('../src/lib/OnlineServer')
    })

    it('lets a player create a lobby', () => {
        var client = io.connect('http://localhost:3141', socketOptions);

        client.once('connect', () => {
            client.once('lobby created', (data) => {
                expect(data.to.equal('1234'))
            });
            client.emit('lobby create')
        })
    })
})