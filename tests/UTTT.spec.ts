import { expect } from 'chai';
import UTTT from '../src/UTTT';
import { ME, OPPONENT, PlayerNumber } from '../src/model/constants';

const playerPairs = [['player 0', ME], ['player 1', OPPONENT]] as [string, PlayerNumber][];
const coordinates = [0,1,2].map(x => [0,1,2].map(y => [x, y] as [number, number])).reduce((a, b) => a.concat(b), []);
const sampleMove = [1, 2] as [number, number];

describe('UTTT', () => {

  let subject: UTTT;

  beforeEach(() => {
    subject = new UTTT();
  })

  describe('#constructor()', () => {

    it('will construct correctly', () => {
        expect(subject).to.be.an('object');
        expect(subject.isFinished).to.be.a('function');
        expect(subject.getResult).to.be.a('function');
        expect(subject.isValidMove).to.be.a('function');
        expect(subject.addMyMove).to.be.a('function');
        expect(subject.addOpponentMove).to.be.a('function');
        expect(subject.prettyPrint).to.be.a('function');
    });

    it('will correctly populate an initial board', () => {
      expect(subject.board).to.be.an('array');
      subject.board.forEach(row => {
        expect(row).to.be.an('array');
        row.forEach(cell => {
          expect(cell.winner).to.be.undefined;
        })
      })
    });

  });

  describe('#move(), #addMyMove(), #addOpponent()', () => {

    playerPairs.forEach(([label, player]) => {

      const opponent = 1 - player as PlayerNumber;

      const testSequence = () => {
        subject = subject.move(player, [1, 0], [0, 0]);
        subject = subject.move(opponent, [0, 0], [2, 1]);
        subject = subject.move(player, [2, 1], [1, 0]);
        subject = subject.move(opponent, [1, 0], [0, 1]);
      };

      it(`will correctly update the board when ${label} moves`, () => {
        testSequence();
        const target = subject.board[1][0].board[0][0];
        expect(target.player).to.equal(player);
        expect(target.mainIndex).to.equal(0);
        expect(target.subBoardIndex).to.equal(0);
      });

      it(`will correctly update the board whenthe opponent of ${label} moves in a different board`, () => {
        testSequence();
        const target = subject.board[0][0].board[2][1];
        expect(target.player).to.equal(opponent);
        expect(target.mainIndex).to.equal(1);
        expect(target.subBoardIndex).to.equal(0);
      });

      it(`will correctly update when the second move of ${label} is in a different board`, () => {
        testSequence();
        const target = subject.board[2][1].board[1][0];
        expect(target.player).to.equal(player);
        expect(target.mainIndex).to.equal(2);
        expect(target.subBoardIndex).to.equal(0); //
      });

      it(`will correctly update when ${label} returns to move in the same board`, () => {
        testSequence();
        const target = subject.board[1][0].board[0][1];
        expect(target.player).to.equal(opponent);
        expect(target.mainIndex).to.equal(3);
        expect(target.subBoardIndex).to.equal(1);
      });

      it(`will reject a move by ${label} in the wrong board`, () => {
        subject = subject.move(opponent, [1, 0], [0, 0]);
        expect(() => subject.move(player, [2, 0], [2, 1])).to.throw();
      });

    });

  });

});