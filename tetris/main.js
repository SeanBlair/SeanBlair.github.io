// TODO: Break file into smaller files.
// TODO: Allow user to start game at any level.
// Game constants =============================================================
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
// Canvas html element
const canvas = document.querySelector('.canvas');
canvas.width = width;
canvas.height = height;
// object to draw on.
const ctx = canvas.getContext('2d');
// Keyboard ids
const keyD = 68;
const keyF = 70;
const keyJ = 74;
const keyK = 75;
const keyL = 76;
// Initial update interval in milliseconds
const initialGameInterval = 800;
// add listener for user keyboard input
window.addEventListener('keydown', handleKeyDown);
// Start/stop button
const startButton = document.querySelector('.start');
// Reset button
const resetButton = document.querySelector('.reset');
// For displaying current game level
const levelLabel = document.querySelector('.level');
// For displaying current line count
const linesLabel = document.querySelector('.lines');

// Game variables and classes.=================================================
// current drop interval
let dropInterval;
// For storing lines finished.
let lineCount;
// For storing current level.
let currentLevel;
// For storing previous shape id.
let previousRandomId;

// Game state objects =========================================================
// Generic state object has all state methods, allowing
// all the concrete states objects to override only the
// methods that they need to customize and inherit the rest.
class GenericState {
  initialize(target) {
    this.target = target;
  }
  // this method will be shadowed by all concrete state objects.
  execute() {
  }
  initiate() {
    this.target.changeState(this.target.states.initiating);
  }
  start() {
    this.target.changeState(this.target.states.starting);    
  }
  pause() {
    this.target.changeState(this.target.states.pausing);
  }
  drop() {
    this.target.changeState(this.target.states.dropping);    
  }
  moveLeft() {
    this.target.changeState(this.target.states.movingLeft);
  }
  moveRight() {
    this.target.changeState(this.target.states.movingRight);
  }
  moveDown() {
    this.target.changeState(this.target.states.movingDown);
  }
  rotateClockWise() {
    this.target.changeState(this.target.states.rotatingClockWise);
  }
  rotateCounterClock() {
    this.target.changeState(this.target.states.rotatingCounterClock);
  }
  speedUp() {
    this.target.changeState(this.target.states.speedingUp);
  }
}
// Concrete State objects.=====================================================
class Initiating extends GenericState {
  execute() {
    initiateGame();
  }
}
class Starting extends GenericState {
  execute() {
    startGame();
  }
}
class Pausing extends GenericState {
  execute() {
    pauseGame();
  }
}
class Dropping extends GenericState {
  execute() {
    drop();
  }
  drop() {
    drop();
  }
}
class MovingLeft extends GenericState {
  execute() {
    moveLeft();
  }
  moveLeft() {
    moveLeft();
  }
}
class MovingRight extends GenericState {
  execute() {
    moveRight();
  }
  moveRight() {
    moveRight();
  }
}
class MovingDown extends GenericState {
  execute() {
    moveDown();
  }
  moveDown() {
    moveDown();
  }
}
class RotatingClockWise extends GenericState {
  execute() {
    rotateClockWise();
  }
  rotateClockWise() {
    rotateClockWise();
  }
}
class RotatingCounterClock extends GenericState {
  execute() {
    rotateCounterClockwise();
  }
  rotateCounterClock() {
    rotateCounterClockwise();
  }
}
class SpeedingUp extends GenericState {
  execute() {
    speedUp();
  }
}

// The game object
let game = {
  // the current tetromino.
  theShape: undefined,
  // the squares of landed shapes.
  landedSquares: [],
  // current game state
  state: undefined,
  // Uses the State pattern to share state with arbitrary
  // user input and the periodic game update interval.
  // all states.
  states: {
    initiating: new Initiating(),
    starting: new Starting(),
    pausing: new Pausing(),
    dropping: new Dropping(),
    movingLeft: new MovingLeft(),
    movingRight: new MovingRight(),
    movingDown: new MovingDown(),
    rotatingClockWise: new RotatingClockWise(),
    rotatingCounterClock: new RotatingCounterClock(),
    speedingUp: new SpeedingUp()
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
}
// for stopping setInterval()
let interval;
// initialize game object.
game.initialize();
// Game entry point, initiates game state.
initiateGame();

// Game logic =================================================================
// initiates the state for a new game.
function initiateGame() {
  clearInterval(interval);
  lineCount = 0;
  currentLevel = 0;
  previousRandomId = 7;
  levelLabel.textContent = `Level: ${ currentLevel }`;
  linesLabel.textContent = `Total Lines: ${ lineCount }`;
  game.theShape = undefined;
  game.landedSquares = [];
  dropInterval = initialGameInterval;
  startButton.textContent = 'Start';
  startButton.onclick = (() => game.start());
  resetButton.style.display = 'none';
  resetButton.onclick = (() => game.initiate());
  render();
}

// Starts setInterval() with current value of updateInterval
// and changes start button to pause button.
function startGame() {
  startButton.textContent = 'Pause';
  startButton.onclick = (() => game.pause());
  resetButton.style.display = 'inline';
  interval = setInterval(() => game.drop(), dropInterval);
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
    game.theShape = getNextRandomShape();
    // is exists and possible, drops the shape one space
  } else if (game.theShape.isSpaceBelow()) {
    game.theShape.moveDown();
  } else {
    // Appends the landed shape's squares to the landedSquares array
    Array.prototype.push.apply(game.landedSquares, game.theShape.squares);
    removeFullRows();
    // adds new shape to game
    game.theShape = getNextRandomShape();
    if (isGameOver()) {
      // show last shape
      render();
      endGame();
      return;
    }
  }
  render();
}

// Returns true if a new shape is either overlapping
// or is blocked from moving down.
function isGameOver() {
  let isShapeOverlapping = game.theShape.squares.forEach(
    sq => game.landedSquares.some(s => s.x === sq.x && s.y === sq.y)
  );
  return isShapeOverlapping || !game.theShape.isSpaceBelow();
}

// Stops the game showing a Game Over! notification.
function endGame() {
  clearInterval(interval);
  ctx.font = '48px serif';
  ctx.fillStyle = 'black'
  ctx.fillText('Game', squareSize, height / 3);
  ctx.fillText('Over!', squareSize, 2 * height / 3);
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
    return new TShape();
    case 1:
    return new OShape();
    case 2: 
    return new SShape();
    case 3:
    return new ZShape();
    case 4:
    return new LShape();
    case 5:
    return new JShape();
    case 6:
    return new IShape();
  }
}

// Speeds up the game on level change, called on level change.
function speedUp() {
  adjustDropInterval();
  clearInterval(interval);
  interval = setInterval(() => game.drop(), dropInterval);
}

// Removes any full rows and then drops any squares above them.
function removeFullRows() {
  for (let i = columnLength - 1; i >= 0; i--) {
    let squareCountInRow = getSquareCountInRow(i);
    // is row full?
    if (squareCountInRow === rowLength) {
      let level;
      lineCount++;
      level = Math.floor(lineCount / 10);
      // Has the level increased?
      if (level > currentLevel) {
        currentLevel = level;
        levelLabel.textContent = `Level: ${ level }`;
        game.speedUp();
      }
      linesLabel.textContent = `Total Lines: ${lineCount}`;
      removeSquaresInRow(i);
      // Drops squares above this row
      game.landedSquares.forEach(s => { if (s.y < i) s.y++});
      // Recursive call, ends when no full rows exist.
      removeFullRows();
      break;
    }
  }
}

// sets dropInterval to official values in milliseconds
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
  ctx.fillStyle = 'rgb(222, 222, 222)';
  ctx.fillRect(LEFT, TOP, width, height);
  // The next shape.
  if (game.theShape) {
    game.theShape.draw();
  }
  // the landed squares
  game.landedSquares.forEach(s => s.draw());
}

// The game shapes ============================================================
// a square
// x: [0 ... rowLength - 1]
// y: [0 ... columnLength - 1]
// color: any css color.
class Square {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
  draw() {
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(
      LEFT + this.x * squareSize + 1, 
      TOP + this.y * squareSize + 1, 
      squareSize - 1, 
      squareSize - 1
    );
    ctx.fillStyle = this.color;
    ctx.fillRect(
      LEFT + this.x * squareSize + 1, 
      TOP + this.y * squareSize + 1, 
      squareSize - 1, 
      squareSize - 1
    );
  }
  moveLeft() {
    this.x--;
  }
  moveRight() {
    this.x++;
  }
  moveDown() {
    this.y++;
  }
  canMoveLeft() {
    let isSquareOnLeft = game.landedSquares.some(
      s => s.y === this.y && s.x === this.x - 1
    );
    let isAtLeftBorder = this.x === 0;
    return !isSquareOnLeft && !isAtLeftBorder;
  }
  canMoveRight() {
    let isSquareOnRight = game.landedSquares.some(
      s => s.y === this.y && s.x === this.x + 1
    );
    let isAtRightBorder = this.x === rowLength - 1;
    return !isSquareOnRight && !isAtRightBorder;
  }
  canMoveDown() {
    let isSquareBellow = game.landedSquares.some(
      s => s.x === this.x && s.y === this.y + 1
    );
    let isAtBottom = this.y === columnLength - 1;
    return !isSquareBellow && !isAtBottom;
  }
}

// A generic tetris tetromino shape.
class Shape {
  constructor(squares, squares2D) {
    this.squares = squares;
    this.squares2D = squares2D;
  }
  // If there is space to rotate 90 degrees, rotates this shape 
  // by rotating the contents of this.squares2D, and mutating the 
  // x and y coords of this.squares.                
  rotate(direction='clockwise') {
    // make a deep copy to check if rotation is possible.
    let squares2DClone = JSON.parse(JSON.stringify(this.squares2D)); 
    squares2DClone = rotate(squares2DClone);   
    if (isSpaceToRotate(squares2DClone)) {
      this.squares2D = rotate(this.squares2D);
    }
    // returns shape2D rotated in its matrix, and
    // with its squares mutated to implement the rotation.
    function rotate(shape2D) {
      let rotated = getEmpty2DArray();
      for (let i = 0; i < shape2D.length; i++) {
        for (let j = 0; j < shape2D.length; j++) {
          // current square to move
          let sq = shape2D[i][j];
          // Mutate the squares x and y coords to rotate the entire shape
          // Place the mutated square in corresponding place in new matrix.
          if (direction === 'clockwise') {
            if (sq) {
              sq.x += shape2D.length - j - i - 1;
              sq.y += j - i;
            }
            rotated[j][shape2D.length - i - 1] = sq;
          } else if (direction === 'counterClockWise') {
            if (sq) {
              sq.x += 0 - j + i;
              sq.y += shape2D.length - (j + i) - 1;
            }
            rotated[shape2D.length - j - 1][0 + i] = sq;
          }
        }
      }
      return rotated;
      // Returns a 2D array of the correct size.
      function getEmpty2DArray() {
        let outer = [];
        for (let i = 0; i < shape2D.length; i++) {
          let inner = [];
          outer[i] = inner;
        }
        return outer;
      }
    }
    // returns true if no squares in rotated2D share both x and y coords with
    // any landedSquare or is out of bounds.
    function isSpaceToRotate(rotated2D) {
      return rotated2D.every(a => a.every(s => s ? hasSpace(s) : true));
      // returns true if sq is not overlapping any landed square or out of bounds
      function hasSpace(sq) {
        let isSpaceFromLanded = game.landedSquares.every(
          ls => !(ls.x === sq.x && ls.y === sq.y)
        );
        let isInBounds = sq.x >= 0 && sq.x < rowLength && sq.y < columnLength - 1;
        return isSpaceFromLanded && isInBounds;
      }
    }
  }
  draw() {
    this.squares.forEach(s => s.draw());
  }
  moveLeft() {
    this.squares.forEach(s => s.moveLeft());
  }
  moveRight() {
    this.squares.forEach(s => s.moveRight());
  }
  moveDown() {
    this.squares.forEach(s => s.moveDown());
  }
  isSpaceOnLeft() {
    return this.squares.every(s => s.canMoveLeft());
  }
  isSpaceOnRight() {
    return this.squares.every(s => s.canMoveRight());
  }
  isSpaceBelow() {
    return this.squares.every(s => s.canMoveDown());
  }
}

// Concrete shapes ============================================================
class IShape extends Shape {
  constructor() {
    let squares = [
      new Square(3, 0, 'cyan'),
      new Square(4, 0, 'cyan'),
      new Square(5, 0, 'cyan'),
      new Square(6, 0, 'cyan')
    ];
    let squares2D = [
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [squares[0], squares[1], squares[2], squares[3]],
      [undefined, undefined, undefined, undefined]    
    ]
    super(squares, squares2D);
  }
}

class TShape extends Shape {
  constructor() {
    let squares = [
      new Square(4, -1, '#b300b3'),
      new Square(3, 0, '#b300b3'),
      new Square(4, 0, '#b300b3'),
      new Square(5, 0, '#b300b3')
    ];
    let squares2D = [
      [undefined, squares[0], undefined],
      [squares[1], squares[2], squares[3]],
      [undefined, undefined, undefined]
    ]
    super(squares, squares2D);
  }
}

class SShape extends Shape {
  constructor() {
    let squares = [
      new Square(4, -1, '#00b300'),
      new Square(5, -1, '#00b300'),
      new Square(3, 0, '#00b300'),
      new Square(4, 0, '#00b300')
    ];
    let squares2D = [
      [undefined, squares[0],  squares[1]],
      [squares[2], squares[3], undefined],
      [undefined, undefined, undefined]
    ];
    super(squares, squares2D);
  }
}

class ZShape extends Shape {
  constructor() {
    let squares = [
      new Square(3, -1, '#ff6666'),
      new Square(4, -1, '#ff6666'),
      new Square(4, 0, '#ff6666'),
      new Square(5, 0, '#ff6666')
    ];
    let squares2D = [
      [squares[0], squares[1], undefined],
      [undefined, squares[2], squares[3]],
      [undefined, undefined, undefined]
    ];
    super(squares, squares2D);
  }
}

class LShape extends Shape {
  constructor() {
    let squares = [
      new Square(5, -1, 'orange'),
      new Square(3, 0, 'orange'),
      new Square(4, 0, 'orange'),
      new Square(5, 0, 'orange')
    ];
    let squares2D = [
      [undefined, undefined, squares[0]],
      [squares[1], squares[2], squares[3]],
      [undefined, undefined, undefined]
    ];
    super(squares, squares2D);
  }
}

class JShape extends Shape {
  constructor() {
    let squares = [
      new Square(3, -1, '#6666ff'),
      new Square(3, 0, '#6666ff'),
      new Square(4, 0, '#6666ff'),
      new Square(5, 0, '#6666ff')
    ];
    let squares2D = [
      [squares[0], undefined, undefined],
      [squares[1], squares[2], squares[3]],
      [undefined, undefined, undefined]
    ];
    super(squares, squares2D);
  }
}

class OShape extends Shape {
  constructor() {
    let squares = [
      new Square(4, -1, 'yellow'),
      new Square(5, -1, 'yellow'),
      new Square(4, 0, 'yellow'),
      new Square(5, 0, 'yellow')
    ];
    // no need for 2D matrix as rotation is ignored for this shape.
    super(squares, [[]]);
  }
  // shadow rotate with empy body to avoid rotation computation.
  rotate() {};
}

// User input handler =========================================================
function handleKeyDown(e) {
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
