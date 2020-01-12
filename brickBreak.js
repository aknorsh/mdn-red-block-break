const canvas = document.getElementById("brickBreak");
let ctx = canvas.getContext("2d");

// Ball
let ball = {
  radius: 10,
  color: '#0095DD'
}

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
  ctx.arc(x, y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

const paddle = {
  height: 10,
  width: 150
}

paddle.x = (canvas.width - paddle.width) / 2;

let rightPressed = false;
let leftPressed = false;

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Blocks
//
const bconf = {
  rowCnt: 3,
  colCnt: 5,
  width: 75,
  height: 20,
  padding: 10,
  offTop: 30,
  offLeft: 30
}

let bricks = Array(bconf.colCnt).fill().map((_, c) => {
  return Array(bconf.rowCnt).fill().map((_, r) => {
    return {
      x: c * (bconf.width + bconf.padding) + bconf.offLeft,
      y: r * (bconf.height + bconf.padding) + bconf.offTop,
      status: 1
    };
  })
});

function drawBricks() {
  bricks.map(col => {
    col.map(obj => {
      if (obj.status === 1) {
        ctx.beginPath();
        ctx.rect(obj.x, obj.y, bconf.width, bconf.height);
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
      && x > b.x && x < b.x + bconf.width
      && y > b.y && y < b.y + bconf.height) {
        dy = -dy;
        ball.color = randColor();
        b.status = 0;
        score++;
        if (score === bconf.rowCnt * bconf.colCnt) {
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

  if (x + dx < ball.radius || x + dx > canvas.width - ball.radius) {
    dx = -dx;
    ball.color = randColor();
  }
  if (y + dy < ball.radius) {
    dy = -dy;
    ball.color = randColor();
  } else if (y + dy > canvas.height - ball.radius) {
    if (x > paddle.x && x < paddle.x + paddle.width) {
      dy = -dy * 1.2;
      dx = (x - paddle.x - paddle.width / 2) / 20;
      whereBallHits = x - paddle.x;
    }
    else {
      initGame();
    }
  }

  collisionDetection();

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 11;
  }
  else if (leftPressed && paddle.x > 0) {
    paddle.x -= 11;
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
  if (relativeX > paddle.width / 2 && relativeX < canvas.width - paddle.width / 2) {
    paddle.x = relativeX - paddle.width / 2;
  }
}




