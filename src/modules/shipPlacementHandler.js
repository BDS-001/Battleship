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
        const ship = e.target
        if (e.altKey) {
            ship.setAttribute('data-direction', 'horizontal');
        }

        if (e.ctrlKey) {
            ship.setAttribute('data-direction', 'vertical')
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
            let cellIndex = null
            if (ship.getAttribute('data-direction') === 'horizontal') {
                cellIndex = startIndex + i;
                if (cellIndex % 10 < startIndex % 10 || cellIndex >= 100) {
                    break;
                }
            } else if (ship.getAttribute('data-direction') === 'vertical') {
                cellIndex = startIndex + (i * 10);
                if (cellIndex < 0 || cellIndex >= 100) {
                    break;
                }
            }

            const cell = board.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
            if (cell) {
                cell.style.backgroundColor = '#355d69';
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
        const currentDirection = ship.getAttribute('data-direction');

        //check for board overflow
        const shipLength = parseInt(ship.dataset.length);
        if ((currentDirection === 'horizontal' && startIndex % 10 + shipLength > 10) ||
        (currentDirection === 'vertical' && startIndex + (10 * (shipLength - 1)) >= 100) ||
        startIndex < 0 || startIndex > 99) {
        return;
        }
    

        //check if cells are already occupied
        for (let i = 0; i < shipLength; i++) {
            const calculatedIndex = currentDirection === 'horizontal' ? startIndex + i : startIndex + (10 * i)
            const cell = board.querySelector(`.grid-cell[data-index="${calculatedIndex}"]`);
            if (cell.classList.contains('occupied')) {
                return;
            }
        }

        //update new occupied cells
        const newOccupiedCells = [];
        for (let i = 0; i < shipLength; i++) {
            const calculatedIndex = currentDirection === 'horizontal' ? startIndex + i : startIndex + (10 * i)
            const cell = board.querySelector(`.grid-cell[data-index="${calculatedIndex}"]`);
            cell.classList.add('occupied');
            newOccupiedCells.push(cell);
        }

        placedShips[shipId] = newOccupiedCells;

        // Adjust ship position
        const dropCellRect = dropCell.getBoundingClientRect();
        ship.style.position = 'absolute';
        ship.style.left = `${dropCellRect.left}px`;
        ship.style.top = `${dropCellRect.top}px`;

        // Adjust ship dimensions and orientation
        if (currentDirection === 'horizontal') {
            ship.style.width = `${dropCellRect.width * shipLength}px`;
            ship.style.height = `${dropCellRect.height}px`;
        } else if (currentDirection === 'vertical') {
            ship.style.width = `${dropCellRect.width}px`;
            ship.style.height = `${dropCellRect.height * shipLength}px`;
        }


        ship.setAttribute('data-placed', 'true');
        ship.setAttribute('data-origin', dropCell.dataset.location); // Corrected attribute name

        if (ship.classList.contains('horizontal') && currentDirection === 'vertical') {
            ship.classList.remove('horizontal');
            ship.classList.add('vertical');
        } else if (ship.classList.contains('vertical') && currentDirection === 'horizontal') {
            ship.classList.remove('vertical');
            ship.classList.add('horizontal');
        }
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
        const boards = webpage.getBoards()
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
            webpage.updateHeader(player.name)
            webpage.generateShipContainer();
            setupPlacements();
            enableLockIn(firstIncompleteBoard);
        }
    };

    return { setupPlacements, enableLockIn, getIncompleteBoard, setupPlaceShips };
})();

module.exports = shipPlacementHandler;
