const canvas = document.getElementById("brickBreak");
let ctx = canvas.getContext("2d");

// Ball

const ballRadius = 10;
let ballColor = '#0095DD';

let x, y;
let dx, dy;

function initGame() {
  x = canvas.width / 2;
  y = canvas.height * 2 / 3;

  dx = 1;
  dy = -2;
}

function randColor() {
  const colorBase = '0123456789ABCDEF';
  return '#' + Array(6).fill().map(_=>colorBase[Math.floor(Math.random() * colorBase.length)]).join('');
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

// Paddle

const paddleHeight = 10;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Blocks

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;


let bricks = Array(brickColumnCount).fill().map((_, c) => {
  return Array(brickRowCount).fill().map((_, r) => {
    return {
      x: c * (brickWidth + brickPadding) + brickOffsetLeft,
      y: r * (brickHeight + brickPadding) + brickOffsetTop,
      status: 1
    };
  })
});

function drawBricks() {
  bricks.map(col => {
    col.map(obj => {
      if (obj.status === 1) {
        ctx.beginPath();
        ctx.rect(obj.x, obj.y, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    })
  })
}


// Status

let score = 0;

function drawStatus() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// Collision

function collisionDetection() {
  bricks.map(col => {
    col.map(b => {
      if (b.status === 1
      && x > b.x && x < b.x + brickWidth
      && y > b.y && y < b.y + brickHeight) {
        dy = -dy;
        ballColor = randColor();
        b.status = 0;
        score++;
        if (score === brickRowCount * brickColumnCount) {
          alert('YOU WIN, CONGRATULATION!');
          document.location.reload();
        }
      }
    })
  })
}


function renderBrickBreak(whereBallHits) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  drawStatus();

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
    ballColor = randColor();
  }
  if (y + dy < ballRadius) {
    dy = -dy;
    ballColor = randColor();
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy * 1.2;
      dx = (x - paddleX - paddleWidth / 2) / 20;
      whereBallHits = x - paddleX;
    }
    else {
      initGame();
    }
  }

  collisionDetection();

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 11;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 11;
  }
  x += dx;
  y += dy;
  return whereBallHits
}

// Main routine

document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

document.addEventListener("keyup", keyUpHandler, false);
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

document.addEventListener("mousemove", mouseMoveHanler, false);
function mouseMoveHanler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
}




