const gameState = require('./gameState');

const webpage = (() => {
    const createBoard = (player) => {
        const board = document.createElement('div');
        board.className = 'board';
        board.style.display = 'none';
        board.id = player.name;
        board.style.gridTemplateColumns = 'repeat(10, 40px)';
        board.style.gridTemplateRows = 'repeat(10, 40px)';
        board.dataset.setupComplete = 'false';

        let row = 0;
        let col = 0;
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            const location = [row, col];
            if (col >= 9) {
                row++;
                col = 0;
            } else {
                col++;
            }
            cell.dataset.location = JSON.stringify(location);
            cell.dataset.index = i;
            cell.className = 'grid-cell';
            cell.style.border = '1px solid darkblue';
            board.appendChild(cell);
        }
        document.body.append(board);
    };

    const getPlayerBoard = (player) => document.querySelector(`#${player.name}`);

    const updateBoard = (player) => {
        let board = getPlayerBoard(player);
        board = board.querySelectorAll('.grid-cell');
        for (let row = 0; row <= 9; row++) {
            for (let col = 0; col <= 9; col++) {
                if (player.board.board[row][col].ship) board[(row * 10) + col].innerHTML = 's';
            }
        }
    };

    const cellSelect = (event) => {
        if (event.target.matches('.grid-cell')) {
            const location = JSON.parse(event.target.dataset.location);
            const result = gameState.updatePlayer(gameState.getOpponent(), location);
            if (result.status != 'retry') {
                event.target.style.backgroundColor = result.hit ? 'green' : 'red';
            }
        }
    };

    const updateCell = (player, move, result) => {
        const target = getPlayerBoard(player).querySelector(`.grid-cell[data-location='${JSON.stringify(move)}']`);
        target.style.backgroundColor = result.hit ? 'green' : 'red';
    };

    const generateShipContainer = () => {
        const shipContainer = document.createElement('div');
        shipContainer.className = 'ship-container';

        const lockIn = document.createElement('button')
        lockIn.id = 'lock-in'
        lockIn.innerHTML = 'LOCK IN'
        shipContainer.appendChild(lockIn)

        document.body.appendChild(shipContainer);
    };

    const getBoards = () => document.querySelectorAll('.board');

    const enableListener = (player) => getPlayerBoard(player).addEventListener('click', cellSelect);
    const disableListener = (player) => getPlayerBoard(player).removeEventListener('click', cellSelect);

    return { createBoard, updateBoard, enableListener, disableListener, updateCell, getBoards, generateShipContainer };
})();

module.exports = webpage;
