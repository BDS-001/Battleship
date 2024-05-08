const { ship, gameBoard, player } = require('./index');

const webpage = (() => {
    const player1 = player()
    const player2 = player()

    const createBoard = () => {
        // Create the main board div
        const board = document.createElement('div');
        board.id = 'board';
        board.style.display = 'grid';
        board.style.gridTemplateColumns = 'repeat(10, 30px)';  // Sets the layout to 10 columns
        board.style.gridTemplateRows = 'repeat(10, 30px)';     // Sets the layout to 10 rows

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
            cell.style.width = '1fr';  // Set the width of each cell
            cell.style.height = '1fr';  // Set the height of each cell
            cell.style.border = '1px solid black';
            board.appendChild(cell);
        }

        // Append the board to the body of the page
        document.body.appendChild(board);
    }

    createBoard()
    createBoard()
})();