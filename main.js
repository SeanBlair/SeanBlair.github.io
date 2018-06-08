import * as tStates from "./tetris-game-states.js";
import * as tShapes from "./tetris-shapes.js";

//=================================== Game constants ==========================

// Pixel length of one tetromino square
const squareSize = 15;
// Number of squares in one row
const rowLength = 10;
// Number of squares in one column
const columnLength = 20;
// game play boundaries
// pixels from canvas's left border
const LEFT = 0;
// pixels from canvas's top border
const TOP = 0;
// game width in pixels
const width = squareSize * rowLength;
// game height in pixels
const height = squareSize * columnLength;
// Keyboard ids
const keyD = 68;
const keyF = 70;
const keyJ = 74;
const keyK = 75;
const keyL = 76;
// add listener for user keyboard input
window.addEventListener("keydown", handleKeyDown);
// Start/stop button
const startButton = document.querySelector(".start");
// Reset button
const resetButton = document.querySelector(".reset");
// Auto play toggle button
const autoPlayButton = document.querySelector(".auto-play");
// For displaying current game level
const levelLabel = document.querySelector(".level");
// For displaying current line count
const linesLabel = document.querySelector(".lines");
// For controlling the visibility of the initial level control.
const initialLevelDiv = document.querySelector(".initial-level");
// For getting the starting level selected by the user.
const selectedStartLevel = document.querySelector("select");
// Canvas html element
const canvas = document.querySelector(".canvas");
canvas.width = width;
canvas.height = height;
// object to draw on.
const ctx = canvas.getContext("2d");

//================================== Game variables ===========================

// current drop interval
let dropInterval;
// For storing lines finished.
let lineCount;
// For storing the user selected start level.
let initialLevel;
// For storing current level.
let currentLevel;
// For storing previous shape id.
let previousRandomId;

// The game object
let game = {
  // the current tetromino.
  theShape: undefined,
  // the squares of landed shapes.
  landedSquares: [],
  // current game state
  state: undefined,
  // Uses the State Pattern to share state with arbitrary
  // user input and the periodic game update interval.
  // all states.
  states: {
    initiating: new tStates.Initiating(initiateGame),
    starting: new tStates.Starting(startGame),
    pausing: new tStates.Pausing(pauseGame),
    dropping: new tStates.Dropping(drop),
    movingLeft: new tStates.MovingLeft(moveLeft),
    movingRight: new tStates.MovingRight(moveRight),
    movingDown: new tStates.MovingDown(moveDown),
    rotatingClockWise: new tStates.RotatingClockWise(rotateClockWise),
    rotatingCounterClock: new tStates.RotatingCounterClock(
      rotateCounterClockWise
    ),
    speedingUp: new tStates.SpeedingUp(speedUp)
  },
  // initialize the state objects
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
    this.states.speedingUp.initialize(this);
    // Set initial state
    this.state = this.states.initiating;
  },
  // All game actions.
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
  speedUp: function() {
    this.state.speedUp();
  },
  changeState: function(state) {
    if (this.state !== state) {
      this.state = state;
      this.state.execute();
    }
  }
};
// for stopping setInterval()
let interval;
// For disabling keypad input when game is stopped.
let isGameStopped;
// For auto play flag
let isAutoPlay = false;
autoPlayButton.onclick = toggleAutoPlay;

// initialize game object.
game.initialize();
// Game entry point, set initial game state.
initiateGame();

//======================================= Game logic ==========================

// initiates the state for a new game.
function initiateGame() {
  clearInterval(interval);
  lineCount = 0;
  currentLevel = 0;
  initialLevel = 0;
  adjustDropInterval();
  // No previous shape at start.
  previousRandomId = -1;
  levelLabel.style.visibility = "hidden";
  linesLabel.style.visibility = "hidden";
  game.theShape = undefined;
  game.landedSquares = [];
  startButton.textContent = "Start";
  startButton.onclick = () => game.start();
  resetButton.style.display = "none";
  initialLevelDiv.style.visibility = "visible";
  selectedStartLevel.value = 0;
  selectedStartLevel.onchange = () => changeStartLevel();
  resetButton.onclick = () => game.initiate();
  render();
}

// called when user changes the default start level of 0.
function changeStartLevel() {
  currentLevel = Number(selectedStartLevel.value);
  initialLevel = currentLevel;
  adjustDropInterval();
}

// Starts setInterval() with current value of updateInterval
// and changes start button to pause button.
function startGame() {
  isGameStopped = false;
  startButton.textContent = "Pause";
  startButton.onclick = () => game.pause();
  resetButton.style.display = "inline";
  initialLevelDiv.style.visibility = "hidden";
  levelLabel.textContent = `Level: ${currentLevel}`;
  levelLabel.style.visibility = "visible";
  linesLabel.textContent = `Total Lines: ${lineCount}`;
  linesLabel.style.visibility = "visible";
  interval = setInterval(() => game.drop(), dropInterval);
  render();
}

// pauses the game by stopping the setInterval()
function pauseGame() {
  isGameStopped = true;
  startButton.textContent = "Continue";
  startButton.onclick = () => game.start();
  clearInterval(interval);
}

// Toggles the autoplay global flag and the autoPlay button's text.
function toggleAutoPlay() {
  isAutoPlay = !isAutoPlay;
  autoPlayButton.textContent = isAutoPlay
    ? "Stop Auto Play"
    : "Start Auto Play";
}

//========================================== Shape movement ===================

// if space on left, moves shape left one space and renders the game;
function moveLeft() {
  if (game.theShape.squares.every(s => isSpaceOnLeft(s))) {
    game.theShape.moveLeft();
    render();
  }
}

// if space on right, moves shape right one space and renders the game;
function moveRight() {
  if (game.theShape.squares.every(s => isSpaceOnRight(s))) {
    game.theShape.moveRight();
    render();
  }
}

// if space below, moves shape down one space and renders the game;
function moveDown() {
  if (game.theShape.squares.every(s => isSpaceBelow(s))) {
    game.theShape.moveDown();
    render();
  }
}

// If space to rotate clockwise, rotates the shape and renders the game.
function rotateClockWise() {
  game.theShape.rotate("clockWise");
  if (game.theShape.squares.every(s => isInAvailableSpace(s))) {
    render();
  } else {
    game.theShape.rotate("counterClockWise");
  }
}

// If space to rotate counter clockwise, rotates the shape and renders the game
function rotateCounterClockWise() {
  game.theShape.rotate("counterClockWise");
  if (game.theShape.squares.every(s => isInAvailableSpace(s))) {
    render();
  } else {
    game.theShape.rotate("clockWise");
  }
}

// Lowers the shape one squareSize if possible
// otherwise creates new shape to lower.
// renders the new game state.
function drop() {
  // Adds a shape on first call
  if (!game.theShape) {
    game.theShape = getNextRandomShape();
    // is exists and possible, drops the shape one space
  } else if (game.theShape.squares.every(s => isSpaceBelow(s))) {
    game.theShape.moveDown();
  } else {
    // Appends the landed shape's squares to the landedSquares array
    Array.prototype.push.apply(game.landedSquares, game.theShape.squares);
    removeFullRows();
    // adds new shape to game
    game.theShape = getNextRandomShape();
    if (isAutoPlay) {
      // Todo, make sure this is asynchronous, to allow not interfere
      // with the current dropping interval.
      moveShapeToOptimalLocation();
    }
    if (isGameOver()) {
      // show last shape
      render();
      endGame();
      return;
    }
  }
  render();
}

function moveShapeToOptimalLocation() {
  const optimalMoves = getOptimalMoves(game.theShape, game.landedSquares);
  optimalMoves.forEach(move => {
    moveShape(move);
  });
}

function moveShape(move) {
  switch (move) {
    case "rotateClock":
      game.rotateClockWise();
      break;
    case "left":
      game.moveLeft();
      break;
    case "right":
      game.moveRight();
      break;
  }
}

function getOptimalMoves(shape) {
  // make sure to clone shape to determine the best path.
  let paths = [];
  function Path() {
    return {
      moves: [],
      score: -1
    };
  }

  // Compute all possible paths and their scores
  // rotations loop
  for (let i = 0; i <= 3; i++) {
    // tempShape is a square shape rotating doesn't change it.
    if (i > 0 && shape.squares2D.length < 3) {
      break;
    }
    let tempShape = JSON.parse(JSON.stringify(shape));
    let currentPath = new Path();
    // Clockwise rotations
    for (let j = 0; j < i; j++) {
      rotateClonedShapeClockwise(tempShape);
    }
    // There is space for this # of rotations
    if (tempShape.squares.every(s => isInAvailableSpace(s))) {
      for (let k = 0; k < i; k++) {
        // add number of rotations to moves
        currentPath.moves.push("rotateClock");
      }
    }
    currentPath.score = getPathScore(tempShape);
    paths.push(JSON.parse(JSON.stringify(currentPath)));
    // get all valid paths to left
    let leftTempShape = JSON.parse(JSON.stringify(tempShape));
    let leftCurrentPath = JSON.parse(JSON.stringify(currentPath));
    while (leftTempShape.squares.every(s => isSpaceOnLeft(s))) {
      leftTempShape.squares.forEach(s => s.x--);
      leftCurrentPath.moves.push("left");
      leftCurrentPath.score = getPathScore(leftTempShape);
      paths.push(JSON.parse(JSON.stringify(leftCurrentPath)));
    }
    // get all valid paths to right.
    let rightTempShape = JSON.parse(JSON.stringify(tempShape));
    let rightCurrentPath = JSON.parse(JSON.stringify(currentPath));
    while (rightTempShape.squares.every(s => isSpaceOnRight(s))) {
      rightTempShape.squares.forEach(s => s.x++);
      rightCurrentPath.moves.push("right");
      rightCurrentPath.score = getPathScore(rightTempShape);
      paths.push(JSON.parse(JSON.stringify(rightCurrentPath)));
    }
  }

  // find highest scoring path and return it.
  let bestPath = paths[0];
  paths.forEach(p => (bestPath = p.score >= bestPath.score ? p : bestPath));
  return bestPath.moves;
}

// Rotates clonedShape by rotating the contents of squares2D, and
// mutating the x and y coords of squares accordingly.
function rotateClonedShapeClockwise(clonedShape) {
  let squaresIndex = 0;
  // destination container.
  let rotated = getEmpty2DArray(clonedShape.squares2D.length);
  for (let i = 0; i < clonedShape.squares2D.length; i++) {
    for (let j = 0; j < clonedShape.squares2D.length; j++) {
      // current square to move
      let sq = clonedShape.squares2D[i][j];
      // Mutate the squares x and y coords to rotate the entire shape
      // Place the mutated square in corresponding place in new matrix.
      if (sq) {
        clonedShape.squares[squaresIndex] = sq;
        squaresIndex++;
        sq.x += clonedShape.squares2D.length - j - i - 1;
        sq.y += j - i;
      }
      rotated[j][clonedShape.squares2D.length - i - 1] = sq;
    }
  }
  clonedShape.squares2D = rotated;
  // Returns a 2D array of length size.
  function getEmpty2DArray(size) {
    let outer = [];
    for (let i = 0; i < size; i++) {
      let inner = [];
      outer[i] = inner;
    }
    return outer;
  }
}

function getPathScore(shape) {
  let score = 0;
  // TODO consider not cloning squares2d as not needed...
  const tempShape = JSON.parse(JSON.stringify(shape));
  // do not have access to shape's methods or squares methods of this cloned object
  // create functions do move shape.
  let landedSquaresClone = JSON.parse(JSON.stringify(game.landedSquares));
  while (tempShape.squares.every(s => isSpaceBelow(s))) {
    tempShape.squares.forEach(s => s.y++);
  }
  Array.prototype.push.apply(landedSquaresClone, tempShape.squares);

  // check for num full rows.
  for (let i = 0; i < columnLength; i++) {
    if (getSquareCountInRow(i, landedSquaresClone) === rowLength) {
      score += 10000;
    }
  }
  // check for num spaces covered by tempShape
  // for each square in tempShape if exists an empty square below it
  // (No square with same x and greater y) add one to substract from score.
  score += 2000;
  for (let i = 0; i < tempShape.squares.length; i++) {
    let square = tempShape.squares[i];
    for (let j = square.y + 1; j < columnLength; j++) {
      // empty space === no square exists with same x and greater y
      if (landedSquaresClone.every(s => !(s.x === square.x && s.y === j))) {
        // score -= 100;
        score -= 2;
      }
    }
  }

  // check for height of tempShape.
  let shapeMinY = columnLength;
  // find min y value
  tempShape.squares.forEach(
    s => (shapeMinY = shapeMinY > s.y ? s.y : shapeMinY)
  );
  score += shapeMinY;
  return score;
}

// Returns true if a new shape is either overlapping
// or is blocked from moving down.
function isGameOver() {
  let isShapeOverlapping = game.theShape.squares.some(s =>
    isOverlappingLanded(s)
  );
  let isBlockedBelow = game.theShape.squares.some(s => !isSpaceBelow(s));
  return isShapeOverlapping || isBlockedBelow;
}

// Stops the game showing a Game Over! notification.
function endGame() {
  isGameStopped = true;
  clearInterval(interval);
  ctx.font = "48px serif";
  ctx.fillStyle = "black";
  ctx.fillText("Game", squareSize, height / 3);
  ctx.fillText("Over!", squareSize, (2 * height) / 3);
}

// Returns one of the possible 7 shapes. If the first random shape chosen is
// not equal to the previous game shape, it is returned. Otherwise, a second
// random shape is chosen and returned regardless if equal to previous.
function getNextRandomShape() {
  // random number from 0 - 6
  let intInRange0to6 = Math.floor(Math.random() * 7);
  // if same as last shape
  if (intInRange0to6 === previousRandomId) {
    // Pick a new random number
    intInRange0to6 = Math.floor(Math.random() * 7);
  }
  previousRandomId = intInRange0to6;
  return getShapeWithID(intInRange0to6);
}

// returns one of 7 shapes.
// id = [0...6]
function getShapeWithID(id) {
  switch (id) {
    case 0:
      return new tShapes.TShape();
    case 1:
      return new tShapes.OShape();
    case 2:
      return new tShapes.SShape();
    case 3:
      return new tShapes.ZShape();
    case 4:
      return new tShapes.LShape();
    case 5:
      return new tShapes.JShape();
    case 6:
      return new tShapes.IShape();
  }
}

// Speeds up the game, called on level change.
function speedUp() {
  adjustDropInterval();
  clearInterval(interval);
  interval = setInterval(() => game.drop(), dropInterval);
}

// Removes any full rows and then drops any squares above them.
// Updates line count, level and game speed if necessary.
function removeFullRows() {
  for (let i = columnLength - 1; i >= 0; i--) {
    let squareCountInRow = getSquareCountInRow(i, game.landedSquares);
    // is row full?
    if (squareCountInRow === rowLength) {
      let level;
      lineCount++;
      level = Math.floor(lineCount / 10) + initialLevel;
      // Has the level increased?
      if (level > currentLevel) {
        currentLevel = level;
        levelLabel.textContent = `Level: ${level}`;
        game.speedUp();
      }
      linesLabel.textContent = `Total Lines: ${lineCount}`;
      removeSquaresInRow(i);
      // Drops squares above this row
      game.landedSquares.forEach(s => {
        if (s.y < i) s.y++;
      });
      // Recursive call, ends when no full rows exist.
      removeFullRows();
      break;
    }
  }
}

// sets dropInterval to official tetris game values in milliseconds
function adjustDropInterval() {
  switch (currentLevel) {
    case 0:
      dropInterval = 800;
      break;
    case 1:
      dropInterval = 720;
      break;
    case 2:
      dropInterval = 630;
      break;
    case 3:
      dropInterval = 550;
      break;
    case 4:
      dropInterval = 470;
      break;
    case 5:
      dropInterval = 380;
      break;
    case 6:
      dropInterval = 300;
      break;
    case 7:
      dropInterval = 220;
      break;
    case 8:
      dropInterval = 130;
      break;
    case 9:
      dropInterval = 100;
      break;
    case 10:
    case 11:
    case 12:
      dropInterval = 80;
      break;
    case 13:
    case 14:
    case 15:
      dropInterval = 70;
      break;
    case 16:
    case 17:
    case 18:
      dropInterval = 50;
      break;
    default:
      dropInterval = 30;
  }
}

// returns the number of squares at row with y == index
function getSquareCountInRow(index, squaresArray) {
  let count = squaresArray.reduce(
    (num, sq) => (sq.y === index ? num + 1 : num),
    0
  );
  return count;
}

// replaces game.landedSquares with an array of squares
// that do not have y == index;
function removeSquaresInRow(index) {
  let newLandedArray = [];
  game.landedSquares.forEach(s => {
    if (s.y !== index) newLandedArray.push(s);
  });
  game.landedSquares = newLandedArray;
}

// Returns true if there is a space below square.
function isSpaceBelow(square) {
  let isSpaceFromBottom = square.y < columnLength - 1;
  let isSpaceFromLanded = game.landedSquares.every(
    s => s.x !== square.x || s.y !== square.y + 1
  );
  return isSpaceFromBottom && isSpaceFromLanded;
}

// Returns true if there is space on left of square.
function isSpaceOnLeft(square) {
  let isSpaceFromLeftBorder = square.x > 0;
  let isSpaceFromLanded = game.landedSquares.every(
    s => s.x !== square.x - 1 || s.y !== square.y
  );
  return isSpaceFromLeftBorder && isSpaceFromLanded;
}

// Returns true if there is space on right of square.
function isSpaceOnRight(square) {
  let isSpaceFromRightBorder = square.x < rowLength - 1;
  let isSpaceFromLanded = game.landedSquares.every(
    s => s.x !== square.x + 1 || s.y !== square.y
  );
  return isSpaceFromRightBorder && isSpaceFromLanded;
}

// Returns true if square is in bounds and not in the same space
// as a landed square. Used to verify if a shape rotation is valid.
function isInAvailableSpace(square) {
  let isInBounds =
    square.x >= 0 && square.x < rowLength - 1 && square.y < columnLength - 1;
  return isInBounds && !isOverlappingLanded(square);
}

// Returns true if square is in the same location as any landed square.
function isOverlappingLanded(square) {
  return game.landedSquares.some(s => s.x === square.x && s.y === square.y);
}

//============================== User input handler ===========================
function handleKeyDown(e) {
  if (isGameStopped) {
    return;
  }
  switch (e.keyCode) {
    case keyJ:
      game.moveLeft();
      break;
    case keyK:
      game.moveDown();
      break;
    case keyL:
      game.moveRight();
      break;
    case keyF:
      game.rotateClockWise();
      break;
    case keyD:
      game.rotateCounterClock();
  }
}
//========================================= Rendering =========================

// Refreshes the game image by overwritting previous image
// and drawing new game.
function render() {
  // game area
  // border
  ctx.strokeStyle = "rgb(0, 0, 0)";
  ctx.strokeRect(LEFT, TOP, width, height);
  // background
  ctx.fillStyle = "rgb(222, 222, 222)";
  ctx.fillRect(LEFT, TOP, width, height);
  // The next shape.
  if (game.theShape) {
    game.theShape.squares.forEach(s => renderSquare(s));
  }
  // the landed squares
  game.landedSquares.forEach(s => renderSquare(s));
}

// Renders square on the canvas.
function renderSquare(square) {
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.strokeRect(
    LEFT + square.x * squareSize + 1,
    TOP + square.y * squareSize + 1,
    squareSize - 1,
    squareSize - 1
  );
  ctx.fillStyle = square.color;
  ctx.fillRect(
    LEFT + square.x * squareSize + 1,
    TOP + square.y * squareSize + 1,
    squareSize - 1,
    squareSize - 1
  );
}
