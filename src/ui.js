const { ship, gameBoard, player } = require('./index');

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
        return document.querySelector(`#${player.name}`)

    }

    const updateBoard = (player) => {
        let board = getPlayerBoard(player)
        board = board.querySelectorAll('.grid-cell')
        for (let row = 0; row <= 9; row++) {
            for (let col = 0; col <= 9; col++) {
                if (player.board.board[row][col].ship) board[(row * 10) + col].innerHTML = 's'
            }
        }
    }

    const cellSelect = (event) => {
        if (event.target.matches('.grid-cell')) {
            const location = JSON.parse(event.target.dataset.location)
            const result = gameState.updatePlayer(gameState.getOpponent(), location)
            if (result != 'coordinates already selected') {
                event.target.style.backgroundColor = result ? 'green' : 'red' 
            }
        }
    }

    const enableListener = (player) => getPlayerBoard(player).addEventListener('click', cellSelect)
    const disableListener = (player) => getPlayerBoard(player).removeEventListener('click', cellSelect)

    return {createBoard, updateBoard, enableListener, disableListener}
})();

const gameState = (() => {
    const player1 = player('player1')
    const player2 = player('player2')

    let currentOpponent = player2

    const getOpponent = () => currentOpponent

    const changeTurn = () => {
        webpage.disableListener(currentOpponent)
        currentOpponent === player1 ? currentOpponent = player2 : currentOpponent = player1
        webpage.enableListener(currentOpponent)
    }

    const updatePlayer = (player, location) => {
        const res = player.board.receiveAttack(location)
        if (res != 'coordinates already selected') {
            changeTurn()
        }
        return res
    }

    return {player1, player2, updatePlayer, getOpponent}
})();

//test
webpage.createBoard(gameState.player1);
webpage.createBoard(gameState.player2);
webpage.enableListener(gameState.getOpponent());
gameState.player1.board.placeShip(ship(3), [[0, 0], [0, 1], [0, 2]]);
gameState.player1.board.placeShip(ship(2), [[1, 0], [1, 1]]);
gameState.player2.board.placeShip(ship(5), [[4, 3], [5, 3], [6, 3], [7, 3], [8, 3]]);
webpage.updateBoard(gameState.player1)
webpage.updateBoard(gameState.player2)