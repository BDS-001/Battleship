# Battleship Game

A classic implementation of the Battleship board game built with JavaScript. This project uses a modular design pattern and follows Test-Driven Development principles.

## Features

- Two game modes: Solo (vs Computer) and VS (2-player)
- Drag and drop ship placement system
- Ships can be rotated during placement (using Alt and Ctrl keys)
- Turn-based gameplay with a "pass device" screen in 2-player mode
- Smart AI that targets adjacent squares after getting a hit
- Minimap display to track your shots on the opponent's board
- Victory screen when a player wins

## Technologies Used

- Vanilla JavaScript with modular pattern
- Webpack for bundling
- Jest for unit testing
- HTML5 and CSS3 for the UI
- HTML5 Drag and Drop API

## Project Structure

- `index.js` - Core game logic (ships, gameboard, players)
- `engine.js` - Game initialization and coordination
- `modules/`
  - `gameState.js` - Manages game state and turn logic
  - `menu.js` - Menu interface implementation
  - `shipPlacementHandler.js` - Handles ship placement mechanics
  - `webpage.js` - DOM manipulation and UI rendering

## How to Play

1. Select a game mode (Solo or VS)
2. Place your ships on the board:
   - Drag and drop ships onto your board
   - Press Alt to rotate horizontally
   - Press Ctrl to rotate vertically
3. Click "LOCK IN" when you're happy with your ship placement
4. In 2-player mode, the second player then places their ships
5. Take turns attacking the opponent's board by clicking on grid cells
6. A hit is shown in green, a miss in red
7. The game ends when all ships of one player are sunk

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/battleship.git
cd battleship
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm start
```

4. Build for production:
```
npm run build
```

5. Run tests:
```
npm test
```

## Testing

This project was developed using Test-Driven Development (TDD) with Jest. The test suite covers:

- Ship creation and hit functionality
- Gameboard placement and attack logic
- Player functionality
- Computer AI decision making

Run the tests with:
```
npm test
```

## Implementation Highlights

### Ship Factory
Creates ship objects with properties for length, hits, and sunk status.

### Gameboard Factory
Manages the game board, ship placement, and attack tracking.

### Player Factory
Handles player actions and differentiates between human and computer players.

### Computer AI
The computer AI features a smart targeting system that:
1. Makes random moves until it gets a hit
2. Once a hit is registered, tries adjacent squares in all directions
3. When it identifies the ship's orientation, continues attacking in that direction
4. After sinking a ship, returns to making random moves

### Drag and Drop Ship Placement
Players can visually place their ships by dragging and dropping them onto the game board, with visual feedback for valid and invalid placements.
