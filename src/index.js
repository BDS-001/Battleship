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

  const validCoordinates = (coordinates) => {
    for (let location of coordinates) {
      const row = location[0];
      const col = location[1];
  
      if (board[row][col].ship !== null) {
        return 'Ship already exists';
      }
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
    }
    else {
      return checkResponse
    }
  }

  return {board, placeShip}
}

module.exports = {ship, gameBoard}