const gameState = require('./modules/gameState');
const menu = require('./modules/menu');
const shipPlacementHandler = require('./modules/shipPlacementHandler');
const webpage = require('./modules/webpage');

const start = () => {
    menu.generateMenu(setMode);
};

const setMode = (mode) => {
    gameState.initializePlayers(mode);
    webpage.createBoard(gameState.getPlayer('player1'));
    webpage.createBoard(gameState.getPlayer('player2'));
    webpage.generateShipContainer();
    setupPlaceShips();
};

const setupPlaceShips = () => {
    const firstIncompleteBoard = shipPlacementHandler.getIncompleteBoard()
    if (!firstIncompleteBoard) return;
    firstIncompleteBoard.style.display = 'grid';
    shipPlacementHandler.generateShips();
    shipPlacementHandler.setupPlacements(firstIncompleteBoard.querySelectorAll('.grid-cell'));
    shipPlacementHandler.enableLockIn();
};

start();

module.exports = { start, setMode };
