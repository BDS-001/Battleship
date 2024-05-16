const { ship, gameBoard, player, computer } = require('./index');

//controls webpage elements
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

    //return the ui board when given a palyer
    const getPlayerBoard = (player) => document.querySelector(`#${player.name}`)

    //update the entire board when given a player
    const updateBoard = (player) => {
        let board = getPlayerBoard(player)
        board = board.querySelectorAll('.grid-cell')
        for (let row = 0; row <= 9; row++) {
            for (let col = 0; col <= 9; col++) {
                if (player.board.board[row][col].ship) board[(row * 10) + col].innerHTML = 's'
            }
        }
    }

    //when the cell is selected get the coordiantes and update the action
    const cellSelect = (event) => {
        if (event.target.matches('.grid-cell')) {
            const location = JSON.parse(event.target.dataset.location)
            const result = gameState.updatePlayer(gameState.getOpponent(), location)
            if (result != 'retry') {
                event.target.style.backgroundColor = result ? 'green' : 'red' 
            }
        }
    }

    const updateCell = (player, move, result) => {
        const target = getPlayerBoard(player).querySelector(`.grid-cell[data-location='${JSON.stringify(move)}']`);
        target.style.backgroundColor = result ? 'green' : 'red';
    }

    //enable and disable cells from being clicked
    const enableListener = (player) => getPlayerBoard(player).addEventListener('click', cellSelect)
    const disableListener = (player) => getPlayerBoard(player).removeEventListener('click', cellSelect)

    return {createBoard, updateBoard, enableListener, disableListener, updateCell}
})();

//runs the battleship game
const gameState = (() => {
    //initialize the players and starting state of the game
    const player1 = player('player1')
    const player2 = player('player2', computer())
    let currentPlayer = player1
    let currentOpponent = player2

    //returns the currentOpponent
    const getOpponent = () => currentOpponent

    //update the currentPlayer and currentOpponent
    const changeTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        currentOpponent = currentOpponent === player1 ? player2 : player1;
        webpage.disableListener(currentPlayer)
        webpage.enableListener(currentOpponent)
    }

    const checkWin = (player) => {
        if (player.board.allShipsSunk()) {
            console.log('win');
            webpage.disableListener(player);
            return true;
        }
        return false;
    };

    //recieve and attack and returns the result of the selected coordinates
    const updatePlayer = (player, location) => {
        const res = player.board.receiveAttack(location);
    
        if (res === 'retry') {
            return res;
        }
    
        if (checkWin(player)) {
            return res;
        }
    
        if (currentOpponent.computer) {
            const { result, move } = currentOpponent.computer.playMove(player);
            webpage.updateCell(player, move, result);
    
            if (result === 'retry') {
                return res;
            }
    
            if (checkWin(player)) {
                return result;
            }
        }
    
        changeTurn();
        return res;
    };

    return {player1, player2, updatePlayer, getOpponent}
})();



function test() {
    webpage.createBoard(gameState.player1);
    webpage.createBoard(gameState.player2);
    webpage.enableListener(gameState.getOpponent());
    gameState.player1.board.placeShip(ship(5), [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]);
    gameState.player1.board.placeShip(ship(4), [[2, 0], [2, 1], [2, 2], [2, 3]]);
    gameState.player1.board.placeShip(ship(3), [[4, 0], [4, 1], [4, 2]]);
    gameState.player1.board.placeShip(ship(3), [[6, 0], [6, 1], [6, 2]]);
    gameState.player1.board.placeShip(ship(2), [[8, 0], [8, 1]]);

    gameState.player2.board.placeShip(ship(5), [[0, 5], [0, 6], [0, 7], [0, 8], [0, 9]]);
    gameState.player2.board.placeShip(ship(4), [[2, 5], [2, 6], [2, 7], [2, 8]]);
    gameState.player2.board.placeShip(ship(3), [[4, 5], [4, 6], [4, 7]]);
    gameState.player2.board.placeShip(ship(3), [[6, 5], [6, 6], [6, 7]]);
    gameState.player2.board.placeShip(ship(2), [[8, 5], [8, 6]]);

    webpage.updateBoard(gameState.player1)
    webpage.updateBoard(gameState.player2)
}

test()