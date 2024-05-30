const { player, computer } = require('../index');
const webpage = require('./webpage');

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

module.exports = gameState;
