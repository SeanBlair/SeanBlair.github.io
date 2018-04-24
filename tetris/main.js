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

// a movable square 
var theSquare = new Square(5, 0, 'blue');
beginGame();

// Periodically calls updatedGame() after updateInterval milliseconds. 
function beginGame() {
  setInterval(updateGame, updateInterval);
}

// Lowers the square one squareSize if possible
// othersise creates new square to lower.
// renders the game.
function updateGame() {
  if (theSquare.y < columnLength - 1) {
    theSquare.moveDown();
  } else {
    theSquare = new Square(5, 0, 'blue');
  }
  render();
}

// Refreshes the game image by overwritting previous image
// and drawing new square.
function render() {
  // game area
  // border
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.strokeRect(LEFT, TOP, width, height);
  // background
  ctx.fillStyle = 'white';
  ctx.fillRect(LEFT, TOP, width, height);
  // The next square.
  theSquare.draw();
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
    ctx.strokeRect(LEFT + this.x * squareSize, TOP + this.y * squareSize, squareSize, squareSize);
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
      theSquare.moveLeft();
      render();
      break;
    case keyDowsn:
      theSquare.moveDown();
      render();
      break;
    case keyRight:
      theSquare.moveRight();
      render();
  } 
}
