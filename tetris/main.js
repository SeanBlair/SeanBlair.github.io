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
const keyF = 70;
const keyD = 68;
// Initial update interval in milliseconds
const initialGameInterval = 500;
let updateInterval = initialGameInterval;
// add listener for user keyboard input
window.addEventListener('keydown', handleKeyDown);
// Start/stop button
const startButton = document.querySelector('.start');
startButton.onclick = startGame;
// Reset button
const resetButton = document.querySelector('.reset');
resetButton.style.visibility = 'hidden';
resetButton.onclick = resetGame;
// The game object
let game = {
  theShape: new TShape(),
  // theSquare: new Square(5, 0, 'blue'),
  landedSquares: []
}

// for stopping setInterval()
let interval;

// Periodically calls updatedGame() after updateInterval milliseconds. 
function startGame() {
  startButton.textContent = 'Pause';
  startButton.onclick = pauseGame;
  resetButton.style.visibility = 'visible';
  interval = setInterval(updateGame, updateInterval);
  render();
}

// pauses the game by stopping the setInterval()
function pauseGame() {
  startButton.textContent = 'Continue';
  startButton.onclick = startGame;
  clearInterval(interval);
}

// resets the game state and starts it
function resetGame() {
  pauseGame();
  game.theShape = new TShape();
  game.landedSquares = [];
  startGame();
}

// Lowers the shape one squareSize if possible
// otherwise creates new shape to lower.
// renders the new game state.
function updateGame() {
  if (game.theShape.isSpaceBelow()) {
    game.theShape.moveDown();
  } else {
    // Appends the landed shape's squares to the landedSquares array
    Array.prototype.push.apply(game.landedSquares, game.theShape.squares);
    removeFullRows();
    game.theShape = new TShape();
  }
  render();
}

// Removes any full rows and then drops any square above.
function removeFullRows() {
  for (let i = columnLength - 1; i >= 0; i--) {
    let squareCountInRow = getSquareCountInRow(i);
    if (squareCountInRow === rowLength) {
      removeSquaresInRow(i);
      // Drops squares above this row
      game.landedSquares.forEach(s => { if (s.y < i) s.y++});
      // Recursive call, ends when no full rows exist.
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
  // The next shape.
  game.theShape.draw();
  // the landed squares
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
    this.x--;
  }
  this.moveRight = function() {
    this.x++;
  }
  this.moveDown = function() {
    this.y++;
  }
  this.canMoveLeft = function() {
    let isSquareOnLeft = game.landedSquares.some(
      s => s.y === this.y && s.x === this.x - 1
    );
    let isAtLeftBorder = this.x === 0;
    return !isSquareOnLeft && !isAtLeftBorder;
  }
  this.canMoveRight = function() {
    let isSquareOnRight = game.landedSquares.some(
      s => s.y === this.y && s.x === this.x + 1
    );
    let isAtRightBorder = this.x === rowLength - 1;
    return !isSquareOnRight && !isAtRightBorder;
  }
  this.canMoveDown = function() {
    let isSquareBellow = game.landedSquares.some(
      s => s.x === this.x && s.y === this.y + 1
    );
    let isAtBottom = this.y === columnLength - 1;
    return !isSquareBellow && !isAtBottom;
  }
}
// Todo refactor to extract all this to a generic Shape object.
function TShape() {
  // the "T" shape's squares as they appear at top of game.
  // In order of column, row.
  this.squares = [
    new Square(5, 0, 'blue'),
    new Square(4, 1, 'blue'),
    new Square(5, 1, 'blue'),
    new Square(6, 1, 'blue')
  ];
  // a 2D array to facilitate rotation of the shape
  this.squares2D = [[undefined, this.squares[0], undefined],
                  [this.squares[1], this.squares[2], this.squares[3]],
                  [undefined, undefined, undefined]];

  // mutates this shape's squares' x and y coords
  // to rotate the shape by 90 deg.
  this.rotate = function(direction = 'clockwise') {
    let rotated = [[,,,],[,,,],[,,,]];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // current square to move
        let sq = this.squares2D[i][j];
        // Mutate the squares x and y coords to rotate the entire shape
        // Place the mutated square in corresponding place in new matrix.
        if (direction === 'clockwise') {
          if (sq) {
            sq.x += 2 - j - i;
            sq.y += j - i;
          }
          rotated[j][2 - i] = sq;
        } else if (direction === 'counterClockWise') {
          if (sq) {
            sq.x += 0 - j + i;
            sq.y += 2 - (j + i);
          }
          rotated[2 - j][0 + i] = sq;
        }
      }
    }
    // replace old matrix with the rotated one.
    this.squares2D = rotated;
  }
  this.draw = function() {
    this.squares.forEach(s => s.draw());
  };
  this.moveLeft = function() {
    this.squares.forEach(s => s.moveLeft());
  };
  this.moveRight = function() {
    this.squares.forEach(s => s.moveRight());
  };
  this.moveDown = function() {
    this.squares.forEach(s => s.moveDown());
  };
  this.isSpaceOnLeft = function() {
    return this.squares.every(s => s.canMoveLeft());
  };
  this.isSpaceOnRight = function() {
    return this.squares.every(s => s.canMoveRight());
  };
  this.isSpaceBelow = function() {
    return this.squares.every(s => s.canMoveDown());
  };
}

// User input handler
function handleKeyDown(e) {
  switch (e.keyCode) {
    case keyLeft:
    if (game.theShape.isSpaceOnLeft()) {
      game.theShape.moveLeft();
      render();
    }
    break;
    case keyDowsn:
    if (game.theShape.isSpaceBelow()) {
      game.theShape.moveDown();
      render();
    }
    break;
    case keyRight:
    if (game.theShape.isSpaceOnRight()) {
      game.theShape.moveRight();
      render();
    }
    break;
    case keyF:
    game.theShape.rotate();
    render();
    break;
    case keyD:
    game.theShape.rotate('counterClockWise');
    render();
    break;
  } 
}
