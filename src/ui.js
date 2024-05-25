const { result } = require('lodash');
const { ship, gameBoard, player, computer } = require('./index');

// controls webpage elements
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
        document.body.appendChild(shipContainer);
    };

    const getBoards = () => document.querySelectorAll('.board');

    const enableListener = (player) => getPlayerBoard(player).addEventListener('click', cellSelect);
    const disableListener = (player) => getPlayerBoard(player).removeEventListener('click', cellSelect);

    return { createBoard, updateBoard, enableListener, disableListener, updateCell, getBoards, generateShipContainer };
})();

const gameState = (() => {
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

    const getPlayer = (playerName) => {
        if (playerName === 'player1') return player1;
        if (playerName === 'player2') return player2;
    };

    const getCurrentPlayer = () => currentPlayer;
    const getOpponent = () => currentOpponent;

    const changeTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        currentOpponent = currentOpponent === player1 ? player2 : player1;
        webpage.disableListener(currentPlayer);
        webpage.enableListener(currentOpponent);
    };

    const checkWin = (player) => {
        if (player.board.allShipsSunk()) {
            console.log('win');
            webpage.disableListener(player);
            return true;
        }
        return false;
    };

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
        if (player.computer) return player.computer.placeShips();
        const board = webpage.getPlayerBoard(player);
        board.display = 'grid';
    };

    return { getPlayer, updatePlayer, getOpponent, getCurrentPlayer, initializePlayers, placeShips };
})();

const menu = (() => {
    const modeSelect = (event) => {
        document.body.innerHTML = '';
        engine.setMode(event.target.dataset.mode);
    };

    const generateMenu = () => {
        const body = document.querySelector('body');
        body.innerHTML = '';

        const solo = document.createElement('button');
        const vs = document.createElement('button');

        solo.innerHTML = 'solo';
        vs.innerHTML = 'vs';
        solo.dataset.mode = 'solo';
        vs.dataset.mode = 'vs';

        solo.addEventListener('click', modeSelect);
        vs.addEventListener('click', modeSelect);

        body.append(solo);
        body.append(vs);
    };

    return { generateMenu, modeSelect };
})();

const shipPlacementHandler = (() => {
    let currentHoveredCells = [];

    const generateShips = () => {
        const ships = [
            { id: 'ship-1', length: 5 },
            { id: 'ship-2', length: 4 },
            { id: 'ship-3', length: 3 },
            { id: 'ship-4', length: 3 },
            { id: 'ship-5', length: 2 }
        ];

        const shipContainer = document.querySelector('.ship-container');

        ships.forEach((ship) => {
            const shipDiv = document.createElement('div');
            shipDiv.className = 'ship horizontal';
            shipDiv.id = ship.id;
            shipDiv.setAttribute('draggable', 'true');
            shipDiv.setAttribute('data-length', ship.length);
            shipDiv.setAttribute('data-placed', 'false');
            shipDiv.style.width = `${ship.length * 40}px`;
            shipContainer.appendChild(shipDiv);
        });

        return shipContainer;
    };

    const setupPlacements = (board) => {
        const ships = document.querySelectorAll('.ship');
        board.forEach((cell) => {
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('dragleave', dragLeave);
            cell.addEventListener('drop', drop);
        });

        ships.forEach((ship) => {
            ship.addEventListener('dragstart', dragStart);
            ship.style.width = `${ship.dataset.length * 40}px`;
        });
    };

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function dragOver(e) {
        e.preventDefault();
        const targetCell = e.target;

        currentHoveredCells.forEach((cell) => (cell.style.backgroundColor = ''));
        currentHoveredCells = [];

        const shipId = e.dataTransfer.getData('text/plain');
        const ship = document.getElementById(shipId);
        const shipLength = parseInt(ship.dataset.length);
        const startIndex = parseInt(targetCell.dataset.index);

        for (let i = 0; i < shipLength; i++) {
            const cellIndex = startIndex + i;
            if (cellIndex % 10 < startIndex % 10 || cellIndex >= 100) {
                break;
            }
            const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
            if (cell) {
                cell.style.backgroundColor = 'grey';
                currentHoveredCells.push(cell);
            }
        }
    }

    function dragLeave(e) {
        currentHoveredCells.forEach((cell) => (cell.style.backgroundColor = ''));
        currentHoveredCells = [];
    }

    function drop(e) {
        e.preventDefault();
        currentHoveredCells.forEach((cell) => (cell.style.backgroundColor = ''));
        currentHoveredCells = [];

        const shipId = e.dataTransfer.getData('text/plain');
        const ship = document.getElementById(shipId);
        const dropCell = e.target;
        const startIndex = parseInt(dropCell.dataset.index);

        const shipLength = parseInt(ship.dataset.length);
        if (startIndex % 10 + shipLength > 10) {
            return;
        }

        for (let i = 0; i < shipLength; i++) {
            const cell = document.querySelector(`.grid-cell[data-index="${startIndex + i}"]`);
            if (cell.classList.contains('occupied')) {
                return;
            }
        }

        for (let i = 0; i < shipLength; i++) {
            const cell = document.querySelector(`.grid-cell[data-index="${startIndex + i}"]`);
            cell.classList.add('occupied');
        }
        ship.style.position = 'absolute';
        ship.style.left = `${dropCell.getBoundingClientRect().left}px`;
        ship.style.top = `${dropCell.getBoundingClientRect().top}px`;
        ship.draggable = false;
    }

    return { generateShips, setupPlacements };
})();

const engine = (() => {
    const start = () => {
        menu.generateMenu();
    };

    const setMode = (mode) => {
        gameState.initializePlayers(mode);
        webpage.createBoard(gameState.getPlayer('player1'));
        webpage.createBoard(gameState.getPlayer('player2'));
        webpage.generateShipContainer();
        setupPlaceShips();
    };

    const setupPlaceShips = () => {
        const boards = document.querySelectorAll('.board');
        const firstIncompleteBoard = Array.from(boards).find((board) => board.dataset.setupComplete === 'false');
        if (!firstIncompleteBoard) return;
        firstIncompleteBoard.style.display = 'grid';
        shipPlacementHandler.generateShips();
        shipPlacementHandler.setupPlacements(firstIncompleteBoard.querySelectorAll('.grid-cell'));
    };

    return { start, setMode };
})();

engine.start();
