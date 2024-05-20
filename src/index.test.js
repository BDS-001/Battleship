const { ship, gameBoard, player, computer } = require('./index');

describe('ship', () => {

    let myShip;
    beforeEach(() => {
      // Create a new ship for each test
      myShip = ship(3);
    });

  
    test('ship should not be sunk initially', () => {
      expect(myShip.isSunk()).toBe(false);
    });
  
    test('hits are incremented on hit', () => {
      myShip.hit();
      expect(myShip.hits).toBe(1);
    });
  
    test('ship sinks after sufficient hits', () => {
      myShip.hit();
      myShip.hit();
      myShip.hit();
      expect(myShip.isSunk()).toBe(true);
    });
  
    test('ship does not sink before sufficient hits', () => {
      myShip.hit();
      myShip.hit();
      expect(myShip.isSunk()).toBe(false);
    });
  });

  describe('gameBoard', () => {

    let myBoard;
    beforeEach(() => {
      // Create a new game board for each test
      myBoard = gameBoard();
    });

    test('game board has 10 rows', () => {
      expect(myBoard.board.length).toBe(10);
    });

    test('each game board row has 10 columns', () => {
      myBoard.board.forEach(row => {
        expect(row.length).toBe(10);
      });
    });

    test('ship can be placed', () => {
      const myShip = ship(2)
      myBoard.placeShip(myShip, [[4,6], [4,5]])
      expect(myBoard.board[4][6].ship).toBe(myShip)
      expect(myBoard.board[4][5].ship).toBe(myShip)
      expect(myBoard.board[4][7].ship).toBe(null)
    });

    test('cannot place a ship where a ship already exists', () => {
      const myShip = ship(2)
      const otherShip = ship(2)
      myBoard.placeShip(myShip, [[4,6], [4,5]])
      expect(myBoard.placeShip(otherShip, [[3,6], [4,6]])).toBe('Ship already exists')
    });

    test('cannot place a ship outside of the gameBoard', () => {
      const myShip = ship(2)
      expect(myBoard.placeShip(myShip, [[9,9], [9,10]])).toBe('coordinates out of range')
    });

    test('miss updates the coordinate to miss', () => {
      const myShip = ship(2)
      myBoard.placeShip(myShip, [[4,6], [4,5]])
      myBoard.receiveAttack([0, 0])
      expect(myBoard.board[0][0].hit).toBe(false)
    });

    test('recieveAttack correctly hits the ship', () => {
      const myShip = ship(2)
      myBoard.placeShip(myShip, [[4,6], [4,5]])
      myBoard.receiveAttack([4, 6])
      expect(myBoard.board[4][6].hit).toBe(true)
      expect(myShip.hits).toBe(1)
    });

    test('recieveAttack correctly hits the ship', () => {
      const myShip = ship(2)
      myBoard.placeShip(myShip, [[4,6], [4,5]])
      myBoard.receiveAttack([4, 6])
      expect(myBoard.receiveAttack([4, 6]).status).toBe('retry')
    });
  
    test('returns false when no ships are sunk', () => {
      myBoard.placeShip(ship(3), [[0, 0], [0, 1], [0, 2]]);
      myBoard.placeShip(ship(2), [[1, 0], [1, 1]]);
      expect(myBoard.allShipsSunk()).toBe(false);
    });
  
    test('returns false when some ships are sunk', () => {
      let smallShip = ship(1);
      myBoard.placeShip(smallShip, [[2, 0]]);
      myBoard.placeShip(ship(3), [[3, 0], [3, 1], [3, 2]]);
      myBoard.receiveAttack([2, 0]);
      expect(myBoard.allShipsSunk()).toBe(false);
    });
  
    test('returns true when all ships are sunk', () => {
      let smallShip1 = ship(1);
      let smallShip2 = ship(1);
      myBoard.placeShip(smallShip1, [[4, 0]]);
      myBoard.placeShip(smallShip2, [[5, 0]]);
      myBoard.receiveAttack([4, 0]);
      myBoard.receiveAttack([5, 0]);
      expect(myBoard.allShipsSunk()).toBe(true);
    });
  })

  describe('player', () => {
    
    let testPlayer;
    beforeEach(() => { 
      testPlayer = player();
    });
  
    test('should initialize with a gameBoard', () => {
      expect(testPlayer.board).toBeDefined();
    });
  
    test('should have a gameBoard with necessary methods', () => {
      expect(typeof testPlayer.board.placeShip).toBe('function');
      expect(typeof testPlayer.board.receiveAttack).toBe('function');
      expect(typeof testPlayer.board.allShipsSunk).toBe('function');
    });
  }); 

  describe('computer', () => {
    describe('selectMove', () => {
      test('should return an array of two integers between 0 and 9 inclusive', () => {
        const comp = computer();
        const move = comp.selectMove();
        expect(Array.isArray(move)).toBe(true);
        expect(move.length).toBe(2);
        expect(Number.isInteger(move[0])).toBe(true);
        expect(Number.isInteger(move[1])).toBe(true);
        expect(move[0]).toBeGreaterThanOrEqual(0);
        expect(move[0]).toBeLessThan(10);
        expect(move[1]).toBeGreaterThanOrEqual(0);
        expect(move[1]).toBeLessThan(10);
      });
  
      test('should return different values on subsequent calls', () => {
        const comp = computer();
        const move1 = comp.selectMove();
        const move2 = comp.selectMove();
        expect(move1).not.toEqual(move2);
      });
    });
  
    describe('computer.playMove', () => {
      let comp;
      let opposingPlayer;
    
      beforeEach(() => {
        comp = computer();
        opposingPlayer = {
          board: {
            receiveAttack: jest.fn()
          }
        };
      });
    
      test('should return a move and result that is not "retry"', () => {
        opposingPlayer.board.receiveAttack.mockReturnValueOnce('miss');
        
        const { result, move } = comp.playMove(opposingPlayer);
        
        expect(Array.isArray(move)).toBe(true);
        expect(move.length).toBe(2);
        expect(Number.isInteger(move[0])).toBe(true);
        expect(Number.isInteger(move[1])).toBe(true);
        expect(result).not.toBe('retry');
        expect(opposingPlayer.board.receiveAttack).toHaveBeenCalledWith(move);
      });
    
      test('should retry if the result is "retry"', () => {
        opposingPlayer.board.receiveAttack
          .mockReturnValueOnce('retry')
          .mockReturnValueOnce('hit');
        
        const { result, move } = comp.playMove(opposingPlayer);
        
        expect(Array.isArray(move)).toBe(true);
        expect(move.length).toBe(2);
        expect(Number.isInteger(move[0])).toBe(true);
        expect(Number.isInteger(move[1])).toBe(true);
        expect(result).not.toBe('retry');
        expect(opposingPlayer.board.receiveAttack).toHaveBeenCalledTimes(2);
      });
    });
    describe('computer place ships', () => {
      let testComputer;
      let testBoard;
    
      beforeEach(() => {
        const testPlayer = player('comp', computer);
        testComputer = testPlayer.computer;
        testBoard = testPlayer.board;
      });
    
      test('genCoordinates generates correct coordinates for horizontal direction', () => {
        const testShip = ship(3);
        const origin = [0, 0];
        const direction = 'horizontal';
        const coordinates = testComputer.genCoordinates(testShip, origin, direction);
    
        expect(coordinates).toEqual([[0, 0], [0, 1], [0, 2]]);
      });
    
      test('genCoordinates generates correct coordinates for vertical direction', () => {
        const testShip = ship(3);
        const origin = [0, 0];
        const direction = 'vertical';
        const coordinates = testComputer.genCoordinates(testShip, origin, direction);
    
        expect(coordinates).toEqual([[0, 0], [1, 0], [2, 0]]);
      });
    
      test('placeShips places all ships on the board without conflicts', () => {
        testComputer.placeShips();
        const boardState = testBoard.board;
        const placedShips = [];
    
        // Collect all placed ships
        boardState.forEach(row => {
          row.forEach(cell => {
            if (cell.ship && !placedShips.includes(cell.ship)) {
              placedShips.push(cell.ship);
            }
          });
        });
    
        expect(placedShips.length).toBe(5); // There are 5 ships to be placed
    
        placedShips.forEach(ship => {
          expect(ship.hits).toBe(0);
          expect(ship.isSunk()).toBe(false);
        });
      });
    
      test('placeShips places all ships within board boundaries', () => {
        testComputer.placeShips();
        const boardState = testBoard.board;
    
        boardState.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (cell.ship) {
              expect(rowIndex).toBeLessThan(10);
              expect(colIndex).toBeLessThan(10);
            }
          });
        });
      });
    });
  });