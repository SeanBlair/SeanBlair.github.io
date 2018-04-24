const canvas = document.querySelector('.canvas');
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext('2d');
const LEFT = 20;
const TOP = 20;
const squareSize = 10;
const rowLength = 10;
const columnLength = 20;
const width = squareSize * rowLength;
const height = squareSize * columnLength;
const keyLeft = 37;
const keyDowsn = 40;
const keyRight = 39;
window.addEventListener('keydown', handleKeyDown);

// a movable square
var theSquare = new Square(0, 0, 'blue');

// show initial game
render();

function render() {
  // game area
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.strokeRect(LEFT, TOP, width, height);
  ctx.fillStyle = 'white';
  ctx.fillRect(LEFT, TOP, width, height);
  
  theSquare.draw();
}

// a square
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
