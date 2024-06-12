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
            //**************** */
            // cell.innerHTML = i
            //*******************/
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
            cell.style.border = '1px solid #b9d4b4';
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

    const removeOccupied = () => {
        const boards = document.querySelectorAll('.board')
        boards.forEach(board => {
            board = board.querySelectorAll('.grid-cell');
            for (let cell = 0; cell < 100; cell++) {
                board[cell].classList.remove('occupied')
            } 
        });
    }

    const updateCell = (player, move, result) => {
        const target = getPlayerBoard(player).querySelector(`.grid-cell[data-location='${JSON.stringify(move)}']`);
        target.style.backgroundColor = result.hit ? 'green' : 'red';
    };

    const generateShips = (shipContainer) => {
        const ships = [
            { id: 'ship-1', length: 5 },
            { id: 'ship-2', length: 4 },
            { id: 'ship-3', length: 3 },
            { id: 'ship-4', length: 3 },
            { id: 'ship-5', length: 2 }
        ];

        ships.forEach((ship) => {
            const shipDiv = document.createElement('div');
            shipDiv.className = 'ship horizontal';
            shipDiv.id = ship.id;
            shipDiv.setAttribute('draggable', 'true');
            shipDiv.setAttribute('data-length', ship.length);
            shipDiv.setAttribute('data-placed', 'false');
            shipDiv.setAttribute('data-origin', 'none');
            shipDiv.setAttribute('data-direction', 'horizontal');
            shipDiv.style.width = `${ship.length * 40}px`;
            shipContainer.appendChild(shipDiv);
        });

        return shipContainer;
    };

    const generateShipContainer = () => {
        const shipContainer = document.createElement('div');
        shipContainer.className = 'ship-container';

        const lockIn = document.createElement('button')
        lockIn.id = 'lock-in'
        lockIn.innerHTML = 'LOCK IN'
        shipContainer.appendChild(lockIn)

        document.body.appendChild(generateShips(shipContainer));
    };

    const getBoards = () => document.querySelectorAll('.board');

    return { createBoard, updateBoard, updateCell, getBoards, generateShipContainer, getPlayerBoard, removeOccupied };
})();

module.exports = webpage;
