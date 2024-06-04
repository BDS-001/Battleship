const { ship } = require('../index');
const gameState = require('./gameState');
const webpage = require('./webpage');

const shipPlacementHandler = (() => {
    let currentHoveredCells = [];
    let placedShips = {};
    let activePlayer = null;

    const setupPlacements = () => {
        const boards = document.querySelectorAll('.board');
        boards.forEach((board) => {
            const cells = board.querySelectorAll('.grid-cell');
            cells.forEach((cell) => {
                cell.addEventListener('dragover', (e) => dragOver(e, board));
                cell.addEventListener('dragleave', (e) => dragLeave(e, board));
                cell.addEventListener('drop', (e) => drop(e, board));
            });
        });

        const ships = document.querySelectorAll('.ship');
        ships.forEach((ship) => {
            ship.addEventListener('dragstart', dragStart);
            ship.addEventListener('drag', drag);
        });
    };

    function rotateShip(e) {
        if (e.altKey) {
            console.log('Option/Alt key pressed while dragging');
            e.target.setAttribute('data-direction', 'horizontal');
        }

        if (e.ctrlKey) {
            console.log('Control key pressed while dragging');
            e.target.setAttribute('data-direction', 'vertical')
        }

    }

    function drag(event) {
        rotateShip(event)
    }

    function dragStart(e) {
        const shipId = e.target.id;
        if (placedShips[shipId]) {
            placedShips[shipId].forEach((cell) => {
                cell.classList.remove('occupied');
                cell.style.backgroundColor = '';
            });
            placedShips[shipId] = [];
        }
        e.dataTransfer.setData('text/plain', shipId);
    }

    function dragOver(e, board) {
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
            const cell = board.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
            if (cell) {
                cell.style.backgroundColor = 'grey';
                currentHoveredCells.push(cell);
            }
        }
    }

    function dragLeave(e, board) {
        currentHoveredCells.forEach((cell) => (cell.style.backgroundColor = ''));
        currentHoveredCells = [];
    }

    function drop(e, board) {
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
            const cell = board.querySelector(`.grid-cell[data-index="${startIndex + i}"]`);
            if (cell.classList.contains('occupied')) {
                return;
            }
        }

        const newOccupiedCells = [];
        for (let i = 0; i < shipLength; i++) {
            const cell = board.querySelector(`.grid-cell[data-index="${startIndex + i}"]`);
            cell.classList.add('occupied');
            newOccupiedCells.push(cell);
        }
        placedShips[shipId] = newOccupiedCells;
        ship.style.position = 'absolute';
        ship.style.left = `${dropCell.getBoundingClientRect().left}px`;
        ship.style.top = `${dropCell.getBoundingClientRect().top}px`;
        ship.setAttribute('data-placed', 'true');
        ship.setAttribute('data-origin', dropCell.dataset.location); // Corrected attribute name
        //ship.setAttribute('data-direction', 'horizontal'); // Set the direction as needed
    }

    const genCoordinates = (ship, origin, direction) => {
        const coordinates = [];
        for (let i = 0; i < ship.length; i++) {
            if (direction === 'horizontal') {
                coordinates.push([origin[0], origin[1] + i]);
            } else if (direction === 'vertical') {
                coordinates.push([origin[0] + i, origin[1]]);
            }
        }
        return coordinates;
    };

    function saveShipPlacements(ships) {
        for (let i = 0; i < ships.length; i++) {
            const placementShip = ships[i];

            const length = parseInt(placementShip.getAttribute('data-length'));
            const origin = placementShip.getAttribute('data-origin');
            const direction = placementShip.getAttribute('data-direction');

            if (origin && direction) {
                const gamePiece = ship(length);

                const coordinates = genCoordinates(gamePiece, JSON.parse(origin), direction);
                activePlayer.board.placeShip(gamePiece, coordinates);
            } else {
                console.error('Origin or direction attribute is missing');
            }
        }
    }

    function clearShips() {
        document.querySelector('.ship-container').remove();
    }

    function enableLockIn(board) {
        const lockIn = document.getElementById('lock-in');
        lockIn.addEventListener('click', () => {
            const ships = Array.from(document.querySelectorAll('.ship'));
            const anyNonPlacedShip = ships.some(ship => ship.dataset.placed === 'false');
            if (anyNonPlacedShip) {
                alert('Not all ships placed');
            } else {
                saveShipPlacements(ships);
                board.setAttribute('data-setup-complete', 'true');
                board.style.display = 'none'
                clearShips();
                setupPlaceShips();
            }
        });
    }

    function getIncompleteBoard() {
        const boards = document.querySelectorAll('.board');
        const firstIncompleteBoard = Array.from(boards).find((board) => board.dataset.setupComplete === 'false');
        if (firstIncompleteBoard) activePlayer = gameState.getPlayer(firstIncompleteBoard.id);
        return firstIncompleteBoard;
    }

    const setupPlaceShips = () => {
        const firstIncompleteBoard = getIncompleteBoard();
        if (!firstIncompleteBoard) return gameState.startGame(); // no more placements, start the game
        const player = gameState.getPlayer(firstIncompleteBoard.id)
        if (player.computer) {
            player.computer.placeShips()
            firstIncompleteBoard.setAttribute('data-setup-complete', 'true');
            setupPlaceShips();
        } else {
            firstIncompleteBoard.style.display = 'grid';
            webpage.generateShipContainer();
            setupPlacements();
            enableLockIn(firstIncompleteBoard);
        }
    };

    return { setupPlacements, enableLockIn, getIncompleteBoard, setupPlaceShips };
})();

module.exports = shipPlacementHandler;
