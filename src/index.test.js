const { ship, gameBoard } = require('./index');

describe('ship', () => {
    test('ship should not be sunk initially', () => {
      const myShip = ship(3);
      expect(myShip.isSunk()).toBe(false);
    });
  
    test('hits are incremented on hit', () => {
      const myShip = ship(3);
      myShip.hit();
      expect(myShip.hits).toBe(1);
    });
  
    test('ship sinks after sufficient hits', () => {
      const myShip = ship(3);
      myShip.hit();
      myShip.hit();
      myShip.hit();
      expect(myShip.isSunk()).toBe(true);
    });
  
    test('ship does not sink before sufficient hits', () => {
      const myShip = ship(3);
      myShip.hit();
      myShip.hit();
      expect(myShip.isSunk()).toBe(false);
    });
  });

  describe('gameBoard', () => {
    test('game board has 10 rows', () => {
      const myBoard = gameBoard();
      expect(myBoard.board.length).toBe(10);
    });

    test('each game board row has 10 columns', () => {
      const myBoard = gameBoard();
      myBoard.board.forEach(row => {
        expect(row.length).toBe(10);
      });
    });

    test('ship can be placed', () => {
      const myBoard = gameBoard();
      const myShip = ship(2)
      myBoard.placeShip(myShip, [[4,6], [4,5]])
      expect(myBoard.board[4][6].ship).toBe(myShip)
      expect(myBoard.board[4][5].ship).toBe(myShip)
      expect(myBoard.board[4][7].ship).toBe(null)
    });

    test('cannot place a ship where a ship already exists', () => {
      const myBoard = gameBoard();
      const myShip = ship(2)
      const otherShip = ship(2)
      myBoard.placeShip(myShip, [[4,6], [4,5]])
      expect(myBoard.placeShip(otherShip, [[3,6], [4,6]])).toBe('Ship already exists')
    });

    test('cannot place a ship outside of the gameBoard', () => {
      const myBoard = gameBoard();
      const myShip = ship(2)
      expect(myBoard.placeShip(myShip, [[9,9], [9,10]])).toBe('coordinates out of range')
    });
  })