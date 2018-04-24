// Canvas html element
const canvas = document.querySelector('.canvas');
canvas.width = 400;
canvas.height = 400;
// object to draw on.
const ctx = canvas.getContext('2d');
// Pixel length of one tetromino square
const squareSize = 10;
// Number of squares in one row
const rowLength = 10;
// Number of squares in one column
const columnLength = 20;
// game play boundaries
// pixels from canvas's left border
const LEFT = 20;
// pixels from canvas's top border
const TOP = 20;
// game width in pixels
const width = squareSize * rowLength;
// game height in pixels
const height = squareSize * columnLength;
// Keyboard ids
const keyLeft = 37;
const keyDowsn = 40;
const keyRight = 39;
// Initial update interval in milliseconds
let updateInterval = 1000;
// add listener for user keyboard input
window.addEventListener('keydown', handleKeyDown);

// Entry point
beginGame();

// The game object
let game = {
  theSquare: new Square(5, 0, 'blue'),
  landedSquares: []
}

// Periodically calls updatedGame() after updateInterval milliseconds. 
function beginGame() {
  setInterval(updateGame, updateInterval);
}

// Lowers the square one squareSize if possible
// otherwise creates new square to lower.
// renders the game.
function updateGame() {
  if (isSpaceBelow(game.theSquare)) {
    game.theSquare.moveDown();
  } else {
    game.landedSquares.push(game.theSquare);
    removeFullRows();
    game.theSquare = new Square(5, 0, 'blue');
  }
  render();
}

// Removes any full rows and then drops any square above.
function removeFullRows() {
  for (let i = columnLength - 1; i >= 0; i--) {
    let squareCountInRow = getSquareCountInRow(i);
    if (squareCountInRow === rowLength) {
      removeSquaresInRow(i);
      dropSquaresAbove(i);
      removeFullRows();
      break;
    }
  }
}

// returns the number of squares at row with y == index
function getSquareCountInRow(index) {
  let count = game.landedSquares.reduce(
    (num, sq) => sq.y === index ? num + 1 : num, 0
  );
  return count;
}

// replaces game.landedSquares with an array of squares
// that do not have y == index;
function removeSquaresInRow(index) {
  let newLandedArray = [];
  game.landedSquares.forEach(
    s => {if(s.y !== index) newLandedArray.push(s)}
  );
  game.landedSquares = newLandedArray;
}

// Adds one to the y value of all squares with y < index
function dropSquaresAbove(index) {
 game.landedSquares.forEach(s => { if (s.y < index) s.y++});
}

// returns true if there is a space below the square.
function isSpaceBelow(square) {
  let isHittingLanded = game.landedSquares.some(
    s => s.y === square.y + 1 && s.x === square.x
  );
  let isHittingBottom = square.y === columnLength - 1;
  return !isHittingLanded && !isHittingBottom;
}

// Refreshes the game image by overwritting previous image
// and drawing new game.
function render() {
  // game area
  // border
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.strokeRect(LEFT, TOP, width, height);
  // background
  ctx.fillStyle = 'white';
  ctx.fillRect(LEFT, TOP, width, height);
  // The next square.
  game.theSquare.draw();
  // the landed squres
  drawLandedSquares();
}

// draws all landed squares
function drawLandedSquares() {
  game.landedSquares.forEach(s => s.draw());
}

// a square
// x: [0 ... rowLength - 1]
// y: [0 ... columnLength - 1]
// color: any css color.
function Square(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.draw = function() {
    ctx.strokeStyle = color;
    ctx.strokeRect(
      LEFT + this.x * squareSize, 
      TOP + this.y * squareSize, 
      squareSize, 
      squareSize
    );
  }
  this.moveLeft = function() {
    if (this.x > 0) {
      this.x--;
    }
  }
  this.moveRight = function() {
    if (this.x < rowLength - 1) {
      this.x++;
    }
  }
  this.moveDown = function() {
    if (this.y < columnLength - 1) {
      this.y++;
    }
  }
}

// User input handler
function handleKeyDown(e) {
  switch (e.keyCode) {
    case keyLeft:
    if (!isSquareOnLeft()) {
      game.theSquare.moveLeft();
      render();
    }
    break;
    case keyDowsn:
    if (isSpaceBelow(game.theSquare)) {
      game.theSquare.moveDown();
      render();
    }
    break;
    case keyRight:
    if (!isSquareOnRight()) {
      game.theSquare.moveRight();
      render();
    }
  } 
}

// return true if there is a landed square on the right of theSquare
function isSquareOnRight() {
  return game.landedSquares.some(
    s => s.y === game.theSquare.y && s.x === game.theSquare.x + 1
  );
}

// return true if there is a landed square on the left of theSquare
function isSquareOnLeft() {
  return game.landedSquares.some(
    s => s.y === game.theSquare.y && s.x === game.theSquare.x - 1
  );
}
