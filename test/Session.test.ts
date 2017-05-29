import { expect } from 'chai';
import Session from '../src/lib/Session';
import { Player } from '../src/lib/Player';

describe('Session', () => {

    let subject: Session;
    let player0: Player;
    let player1: Player;

    beforeEach(() => {
        player0 = {
            token: 'player0',
            session: undefined,
            socket: undefined,
            getIndexInSession: () => 0,
            deliverAction: (action: string) => undefined,
            otherPlayerInSession: () => undefined,
            alive: () => true 
        };

        player1 = {
            token: 'player1',
            session: undefined,
            socket: undefined,
            getIndexInSession: () => 1,
            deliverAction: (action: string) => undefined,
            otherPlayerInSession: () => player0,
            alive: () => true
        };

        player0.otherPlayerInSession = () => player1;
        subject = new Session([player0, player1]);
        player0.session = subject;
        player1.session = subject;
    });

    describe('#playerTokens()', () => {
        
        it('will yield the expected value', () => {
            expect(subject.playerTokens()).to.deep.equal([player0.token, player1.token]);
        });
        
    });

});