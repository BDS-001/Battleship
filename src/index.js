const ship = (length) => {
  return {
    length:length,
    hits: 0,
    sunk:false,
    hit: function() {
      this.hits++;
      if (this.hits >= this.length) this.sunk = true
    },
    isSunk: function() {
      return this.sunk
    }
  }
}

const gameBoard = () => {
  const createGameboard = () => {
    return Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ ship: null, hit: null })));

  }
  const board = createGameboard()
  const ships = []

  const validCoordinates = (coordinates) => {
    for (let location of coordinates) {
      const row = location[0];
      const col = location[1];
      
      if (row >= 10 || col >= 10 || row < 0 || col < 0) return 'coordinates out of range'
      if (board[row][col].ship !== null) return 'Ship already exists';
    }
    return true
  }

  const placeShip = (ship, coordinates) => {
    const checkResponse = validCoordinates(coordinates)
    if (checkResponse === true) {
      coordinates.forEach(location => {
        const row = location[0]
        const col = location[1]
        
        board[row][col].ship = ship
      });
      ships.push(ship)
      return true
    }
    return false
  }

  const receiveAttack = (coordinates) => {
    const location = board[coordinates[0]][coordinates[1]];
    
    if (location.hit != null) {
      return { status: 'retry', hit: null, sunk: null };
    }
    
    if (location.ship) {
      location.hit = true;
      location.ship.hit();
      return { status: 'success', hit: true, sunk: location.ship.isSunk() };
    } else {
      location.hit = false;
      return { status: 'success', hit: false, sunk: false };
    }
  };
  

  const allShipsSunk = () => {
    return ships.every(ship => ship.sunk)
  }

  return {board, placeShip, receiveAttack, allShipsSunk}
}

const player = (playerName, cpu = null) => {
  const board = gameBoard()
  const name = playerName
  const computerPlayer  = cpu ? cpu(board) : null;
  return {board, name, computer:computerPlayer}
}

const computer = (board) => {
  const previousMove = null;

  const selectMove = () => {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  };

  const playMove = (opposingPlayer) => {
    let result;
    let move;

    do {
      move = selectMove();
      result = opposingPlayer.board.receiveAttack(move);
    } while (result === "retry");

    return { result, move };
  };

  const genCoordinates = (ship, origin, direction) => {
    const coordinates = []
    for (let i = 0; i < ship.length; i++) {
      if (direction === 'horizontal') {
        coordinates.push([origin[0], origin[1] + i])
      }
      if (direction === 'vertical') {
        coordinates.push([origin[0] + i, origin[1]])
      } 
    }
    return coordinates
  }

  const placeShips = () => {
    const ships = [ship(2), ship(3), ship(3), ship(4), ship(5)]

    ships.forEach((ship) => {
      let placed = false;
      while (!placed) {
        const origin = selectMove()
        const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const coordinates = genCoordinates(ship, origin, direction)

        placed = board.placeShip(ship, coordinates);
        console.log(placed)
      }
      console.log(board)
    });
  }

  return { selectMove, playMove, placeShips, genCoordinates};
};

module.exports = {ship, gameBoard, player, computer}