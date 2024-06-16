const gameState = require('./modules/gameState');
const menu = require('./modules/menu');
const shipPlacementHandler = require('./modules/shipPlacementHandler');
const webpage = require('./modules/webpage');

const start = () => {
    menu.generateMenu(setMode);
};

const setMode = (mode) => {
    gameState.initializePlayers(mode);
    webpage.genHeader()
    webpage.createBoard(gameState.getPlayer('player1'));
    webpage.createBoard(gameState.getPlayer('player2'));
    shipPlacementHandler.setupPlaceShips();
};

start();

module.exports = { start, setMode };
