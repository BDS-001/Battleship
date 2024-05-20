const { ship, gameBoard, player, computer } = require('./index');

const test = player('test', computer)
console.log(test)
console.log(test.computer)
console.log(test.computer.genCoordinates(ship(2), [0,0], 'vertical'))

// Creating a player with a computer
const testPlayer = player('Computer', computer);
console.log(testPlayer);