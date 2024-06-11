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

        disableListener(currentPlayer);
        webpage.getPlayerBoard(currentPlayer).style.display = 'none'
        
        enableListener(currentOpponent);
        webpage.getPlayerBoard(currentOpponent).style.display = 'grid'
    };

    const checkWin = (player) => {
        if (player.board.allShipsSunk()) {
            console.log('win');
            disableListener(player);
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

        return res;
    };

    const handleAI = (computerPlayer, currentPlayer) => {
        const { result, move } = computerPlayer.computer.playMove(currentPlayer);
        console.log(result, move)
        webpage.updateCell(currentPlayer, move, result);

        if (result.status === 'retry') {
            return result;
        }

        if (result.sunk) {
            alert(`${currentPlayer.name}'s ship has sunk`)
        }

        if (checkWin(currentPlayer)) {
            return result;
        }

        return result;
    };

    const placeShips = (player) => {
        if (player.computer) return player.computer.placeShips();
        const board = webpage.getPlayerBoard(player);
        board.style.display = 'grid';
    };

    const cellSelect = (event) => {
        if (event.target.matches('.grid-cell')) {
            const location = JSON.parse(event.target.dataset.location);
            const result = updatePlayer(getOpponent(), location);
            if (result.status != 'retry') {
                event.target.style.backgroundColor = result.hit ? 'green' : 'red';
            }
            if (result.sunk) {
                alert(`${currentOpponent.name}'s ship has sunk`)
            }

            if (currentOpponent.computer) {
                handleAI(currentOpponent, currentPlayer);
            } else {
                changeTurn();
            }
        }
    };

    const enableListener = (player) => webpage.getPlayerBoard(player).addEventListener('click', cellSelect);
    const disableListener = (player) => webpage.getPlayerBoard(player).removeEventListener('click', cellSelect);

    function startGame() {
        webpage.removeOccupied()
        webpage.getPlayerBoard(player2).style.display = 'grid'
        enableListener(player2)
    }

    return { getPlayer, updatePlayer, getOpponent, getCurrentPlayer, initializePlayers, placeShips, startGame, enableListener, disableListener };
})();

module.exports = gameState;
