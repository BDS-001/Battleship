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
    return 'success'
  }

  const placeShip = (ship, coordinates) => {
    const checkResponse = validCoordinates(coordinates)
    if (checkResponse === 'success') {
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

  const validAttack = (coordinates) => {
    const row = coordinates[0];
    const col = coordinates[1];
    
    if (row >= 10 || col >= 10 || row < 0 || col < 0) return false
    return true
  }

  const receiveAttack = (coordinates) => {
    if (!validAttack(coordinates)) return { status: 'retry', hit: null, sunk: null, ship:null };
    const location = board[coordinates[0]][coordinates[1]];
    
    if (location.hit != null) {
      return { status: 'retry', hit: null, sunk: null, ship:location.ship };
    }
    
    if (location.ship) {
      location.hit = true;
      location.ship.hit();
      return { status: 'success', hit: true, sunk: location.ship.isSunk(), ship:location.ship };
    } else {
      location.hit = false;
      return { status: 'success', hit: false, sunk: false,ship:null };
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
  let cache = {
    ship: null, 
    origin: null, 
    factor: 1, 
    left: null, 
    right: null, 
    up: null, 
    down: null, 
    horizontal: { active: null, left: null, right: null }, 
    vertical: { active: null, up: null, down: null }
  };

  const directions = [
    { key: 'left', move: [0, -1], cacheKey: 'horizontal' },
    { key: 'up', move: [-1, 0], cacheKey: 'vertical' },
    { key: 'right', move: [0, 1], cacheKey: 'horizontal' },
    { key: 'down', move: [1, 0], cacheKey: 'vertical' }
  ];

  const setCache = () => {
    cache = {
      ship: null, 
      origin: null, 
      factor: 1, 
      left: null, 
      right: null, 
      up: null, 
      down: null, 
      horizontal: { active: null, left: null, right: null }, 
      vertical: { active: null, up: null, down: null }
    };
  };

  const selectMove = () => {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  };

















  
  function smartPlayMove(opposingPlayer) {
    let result;
    let move;

    //no active hit
    if (!cache.ship) {
      do {
        move = selectMove();
        result = opposingPlayer.board.receiveAttack(move);
      } while (result.status === "retry");

      if (result.hit) {
        cache.origin = move
        cache.ship = result.ship
      }
      return { result, move };
    }

    if (cache.horizontal.active) {
      //if horizontal has been determined, go left until miss then go right untill hit
      do {
        if (!cache.horizontal.left) {
          move = [cache.origin[0], cache.origin[1] - cache.factor]
          cache.factor = cache.factor + 1
          result = opposingPlayer.board.receiveAttack(move);
          console.log(result, cache.ship, result.ship, 'left')
          if (cache.ship != result.ship) {
            cache.horizontal.left = true
            cache.factor = 1
          }
        } else if (!cache.horizontal.right) {
          move = [cache.origin[0], cache.origin[1] + cache.factor]
          cache.factor = cache.factor + 1
          result = opposingPlayer.board.receiveAttack(move);
          console.log(result, cache.ship, result.ship, 'right')
          if (cache.ship != result.ship) {
            cache.horizontal.right = true
            cache.factor = 1
          }
        }
      } while (result.status === 'retry' )

    } else if(cache.vertical.active) {
      //if vertical has been determined, go left until miss then go right untill hit
      do {
        if (!cache.vertical.up) {
          move = [cache.origin[0] - cache.factor, cache.origin[1]]
          cache.factor = cache.factor + 1
          result = opposingPlayer.board.receiveAttack(move);
          console.log(result, cache.ship, result.ship, 'up')
          if (cache.ship != result.ship) {
            cache.vertical.up = true
            cache.factor = 1
          }
        } else if (!cache.vertical.down) {
          move = [cache.origin[0] + cache.factor, cache.origin[1]]
          cache.factor = cache.factor + 1
          result = opposingPlayer.board.receiveAttack(move);
          console.log(result, cache.ship, result.ship, 'down')
          if (cache.ship != result.ship) {
            cache.vertical.down = true
            cache.factor = 1
          }
        }
      } while (result.status === 'retry' )

    } else {
      // find ship direction
      do {
        for (let i = 0; i < directions.length; i++) {
          const direction = directions[i]
          if (!cache[direction.key]) {
            move = [cache.origin[0] + direction.move[0], cache.origin[1] + direction.move[1]];
            result = opposingPlayer.board.receiveAttack(move);
            cache[direction.key] = true;
            if (result.status === 'success' && result.hit && cache.ship === result.ship) {
              cache[direction.cacheKey].active = true;
            }
            break
          }
        }
      } while (result.status === 'retry' )
    }

    if (result.sunk) setCache()
    return { result, move };
  }





















  const playMove = (opposingPlayer) => {
    let result;
    let move;

    do {
      move = selectMove();
      result = opposingPlayer.board.receiveAttack(move);
    } while (result.status === "retry");

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
      }
    });
  }

  return { selectMove, playMove, placeShips, genCoordinates, smartPlayMove};
};

module.exports = {ship, gameBoard, player, computer}