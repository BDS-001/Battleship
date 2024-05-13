const { ship, gameBoard, player } = require('./index');

const gameState = (() => {
    const player1 = player('player1')
    const player2 = player('player2')

    const currentPlayer = player1

    const updatePlayer = (player, location) => {
        return player.board.receiveAttack(location)
    }

    return {player1, player2, currentPlayer, updatePlayer}
})();

console.log(gameState.player1)

const webpage = (() => {
    const createBoard = (player) => {
        // Create the main board div
        const board = document.createElement('div');
        board.className = 'board';
        board.style.display = 'grid';
        board.id = player.name
        board.style.gridTemplateColumns = 'repeat(10, 40px)';  // Sets the layout to 10 columns
        board.style.gridTemplateRows = 'repeat(10, 40px)';     // Sets the layout to 10 rows

        // Loop to create each cell in the grid
        let row = 0
        let col = 0
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            const location = [row, col]
            if (col >= 9) {
                row++;
                col = 0
            } else {
                col++;
            }
            cell.dataset.location = JSON.stringify(location);
            cell.className = 'grid-cell';
            cell.style.border = '1px solid black';
            board.appendChild(cell);
        }

        // Append the board to the body of the page
        document.body.appendChild(board);
    }

    const getPlayerBoard = (player) => {
        const board = document.querySelector(`#${player.name}`)
        return board.querySelectorAll('.grid-cell')
    }
    const updateBoard = (player) => {
        const board = getPlayerBoard(player)
        for (let row = 0; row <= 9; row++) {
            for (let col = 0; col <= 9; col++) {
                if (player.board.board[row][col].ship) board[(row * 10) + col].innerHTML = 1
                
            }
            
        }
    }

    const cellSelect = (event) => {
        if (event.target.matches('.grid-cell')) {
            const location = JSON.parse(event.target.dataset.location)
            const result = gameState.updatePlayer(gameState.currentPlayer, location)
            if (result != 'coordinates already selected') {
                event.target.innerHTML = result
            }
        }
    }

    const enableListener = (board) => {
        board.addEventListener('click', cellSelect)
    }

    const disableListener = (board) => {
        board.removeEventListener('click', cellSelect)
    }

    createBoard(gameState.player1)
    createBoard(gameState.player2)

    return {updateBoard, enableListener}
})();


    //test
    gameState.player1.board.placeShip(ship(3), [[0, 0], [0, 1], [0, 2]]);
    gameState.player1.board.placeShip(ship(2), [[1, 0], [1, 1]]);
    webpage.updateBoard(gameState.player1)
    webpage.enableListener(document.querySelector('#player1'))