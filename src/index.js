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
    return Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => null));
  }
  const board = createGameboard()

  const placeShip = (ship, coordinates) => {
    coordinates.forEach(location => {
      const row = location[0]
      const col = location[1]

      board[row][col] = ship
    });
  }
  return {board, placeShip}
}

module.exports = {ship, gameBoard}