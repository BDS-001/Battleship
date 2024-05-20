const { result } = require('lodash');
const { ship, gameBoard, player, computer } = require('./index');

//controls webpage elements
const webpage = (() => {
    const createBoard = (player) => {
        // Create the main board div
        const board = document.createElement('div');
        board.className = 'board';
        board.style.display = 'grid'
        //board.style.display = 'none';
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
            cell.style.border = '1px solid darkblue';
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
            const result = gameState.updatePlayer(gameState.getOpponent(), location);
            if (result.status != 'retry') {
                event.target.style.backgroundColor = result.hit ? 'green' : 'red' 
            }
        }
    }

    const updateCell = (player, move, result) => {
        const target = getPlayerBoard(player).querySelector(`.grid-cell[data-location='${JSON.stringify(move)}']`);
        target.style.backgroundColor = result.hit ? 'green' : 'red';
    }

    //enable and disable cells from being clicked
    const enableListener = (player) => getPlayerBoard(player).addEventListener('click', cellSelect)
    const disableListener = (player) => getPlayerBoard(player).removeEventListener('click', cellSelect)

    return {createBoard, updateBoard, enableListener, disableListener, updateCell}
})();

//runs the battleship game
const gameState = (() => {
    //initialize the players and starting state of the game
    let player1;
    let player2;
    let currentPlayer;
    let currentOpponent;

    const initializePlayers = (mode) => {
        player1 = player('player1');
        player2 = mode === 'solo' ? player('player2', computer) : player('player2');
        currentPlayer = player1;
        currentOpponent = player2;
    };

    //returns the player information
    const getPlayer1 = () => player1
    const getPlayer2 = () => player2
    const getCurrentPlayer = () => currentPlayer
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
        
        if (res.status === 'retry') {
            return res;
        }
      
        if (checkWin(player)) {
            return res;
        }
      
        if (currentOpponent.computer) {
            handleAI(currentOpponent, currentPlayer);
        } else {
            changeTurn();
        }
        
        return res;
    };

    const handleAI = (computerPlayer, currentPlayer) => {
        const { result, move } = computerPlayer.computer.playMove(currentPlayer);
        webpage.updateCell(currentPlayer, move, result);
      
        if (result.status === 'retry') {
            return result;
        }
      
        if (checkWin(currentPlayer)) {
            return result;
        }
      
        return result;
    };

    const placeShips = (player) => {
        if (player.computer) return player.computer.placeShips()
        const ships = [ship(2), ship(3), ship(3), ship(4), ship(5)]
        const board = webpage.getPlayerBoard(player)
        board.display = 'grid'
    }

    return {getPlayer1, getPlayer2, updatePlayer, getOpponent, getCurrentPlayer, initializePlayers, placeShips}
})();

//select game mode before game starts
const menu = (() => {

    const modeSelect = (event) => {
        document.body.innerHTML = ''
        engine(event.target.dataset.mode)
    }

    const generateMenu = () => {
        const body = document.querySelector('body')
        body.innerHTML = ''

        const solo = document.createElement('button')
        const vs = document.createElement('button')
    
        solo.innerHTML = 'solo';
        vs.innerHTML= 'vs';
        solo.dataset.mode = 'solo';
        vs.dataset.mode = 'vs';

        solo.addEventListener('click', modeSelect)
        vs.addEventListener('click', modeSelect)

        body.append(solo)
        body.append(vs)
    }

    return {generateMenu, modeSelect}
})();

function engine(mode) {
    gameState.initializePlayers(mode);

    webpage.createBoard(gameState.getPlayer1());
    webpage.createBoard(gameState.getPlayer2());

    //gameState.placeShips(player)

    webpage.enableListener(gameState.getOpponent());

    const player1 = gameState.getPlayer1();
    const player2 = gameState.getPlayer2();

    player1.board.placeShip(ship(5), [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]);
    player1.board.placeShip(ship(4), [[2, 0], [2, 1], [2, 2], [2, 3]]);
    player1.board.placeShip(ship(3), [[4, 0], [4, 1], [4, 2]]);
    player1.board.placeShip(ship(3), [[6, 0], [6, 1], [6, 2]]);
    player1.board.placeShip(ship(2), [[8, 0], [8, 1]]);

    player2.board.placeShip(ship(5), [[0, 5], [0, 6], [0, 7], [0, 8], [0, 9]]);
    player2.board.placeShip(ship(4), [[2, 5], [2, 6], [2, 7], [2, 8]]);
    player2.board.placeShip(ship(3), [[4, 5], [4, 6], [4, 7]]);
    player2.board.placeShip(ship(3), [[6, 5], [6, 6], [6, 7]]);
    player2.board.placeShip(ship(2), [[8, 5], [8, 6]]);

    webpage.updateBoard(player1);
    webpage.updateBoard(player2);
}

menu.generateMenu()