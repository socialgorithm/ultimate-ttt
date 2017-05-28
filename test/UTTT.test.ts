import { expect } from 'chai';
import UTTT from '../src/UTTT';
import { ME, OPPONENT, PlayerNumber } from '../src/model/constants';
import errors from '../src/model/errors';
import error from '../src/error';

const playerPairs = [['player 0', ME], ['player 1', OPPONENT]] as [string, PlayerNumber][];
const coordinates = [0,1,2].map(x => [0,1,2].map(y => [x, y] as [number, number])).reduce((a, b) => a.concat(b), []);
const sampleMove = [1, 2] as [number, number];

const sequenceOfPairs = (...pairs: [number, number][]): [[number, number], [number, number]][] => {
  return pairs.map((current, index): [[number, number], [number, number]] => {
    if (index === 0) {
      return undefined;
    } else {
      const previous = pairs[index - 1];
      return [previous, current];
    }
  }).slice(1);
};

describe('UTTT', () => {

  let subject: UTTT;

  const gameWinningSequence = sequenceOfPairs(
      [0, 0], [0, 0], [1, 0], [0, 0], [2, 0],
      [1, 0], [1, 0], [2, 0], [2, 0], [0, 0]
  );

  const boardWinningSequence = sequenceOfPairs([0, 0], [0, 0], [1, 0], [0, 0], [2, 0], [0, 0]);

  const runBoardWinningSequence = (player: PlayerNumber) => {
    boardWinningSequence.forEach(([board, move]) => {
      subject = subject.move(player, board, move);
    });
  };

  const runGameWinningSequence = (player: PlayerNumber) => {
    gameWinningSequence.forEach(([board, move]) => {
      subject = subject.move(player, board, move);
    });
  };

  beforeEach(() => {
    subject = new UTTT();
  });

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
        sequenceOfPairs([1, 0], [0, 0], [2, 1], [1, 0], [0, 1]).forEach(([board, move], index) => {
          const current = (player + index) % 2 as PlayerNumber;
          subject = subject.move(current, board, move);
        });
      };

      it(`will correctly use the player wrapper for ${label}`, () => {
        if (player === ME) {
          subject = subject.addMyMove([1, 0], [0, 0]);
        } else if (player === OPPONENT) {
          subject = subject.addOpponentMove([1, 0], [0, 0]);
        }
        const target = subject.board[1][0].board[0][0];
        expect(target.player).to.equal(player);
        expect(target.mainIndex).to.equal(0);
        expect(target.subBoardIndex).to.equal(0);
      });

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

      it(`will reject an invalid move by ${label}`, () => {
        expect(() => subject.move(player, [0, 0], [-1, 0])).to.throw();
        expect(() => subject.move(player, [-1, 0], [0, 0])).to.throw();
        expect(() => subject.move(player, [-1, -1], [-1, -1])).to.throw();
      });

      it(`will not allow ${label} to play on a board that has already been won`, () => {
        runBoardWinningSequence(player);
        expect(() => subject.move(player, [0, 0], [1, 1])).to.throw();
      });

      it(`will throw if ${label} tries to move and the game is over`, () => {
        runGameWinningSequence(opponent);
        expect(() => subject.move(player, [0, 0], [0, 0])).to.throw();
      });

    });

    it(`will throw if an invalid player attempts to move`, () => {
      expect(() => subject.move(3, [0, 0], [0, 0])).to.throw();
    })

  });

  describe('#isValidMove()', () => {

    playerPairs.forEach(([label, player]) => {

      it(`will reject an invalid move by ${label}`, () => {
        expect(subject.isValidMove([0, 0], [-1, 0])).to.be.false;
        expect(subject.isValidMove([-1, 0], [0, 0])).to.be.false;
        expect(subject.isValidMove([-1, -1], [-1, -1])).to.be.false;
      });

    });

  });

  describe('#isFinished(), #getResult()', () => {

    it(`will correctly report when a game has yet to finish`, () => {
      expect(subject.isFinished()).to.be.false;
    });

    playerPairs.forEach(([label, player]) => {

      const opponent = player - 1 as PlayerNumber;

      it(`will correctly report when ${label} has won`, () => {
        runGameWinningSequence(player);

        expect(subject.isFinished()).to.be.true;
        expect(subject.getResult()).to.equal(player);
      });

    });

  });

  describe('#getValidBoards()', () => {

    it('will list the only current valid move', () => {
      sequenceOfPairs([0, 0], [0, 0], [1, 0], [0, 0], [2, 0]).forEach(([board, move]) => {
        subject = subject.addMyMove(board, move);
      });

      // Current board to move is [2, 0] because of the last move
      expect(subject.getValidBoards()).to.have.deep.members([[ 2, 0 ]]);
    });

    it('will list all valid moves', () => {
      runBoardWinningSequence(ME as PlayerNumber);

      // Current board to move is [2, 0] because of the last move
      const remaining = coordinates.slice().filter(m => !(m[0] === 0 && m[1] === 0));
      expect(subject.getValidBoards()).to.have.deep.members(remaining);
    });

  });

  describe('#prettyPrint()', () => {

    it('will yield the expected string', () => {
      expect(subject.prettyPrint()).to.be.a('string');
    });

  });

  describe('#getMoves()', () => {

    it('will yield the expected count', () => {
      expect(subject.getMoves()).to.equal(0);
      subject = subject.move(ME, [0, 0], [0, 0]);
      expect(subject.getMoves()).to.equal(1);
    });

  });

});