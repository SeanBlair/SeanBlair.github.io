// Canvas html element
const canvas = document.querySelector('.canvas');
canvas.width = 300;
canvas.height = 300;
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
const initialGameInterval = 1000;
let updateInterval;
// add listener for user keyboard input
window.addEventListener('keydown', handleKeyDown);
// Start/stop button
const startButton = document.querySelector('.start');
// Reset button
const resetButton = document.querySelector('.reset');
// The game object
let game = {
  theShape: undefined,
  landedSquares: [],
  state: undefined,
  // initiating, starting, pausing, dropping, moving left,
  // moving right, moving down, rotating clockwise,
  // rotating counter clockwise. 
  states: {
    initiating: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in initiating.enter()');
      },
      execute: function() {
        console.log('in initiating.execute()');
        initiateGame();
      },
      initiate: function() {
        console.log('already initiated');
      },
      start: function() {
        this.target.changeState(this.target.states.starting);
      },
      pause: function() {
      },
      drop: function() {
      },
      moveLeft: function() {
      },
      moveRight: function() {
      },
      moveDown: function() {
      },
      rotateClockWise: function() {
      },
      rotateCounterClock: function() {
      },
      exit: function() {
        console.log('in initiating.exit()');
      }
    },
    starting: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in starting.enter()');
      },
      execute: function() {
        console.log('in starting.execute()')
        startGame();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      start: function() {
        console.log('already in starting')
      },
      drop: function() {
        this.target.changeState(this.target.states.dropping);
      },
      moveLeft: function() {
        this.target.changeState(this.target.states.movingLeft);
      },
      moveRight: function() {
        this.target.changeState(this.target.states.movingRight);
      },
      moveDown: function() {
        this.target.changeState(this.target.states.movingDown);
      },
      exit: function() {
        console.log('in starting.exit()');
      }
    },
    pausing: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in pausing.enter()');
      },
      execute: function() {
        console.log('in pausing.execute()');
        pauseGame();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      start: function() {
        this.target.changeState(this.target.states.starting);
      },
      pause: function() {
        console.log('already paused');
      },
      drop: function() {
      },
      moveLeft: function() {
      },
      moveRight: function() {
      },
      moveDown: function() {
      },
      rotateClockWise: function() {
      },
      rotateCounterClock: function() {
      },
      exit: function() {
        console.log('in pausing.exit()');
      }
    },
    dropping: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in dropping.enter()');
      },
      execute: function() {
        console.log('in dropping.execute()');
        drop();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      pause: function() {
        this.target.changeState(this.target.states.pausing);
      },
      drop: function() {
        console.log('already dropping');
        drop();
      },
      moveLeft: function() {
        this.target.changeState(this.target.states.movingLeft);
      },
      moveRight: function() {
        this.target.changeState(this.target.states.movingRight);
      },
      moveDown: function() {
        this.target.changeState(this.target.states.movingDown);
      },
      rotateClockWise: function() {
        this.target.changeState(this.target.states.rotatingClockWise);
      },
      rotateCounterClock: function() {
        this.target.changeState(this.target.states.rotatingCounterClock);
      },
      exit: function() {
        console.log('in dropping.exit()');
      }
    },
    movingLeft: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in movingLeft.enter()');
      },
      execute: function() {
        console.log('in movingLeft.execute()');
        moveLeft();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      pause: function() {
        this.target.changeState(this.target.states.pausing);
      },
      drop: function() {
        this.target.changeState(this.target.states.dropping);
      },
      moveLeft: function() {
        console.log('already moving left');
        moveLeft();
      },
      moveRight: function() {
        this.target.changeState(this.target.states.movingRight);
      },
      moveDown: function() {
        this.target.changeState(this.target.states.movingDown);
      },
      rotateClockWise: function() {
        this.target.changeState(this.target.states.rotatingClockWise);
      },
      rotateCounterClock: function() {
        this.target.changeState(this.target.states.rotatingCounterClock);
      },
      exit: function() {
        console.log('in movingLeft.exit()');
      }
    },
    movingRight: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in movingRight.enter()');
      },
      execute: function() {
        console.log('in movingRight.execute()');
        moveRight();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      pause: function() {
        this.target.changeState(this.target.states.pausing);
      },
      drop: function() {
        this.target.changeState(this.target.states.dropping);
      },
      moveLeft: function() {
        this.target.changeState(this.target.states.movingLeft);
      },
      moveRight: function() {
        console.log('already moving right');
        moveRight();
      },
      moveDown: function() {
        this.target.changeState(this.target.states.movingDown);
      },
      rotateClockWise: function() {
        this.target.changeState(this.target.states.rotatingClockWise);
      },
      rotateCounterClock: function() {
        this.target.changeState(this.target.states.rotatingCounterClock);
      },
      exit: function() {
        console.log('in movingLeft.exit()');
      }
    },
    movingDown: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in movingDown.enter()');
      },
      execute: function() {
        console.log('in movingDown.execute()');
        moveDown();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      pause: function() {
        this.target.changeState(this.target.states.pausing);
      },
      drop: function() {
        this.target.changeState(this.target.states.dropping);
      },
      moveLeft: function() {
        this.target.changeState(this.target.states.movingLeft);
      },
      moveRight: function() {
        this.target.changeState(this.target.states.movingRight);
      },
      moveDown: function() {
        console.log('already moving down');
        moveDown();
      },
      rotateClockWise: function() {
        this.target.changeState(this.target.states.rotatingClockWise);
      },
      rotateCounterClock: function() {
        this.target.changeState(this.target.states.rotatingCounterClock);
      },
      exit: function() {
        console.log('in movingDown.exit()');
      }
    },
    rotatingClockWise: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in rotatingClockwise.enter()');
      },
      execute: function() {
        console.log('in rotatingClockwise.execute()');
        rotateClockWise();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      pause: function() {
        this.target.changeState(this.target.states.pausing);
      },
      drop: function() {
        this.target.changeState(this.target.states.dropping);
      },
      moveLeft: function() {
        this.target.changeState(this.target.states.movingLeft);
      },
      moveRight: function() {
        this.target.changeState(this.target.states.movingRight);
      },
      moveDown: function() {
        this.target.changeState(this.target.states.movingDown);
      },
      rotateClockWise: function() {
        console.log('already rotating clockwise');
        rotateClockWise();
      },
      rotateCounterClock: function() {
        this.target.changeState(this.target.states.rotatingCounterClock);
      },
      exit: function() {
        console.log('in rotatingClockwise.exit()');
      }
    },
    rotatingCounterClock: {
      initialize: function(target) {
        this.target = target;
      },
      enter: function() {
        console.log('in rotatingCounterClock.enter()');
      },
      execute: function() {
        console.log('in rotatingCounterClock.execute()');
        rotateCounterClockwise();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      pause: function() {
        this.target.changeState(this.target.states.pausing);
      },
      drop: function() {
        this.target.changeState(this.target.states.dropping);
      },
      moveLeft: function() {
        this.target.changeState(this.target.states.movingLeft);
      },
      moveRight: function() {
        this.target.changeState(this.target.states.movingRight);
      },
      moveDown: function() {
        this.target.changeState(this.target.states.movingDown);
      },
      rotateClockWise: function() {
        this.target.changeState(this.target.states.rotatingClockWise);
      },
      rotateCounterClock: function() {
        console.log('already rotating counter clockwise');
        rotateCounterClockwise();
      },
      exit: function() {
        console.log('in rotatingCounterClock.exit()');
      }
    }
  },
  initialize: function() {
    this.states.initiating.initialize(this);
    this.states.starting.initialize(this);
    this.states.pausing.initialize(this);
    this.states.dropping.initialize(this);
    this.states.movingLeft.initialize(this);
    this.states.movingRight.initialize(this);
    this.states.movingDown.initialize(this);
    this.states.rotatingClockWise.initialize(this);
    this.states.rotatingCounterClock.initialize(this);
    this.state = this.states.initiating;
  },
  initiate: function() {
    this.state.initiate();
  },
  start: function() {
    this.state.start();
  },
  pause: function() {
    this.state.pause();
  },
  drop: function() {
    this.state.drop();
  },
  moveLeft: function() {
    this.state.moveLeft();
  },
  moveRight: function() {
    this.state.moveRight();
  },
  moveDown: function() {
    this.state.moveDown();
  },
  rotateClockWise: function() {
    this.state.rotateClockWise();
  },
  rotateCounterClock: function() {
    this.state.rotateCounterClock();
  },
  changeState: function(state) {
    if (this.state !== state) {
      this.state.exit();
      this.state = state;
      this.state.enter();
      this.state.execute();
    }
  }
}

// for stopping setInterval()
let interval;
// initialize game object.
game.initialize();
// initiate game state.
initiateGame();

// initiates the state for a new game.
function initiateGame() {
  clearInterval(interval);
  game.theShape = undefined;
  game.landedSquares = [];
  updateInterval = initialGameInterval;
  startButton.textContent = 'Start';
  startButton.onclick = (() => game.start());
  resetButton.style.visibility = 'hidden';
  resetButton.onclick = (() => game.initiate());
  render();
}

// Starts setInterval() with current value of updateInterval
// and changes start button to pause button.
function startGame() {
  startButton.textContent = 'Pause';
  startButton.onclick = (() => game.pause());
  resetButton.style.visibility = 'visible';
  interval = setInterval(() => game.drop(), updateInterval);
  render();
}

// pauses the game by stopping the setInterval()
function pauseGame() {
  startButton.textContent = 'Continue';
  startButton.onclick = (() => game.start());
  clearInterval(interval);
}

// if space on left, moves shape left one space and renders the game;
function moveLeft() {
  if (game.theShape.isSpaceOnLeft()) {
    game.theShape.moveLeft();
    render();
  }
}

// if space on right, moves shape right one space and renders the game;
function moveRight() {
  if (game.theShape.isSpaceOnRight()) {
    game.theShape.moveRight();
    render();
  }
}

// if space below, moves shape down one space and renders the game;
function moveDown() {
  if (game.theShape.isSpaceBelow()) {
    game.theShape.moveDown();
    render();
  }
}

// If space to rotate clockwise, rotates the shape. Renders the game
function rotateClockWise() {
  game.theShape.rotate('clockwise');
  render();
}

// If space to rotate counter clockwise, rotates the shape. Renders the game
function rotateCounterClockwise() {
  game.theShape.rotate('counterClockWise');
  render();
}

// Lowers the shape one squareSize if possible
// otherwise creates new shape to lower.
// renders the new game state.
function drop() {
  // Adds a shape on first call
  if (!game.theShape) {
    game.theShape = new TShape();
    // is exists and possible drops shape one space
  } else if (game.theShape.isSpaceBelow()) {
    game.theShape.moveDown();
  } else {
    // Appends the landed shape's squares to the landedSquares array
    Array.prototype.push.apply(game.landedSquares, game.theShape.squares);
    removeFullRows();
    // adds new shape to game
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
  ctx.fillStyle = 'lightblue';
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
    ctx.fillStyle = color;
    ctx.fillRect(
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

  // If there is space to rotate 90 degrees, rotates this shape 
  // by rotating the contents of this.squares2D, and mutating the 
  // x and y coords of the shape's squares.                
  this.rotate = function(direction='clockwise') {
    // make a deep copy to check if rotation is possible
    let squares2DClone = JSON.parse(JSON.stringify(this.squares2D)); 
    squares2DClone = getRotated(squares2DClone);   
    if (isSpaceToRotate(squares2DClone)) {
      this.squares2D = getRotated(this.squares2D);
    }
    // returns shape2D rotated in it's matrix, and
    // with it's squares mutated to implement the rotation.
    function getRotated(shape2D) {
      // a container of the correct size.
      let rotated = [[,,,],[,,,],[,,,]];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // current square to move
          let sq = shape2D[i][j];
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
      return rotated;
    }
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

// return true is no squares in rotated2D share both x and y coords with
// any landedSquare.
function isSpaceToRotate(rotated2D) {
  function hasSpace(sq) {
    let isSpaceFromLanded = game.landedSquares.every(
      // no landedSquare shares both x and y coords with sq
      ls => !(ls.x === sq.x && ls.y === sq.y)
    );
    let isInBounds = sq.x >= 0 && sq.x < rowLength && sq.y < columnLength - 1;
    return isSpaceFromLanded && isInBounds;
  };
  return rotated2D.every(a => a.every(s => s ? hasSpace(s) : true));
}

// User input handler
function handleKeyDown(e) {
  switch (e.keyCode) {
    case keyLeft:
    game.moveLeft();
    break;
    case keyDowsn:
    game.moveDown();
    break;
    case keyRight:
    game.moveRight();
    break;
    case keyF:
    game.rotateClockWise();
    break;
    case keyD:
    game.rotateCounterClock();
  } 
}
