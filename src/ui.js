const { ship, gameBoard, player } = require('./index');

const webpage = (() => {
    const player1 = player('foo')
    const player2 = player('bar')

    const createBoard = (player) => {
        // Create the main board div
        const board = document.createElement('div');
        board.className = 'board';
        board.style.display = 'grid';
        board.id = player.name
        board.style.gridTemplateColumns = 'repeat(10, 40px)';  // Sets the layout to 10 columns
        board.style.gridTemplateRows = 'repeat(10, 40px)';     // Sets the layout to 10 rows

        // Loop to create each cell in the grid
        let row = 0
        let col = 0
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            const location = [row, col]
            if (col >= 9) {
                row++;
                col = 0
            } else {
                col++;
            }
            cell.dataset.location = JSON.stringify(location);
            cell.className = 'grid-cell';
            cell.style.border = '1px solid black';
            board.appendChild(cell);
        }

        // Append the board to the body of the page
        document.body.appendChild(board);
    }

    const updateBoard = (player) => {
        const board = document.querySelector(`#${player.name}`)
        const cells = board.querySelectorAll('.grid-cell')
        console.log(cells)
        for (let row = 0; row <= 9; row++) {
            for (let col = 0; col <= 9; col++) {
                console.log((row * 10) + col)
                if (player.board.board[row][col].ship) cells[(row * 10) + col].innerHTML = 1
                
            }
            
        }
    }

    createBoard(player1)
    createBoard(player2)

    //test
    player1.board.placeShip(ship(3), [[0, 0], [0, 1], [0, 2]]);
    player1.board.placeShip(ship(2), [[1, 0], [1, 1]]);
    updateBoard(player1)
})();