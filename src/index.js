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
    }
    else {
      return checkResponse
    }
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
  const computer = cpu
  return {board, name, computer}
}

const computer = () => {
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

  return { selectMove, playMove };
};

module.exports = {ship, gameBoard, player, computer}