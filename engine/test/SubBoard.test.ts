import { expect } from 'chai';
import SubBoard from '../src/SubBoard';
import {Coord, ME, OPPONENT, PlayerNumber, RESULT_TIE, UNPLAYED} from '../src/model/constants';

const playerPairs = [['player 0', ME], ['player 1', OPPONENT]] as [string, PlayerNumber][];
const coordinates = [0,1,2].map(x => [0,1,2].map(y => [x, y] as [number, number])).reduce((a, b) => a.concat(b), []);
const sampleMove = [1, 2] as [number, number];

describe('SubBoard', () => {

  let subject: SubBoard;

  const addMoves = (target: PlayerNumber, ...moves: [number, number][]) => 
    moves.forEach(move => { subject = subject.move(target, move); });

  const fillBoard = (firstPlayer: PlayerNumber = 0) => {
    coordinates.forEach((coords, idx) => {
      const eachPlayer = (idx > 5 ? ((idx + 1) % 2) : (idx % 2));
      const playerNum = (firstPlayer === 1) ? 1 - eachPlayer : eachPlayer;
      subject = subject.move(playerNum as PlayerNumber, coords);
    });
  };

  beforeEach(() => {
    subject = new SubBoard();
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

    it('will correctly populate the board', () => {
      coordinates.forEach(([row, col]) => {
        expect(subject.board[row][col].player).to.equal(UNPLAYED);
      });
    });

  });

  describe('#move(), #addMyMove(), #addOpponentMove()', () => {

    playerPairs.map(([label, player]) => {

      it(`will correctly add a move for ${label}`, () => {
        subject = subject.move(player, sampleMove);
        coordinates.forEach(([row, col]) => {
          const isTarget = row == sampleMove[0] && col == sampleMove[1];
          expect(subject.board[row][col].player).to.equal(isTarget ? player : UNPLAYED);
        });
      });

    });

    it('will reject an invalid player', () => {
      [-1, 'abc', 3].forEach(player => {
        expect(() => subject.move(player as PlayerNumber, [1, 1])).to.throw();
      });
    });

    playerPairs.map(([label, player]) => {

      it(`will reject an invalid move by ${label}`, () => {
        [undefined, 1, 'abc', [], [1], [1, 4], [-1, 4], [1, 1, 1]].forEach(move => {
          expect(() => subject.move(player, move as [number, number])).to.throw();
        });
      });

      it(`will reject ${label} repeating their opponent's move`, () => {
        subject = subject.move(1 - player as PlayerNumber, sampleMove);
        expect(() => subject.move(player, sampleMove)).to.throw();
      });

      it(`will reject ${label} repeating their own move`, () => {
        subject = subject.move(player, sampleMove);
        expect(() => subject.move(player, sampleMove)).to.throw();
      });

      it(`will reject a move by ${label} on a full board`, () => {
        fillBoard();
        expect(() => subject.move(player, sampleMove)).to.throw();
      });

      it(`will reject a move by ${label} where the board has been won`, () => {
        addMoves(player, [0,0], [1,1], [2,2]);
        expect(() => subject.move(player, sampleMove)).to.throw();
      });

      it(`will detect a tie when the last move was by ${label}`, () => {
        fillBoard(player);
        expect(() => subject.move(player, sampleMove)).to.throw();
        expect(subject.isFull()).to.be.true;
        expect(subject.isFinished()).to.be.true;
        expect(subject.winner).to.equal(RESULT_TIE);
      });

    });

  });

  describe('#isFull()', () => {

    it(`will correctly report a non-full board`, () => {
      expect(subject.isFull()).to.be.false;
    });

    it(`will correctly report a full board`, () => {
      fillBoard();
      expect(subject.isFull()).to.be.true;
    });

  });

  describe('#isFinished(), #getResult()', () => {

    it('will correctly report an unfinished board', () => {
      expect(subject.isFinished()).to.be.false;
      expect(subject.winner).to.be.undefined;
    });

    it('will fail to get the result of an unfinished board', () => {
      expect(() => subject.getResult()).to.throw();
    });

    it('will correctly report a full board', () => {
      fillBoard();
      expect(subject.isFinished()).to.be.true;
      expect(subject.winner).to.equal(-1);
    });

    playerPairs.forEach(([label, player]) => {

      it(`will detect a winning right to left diagonal for ${label}`, () => {
        addMoves(player, [0, 0], [1, 1], [2, 2]);
        expect(subject.isFinished()).to.be.true;
        expect(subject.getResult()).to.equal(player);
      });

      it(`will detect a winning left to right diagonal for ${label}`, () => {
        addMoves(player, [2, 0], [1, 1], [0, 2]);
        expect(subject.isFinished()).to.be.true;
        expect(subject.getResult()).to.equal(player);
      });

      [0, 1, 2].forEach(index => {

        it(`will detect a win on row ${index} by ${label}`, () => {
          addMoves(player, [index, 0], [index, 1], [index, 2]);
          expect(subject.isFinished()).to.be.true;
          expect(subject.getResult()).to.equal(player);
        });

        it(`will detect a win on column ${index} by ${label}`, () => {
          addMoves(player, [0, index], [1, index], [2, index]);
          expect(subject.isFinished()).to.be.true;
          expect(subject.getResult()).to.equal(player);
        });

      });

    });

  });

  describe('#prettyPrint()', () => {

    it('will yield the expected string', () => {
      expect(subject.prettyPrint()).to.be.a('string');
    });

  });

  describe('#getValidMoves', () => {

    it('will list all valid moves', () => {
      subject = subject.move(ME, [0, 0]);
      
      const remaining = coordinates.slice().filter(m => !(m[0] === 0 && m[1] === 0));
      expect(subject.getValidMoves()).to.have.deep.members(remaining);
    });

  });

});