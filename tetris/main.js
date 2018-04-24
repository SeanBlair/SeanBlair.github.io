// const canvas = document.querySelector('.canvas');
const canvas = document.querySelector('.canvas');
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext('2d');
const left = 20;
const TOP = 20;
const squareSize = 10;
const height = squareSize * 20;
const width = squareSize * 10;

// game area
ctx.strokeStyle = 'rgb(0, 0, 0)';
ctx.strokeRect(left, TOP, width, height);

ctx.strokeStyle = 'rgb(100, 100, 100)';
for (let i = 0; i < 10; i++) {
  ctx.strokeRect(left + squareSize * i, TOP + height - squareSize, squareSize, squareSize);
}

ctx.strokeRect(left + squareSize * 5, 
              TOP + squareSize * 5, squareSize, squareSize);
ctx.strokeRect(left + squareSize * 5, 
              TOP + squareSize * 6, squareSize, squareSize);

ctx.strokeRect(left + squareSize * 4, 
              TOP + squareSize * 6, squareSize, squareSize);

ctx.strokeRect(left + squareSize * 6, 
              TOP + squareSize * 6, squareSize, squareSize);