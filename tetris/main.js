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
// const keyF = 70;
// const keyD = 68;
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
  theShape: new TShape(),
  // theSquare: new Square(5, 0, 'blue'),
  landedSquares: [],
  
  state: undefined,

  // initiating, pausing, dropping, moving left,
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
        this.target.changeState(this.target.states.rotatingCounterClock);
      },
      exit: function() {
        console.log('in initiating.exit()');
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
      pause: function() {
        console.log('already paused');
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
        this.target.changeState(this.target.states.rotatingCounterClock);
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
        // called when transitioning to dropping state
        // calls drop(); Test this logic when receiving
        // many state change requests...
        startGame();
      },
      initiate: function() {
        this.target.changeState(this.target.states.initiating);
      },
      pause: function() {
        this.target.changeState(this.target.states.pausing);
      },
      drop: function() {
        console.log('already dropping');
        // called when already in dropping state by
        // setInterval()
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
        clearInterval(interval);
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
      },
      exit: function() {
        console.log('in rotatingCounterClock.exit()');
      }
    }
  },
  initialize: function() {
    this.states.initiating.initialize(this);
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
game.initialize();
initiateGame();
// called on initiating.execute()
function initiateGame() {
  game.theShape = new TShape();
  game.landedSquares = [];
  updateInterval = initialGameInterval;
  startButton.textContent = 'Start';
  startButton.onclick = (() => game.drop());
  resetButton.style.visibility = 'hidden';
  resetButton.onclick = (() => game.initiate());
  render();
}

// Periodically calls updatedGame() after updateInterval milliseconds. 
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
  startButton.onclick = (() => game.drop());
  // clearInterval(interval);
}

// resets the game state and starts it
// function resetGame() {
//   pauseGame();
//   game.theShape = new TShape();
//   game.landedSquares = [];
//   startGame();
// }

// Lowers the shape one squareSize if possible
// otherwise creates new shape to lower.
// renders the new game state.
function drop() {
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
  // this.squares2D = [[undefined, this.squares[0], undefined],
  //                 [this.squares[1], this.squares[2], this.squares[3]],
  //                 [undefined, undefined, undefined]];

  // mutates this shape's squares' x and y coords
  // to rotate the shape by 90 deg.
  // this.rotate = function(direction = 'clockwise') {
  //   // Deep copies of the 2d matrix.
  //   // Need to preserve the original in case the rotation conflicts with game.
  //   let squares2DClone = JSON.parse(JSON.stringify(this.squares2D));
  //   let rotated = JSON.parse(JSON.stringify(squares2DClone));
  //   // make a squares deep copy.
  //   let squaresClone = [];
  //   squares2DClone.forEach(a => a.forEach(s => {if (s) squaresClone.push(s)}));
  //   for (let i = 0; i < 3; i++) {
  //     for (let j = 0; j < 3; j++) {
  //       // current square to move
  //       // let sq = this.squares2D[i][j];
  //       let sq = squares2DClone[i][j];
  //       // Mutate the squares x and y coords to rotate the entire shape
  //       // Place the mutated square in corresponding place in new matrix.
  //       if (direction === 'clockwise') {
  //         if (sq) {
  //           sq.x += 2 - j - i;
  //           sq.y += j - i;
  //         }
  //         rotated[j][2 - i] = sq;
  //       } else if (direction === 'counterClockWise') {
  //         if (sq) {
  //           sq.x += 0 - j + i;
  //           sq.y += 2 - (j + i);
  //         }
  //         rotated[2 - j][0 + i] = sq;
  //       }
  //     }
  //   }
  //   // only use rotated if it fits in game state.
  //   if (isSpaceToRotate(rotated)) {
  //     // replace old matrix with the rotated one.
  //     this.squares2D = rotated;
  //     this.squares = squaresClone;
  //   }
  // }


  // Need to make rotate and update mutually exclusive. They share
  // state (game.theShape) and when both are called simultaneously,
  // it breaks.
  // need to somehow make calls to update() wait for rotate() to finish?

  // Rotate is tricky (need to disallow if rotating conflicts with borders
// or landed squares), but need to rotate in order to check this.
// Maybe rotate a copy and check if hits anything? if ok, then rotate the
// actual shape? Still need update() to wait for rotate to be finished.
//
  // this.rotate = function(direction = 'clockwise', firstTry = true) {

  //   let rotated = [[,,,],[,,,],[,,,]];
 
  //   for (let i = 0; i < 3; i++) {
  //     for (let j = 0; j < 3; j++) {
  //       // current square to move
  //       let sq = this.squares2D[i][j];
  //       // Mutate the squares x and y coords to rotate the entire shape
  //       // Place the mutated square in corresponding place in new matrix.
  //       if (direction === 'clockwise') {
  //         if (sq) {
  //           sq.x += 2 - j - i;
  //           sq.y += j - i;
  //         }
  //         rotated[j][2 - i] = sq;
  //       } else if (direction === 'counterClockWise') {
  //         if (sq) {
  //           sq.x += 0 - j + i;
  //           sq.y += 2 - (j + i);
  //         }
  //         rotated[2 - j][0 + i] = sq;
  //       }
  //     }
  //   }
  //   if (!firstTry) {
  //     return;
  //   }
  //   if (!isSpaceToRotate(rotated)) {
  //     // rotate back.
  //     if (direction === 'clockwise') {
  //       this.rotate('counterClockWise', false);
  //     } else {
  //       this.rotate('clockwise', false);
  //     }
  //   } else {
  //     // replace 2D matrix;
  //     this.squares2D = rotated;
  //   }
  // }


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

// function isSpaceToRotate(rotated2D) {
//   function hasSpace(sq) {
//     let isSpaceFromLanded = game.landedSquares.every(
//       ls => ls.x !== sq.x && ls.y !== sq.y
//     );
//     let isInBounds = sq.x >= 0 && sq.x < rowLength && sq.y < columnLength - 1;
//     return isSpaceFromLanded && isInBounds;
//   };
//   return rotated2D.every(a => a.every(s => s ? hasSpace(s) : true));
// }

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
    // case keyF:
    // game.theShape.rotate();
    // render();
    // break;
    // case keyD:
    // game.theShape.rotate('counterClockWise');
    // render();
    // break;
  } 
}
