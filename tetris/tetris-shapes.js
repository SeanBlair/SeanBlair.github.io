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
  moveLeft() {
    this.x--;
  }
  moveRight() {
    this.x++;
  }
  moveDown() {
    this.y++;
  }
}

// A generic tetris tetromino shape.
class Shape {
  constructor(squares, squares2D) {
    this.squares = squares;
    this.squares2D = squares2D;
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
  // Rotates this shape by rotating the contents of this.squares2D, and 
  // mutating the x and y coords of this.squares accordingly.                
  rotate(direction='clockWise') {
    // destination container.
    let rotated = getEmpty2DArray(this.squares2D.length);
    for (let i = 0; i < this.squares2D.length; i++) {
      for (let j = 0; j < this.squares2D.length; j++) {
        // current square to move
        let sq = this.squares2D[i][j];
        // Mutate the squares x and y coords to rotate the entire shape
        // Place the mutated square in corresponding place in new matrix.
        if (direction === 'clockWise') {
          if (sq) {
            sq.x += this.squares2D.length - j - i - 1;
            sq.y += j - i;
          }
          rotated[j][this.squares2D.length - i - 1] = sq;
        } else if (direction === 'counterClockWise') {
          if (sq) {
            sq.x += 0 - j + i;
            sq.y += this.squares2D.length - (j + i) - 1;
          }
          rotated[this.squares2D.length - j - 1][0 + i] = sq;
        }
      }
    }
    this.squares2D = rotated;
    // Returns a 2D array of length size.
    function getEmpty2DArray(size) {
      let outer = [];
      for (let i = 0; i < size; i++) {
        let inner = [];
        outer[i] = inner;
      }
      return outer;
    }
  };
}
// ================================ Tetris Shapes =============================
// Their colors and initial positions are set following official tetris rules.

export class IShape extends Shape {
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

export class TShape extends Shape {
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

export class SShape extends Shape {
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

export class ZShape extends Shape {
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

export class LShape extends Shape {
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

export class JShape extends Shape {
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

export class OShape extends Shape {
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
}