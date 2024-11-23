const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const rows = 20;
const cols = 10;
const blockSize = 30;
let score = 0;

const tetrominoes = 
[
  [[1, 1, 1, 1]],  
  [[1, 1, 1], [1]],  
  [[1, 1, 1], [0, 0, 1]],  
  [[1, 1], [1, 1]],  
  [[0, 1, 1], [1, 1, 0]],  
  [[1, 1, 0], [0, 1, 1]],  
  [[1, 1, 1], [0, 1]]   
];

const colors = ['#00B5E2', '#0051D6', '#FF6F3C', '#FFD700', '#008000', '#F44336', '#9C27B0'];

let board = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentTetromino, currentPosition;
let gameStarted = false;
let gameOver = false;

const startPopup = document.getElementById('startPopup');
const startButton = document.getElementById('startBtn');

const gameOverPopup = document.getElementById('gameOverPopup');
const restartButton = document.getElementById('restartBtn');

function drawBoard()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#808080'; 
  ctx.lineWidth = 1;

  for (let r = 0; r <= rows; r++) 
  {
    ctx.beginPath();
    ctx.moveTo(0, r * blockSize);
    ctx.lineTo(canvas.width, r * blockSize);
    ctx.stroke();
  }

  for (let c = 0; c <= cols; c++) 
  {
    ctx.beginPath();
    ctx.moveTo(c * blockSize, 0);
    ctx.lineTo(c * blockSize, canvas.height);
    ctx.stroke();
  }

  for (let r = 0; r < rows; r++) 
  {
    for (let c = 0; c < cols; c++) 
    {
      if (board[r][c]) 
      {
        ctx.fillStyle = colors[board[r][c] - 1];
        ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
        ctx.strokeStyle = 'white';  // White border for shapes
        ctx.lineWidth = 2;
        ctx.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
      }
    }
  }
}

function drawTetromino()
{
  for (let r = 0; r < currentTetromino.length; r++) 
  {
    for (let c = 0; c < currentTetromino[r].length; c++) 
    {
      if (currentTetromino[r][c]) 
      {
        ctx.fillStyle = colors[currentTetromino.color - 1];
        ctx.fillRect((currentPosition.x + c) * blockSize, (currentPosition.y + r) * blockSize, blockSize, blockSize);
        ctx.strokeStyle = 'white';  // White border for tetromino shapes
        ctx.lineWidth = 2;
        ctx.strokeRect((currentPosition.x + c) * blockSize, (currentPosition.y + r) * blockSize, blockSize, blockSize);
      }
    }
  }
}

function collide()
{
  for (let r = 0; r < currentTetromino.length; r++)
  {
    for (let c = 0; c < currentTetromino[r].length; c++) 
    {
      if (currentTetromino[r][c] && (board[currentPosition.y + r] && board[currentPosition.y + r][currentPosition.x + c]) !== 0)
      {
        return true;
      }
    }
  }
  return false;
}

function moveTetromino(direction) 
{
  currentPosition.x += direction;
  if (collide())
  {
    currentPosition.x -= direction;
  }
}

function dropTetromino() 
{
  currentPosition.y++;
  if (collide())
  {
    currentPosition.y--;
    lockTetromino();
  }
}

function lockTetromino()
{
  for (let r = 0; r < currentTetromino.length; r++)
  {
    for (let c = 0; c < currentTetromino[r].length; c++)
    {
      if (currentTetromino[r][c]) 
      {
        board[currentPosition.y + r][currentPosition.x + c] = currentTetromino.color;
      }
    }
  }
  removeFullLines();
  spawnTetromino();
}

function removeFullLines()
{
  for (let r = rows - 1; r >= 0; r--)
    {
    if (board[r].every(cell => cell !== 0))
      {
      board.splice(r, 1);
      board.unshift(Array(cols).fill(0));
      score += 100;
      document.getElementById('score').innerText = score;
    }
  }
}

function spawnTetromino()
{
  const randomIndex = Math.floor(Math.random() * tetrominoes.length);
  currentTetromino = tetrominoes[randomIndex];
  currentTetromino.color = randomIndex + 1;
  currentPosition = { x: Math.floor(cols / 2) - 1, y: 0 };
  if (collide()) 
  {
    gameOverScreen();
  }
}

function gameOverScreen()
{
  gameOver = true;
  document.getElementById('finalScore').innerText = score;
  gameOverPopup.style.display = 'block';
  startPopup.style.display = 'none';
}

function resetGame()
{
  board = Array.from({ length: rows }, () => Array(cols).fill(0));
  score = 0;
  document.getElementById('score').innerText = score;
  gameOver = false;
  gameOverPopup.style.display = 'none';
  spawnTetromino();
  setInterval(update, 500);
}

function update()
{
  if (gameOver) return;
  dropTetromino();
  drawBoard();
  drawTetromino();
}

document.addEventListener('keydown', (e) =>
{
  if (!gameStarted || gameOver) return;

  if (e.key === 'ArrowLeft') moveTetromino(-1);
  if (e.key === 'ArrowRight') moveTetromino(1);
  if (e.key === 'ArrowDown') dropTetromino();
});

startButton.addEventListener('click', () => 
{
  startPopup.style.display = 'none';
  gameStarted = true;
  spawnTetromino();
  setInterval(update, 500);
});

restartButton.addEventListener('click', resetGame);

startPopup.style.display = 'block';
