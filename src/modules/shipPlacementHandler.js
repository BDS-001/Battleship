const { ship } = require('../index');
const gameState = require('./gameState');

const shipPlacementHandler = (() => {
    let currentHoveredCells = [];
    let placedShips = {};
    let activePlayer = null;

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
            shipDiv.setAttribute('data-origin', 'none');
            shipDiv.setAttribute('data-direction', 'horizontal');
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
        });
    };

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

        const newOccupiedCells = [];
        for (let i = 0; i < shipLength; i++) {
            const cell = document.querySelector(`.grid-cell[data-index="${startIndex + i}"]`);
            cell.classList.add('occupied');
            newOccupiedCells.push(cell);
        }
        placedShips[shipId] = newOccupiedCells;
        ship.style.position = 'absolute';
        ship.style.left = `${dropCell.getBoundingClientRect().left}px`;
        ship.style.top = `${dropCell.getBoundingClientRect().top}px`;
        ship.setAttribute('data-placed', 'true');
        ship.setAttribute('data-origin', dropCell.dataset.location); // Corrected attribute name
        ship.setAttribute('data-direction', 'horizontal'); // Set the direction as needed
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
            console.log(placementShip); // Log the whole element to check the attributes
    
            // Ensure the data attributes are being accessed correctly
            const length = parseInt(placementShip.getAttribute('data-length'));
            const origin = placementShip.getAttribute('data-origin'); // Use getAttribute for debugging
            const direction = placementShip.getAttribute('data-direction'); // Use getAttribute for debugging
    
            if (origin && direction) {
                const gamePiece = ship(length);
                console.log(gamePiece, JSON.parse(origin), direction);
    
                const coordinates = genCoordinates(gamePiece, JSON.parse(origin), direction);
                activePlayer.board.placeShip(gamePiece, coordinates);
            } else {
                console.error('Origin or direction attribute is missing');
            }
        }
        console.log(activePlayer.board);
    }

    function enableLockIn() {
        const lockIn = document.getElementById('lock-in');
        lockIn.addEventListener('click', () => {
            const ships = Array.from(document.querySelectorAll('.ship'));
            const anyNonPlacedShip = ships.some(ship => ship.dataset.placed === 'false');
            if (anyNonPlacedShip) {
                alert('Not all ships placed');
            } else {
                saveShipPlacements(ships);
            }
        });
    }

    function getIncompleteBoard() {
        const boards = document.querySelectorAll('.board');
        const firstIncompleteBoard = Array.from(boards).find((board) => board.dataset.setupComplete === 'false');
        if (firstIncompleteBoard) activePlayer = gameState.getPlayer(firstIncompleteBoard.id);
        return firstIncompleteBoard;
    }

    return { generateShips, setupPlacements, enableLockIn, getIncompleteBoard };
})();

module.exports = shipPlacementHandler;
