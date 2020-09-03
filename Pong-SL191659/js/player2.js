var canvas,ctx;
function ini(){
canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
}
ini()
var upPressed=false; 
var downPressed=false; 
var audio = document.getElementById("pelota");

class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = 5;

    this.changeAngle(0);
    this.movement = 0;

  }
  changeAngle(angle) {
    if(angle == 0) angle = 1;
    this.angle = angle;
    this.radians = this.angle / (180 * Math.PI) * 10;
    this.xunits = Math.cos(this.radians) * this.speed;
    this.yunits = Math.sin(this.radians) * this.speed;
  }
  angleTo(x, y) {
    this.changeAngle(Math.atan2(y - this.y, x - this.x));
  }
  render() {
    this.x += this.xunits;
    this.y += this.yunits;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    this.movement += this.speed;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.save();
    ctx.shadowColor = '#999';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 15;
    ctx.strokeStyle = "purple";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
  ghostPath(toX) {
    let {x, y} = this;
    while(x < toX) {
      x += this.xunits;
      y += this.yunits;
    } 
    return {x, y};
  }
}

class Player {
  constructor(x, y, width, height, ctx) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.ctx = ctx;
    this.speed = 5;
    this.up = false;
    this.down = false;
    this.innerColor = "rgba(0, 150, 0, .2)";
    this.outerColor = "rgba(0, 200, 0, .7)";
  }
  changeCoords(x, y) {
    this.x = x;
    this.y = y;
  }
  drawBG() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.width / 2 - 10, canvas.height);
  }
  render() {
    let ctx = this.ctx;
    this.drawBG();
    ctx.beginPath();
    ctx.fillStyle = this.innerColor;
    ctx.strokeStyle = this.outerColor;

    if (upPressed) {
      if (this.y > 0) this.y -= 7;
    } else if (downPressed) {
      if (this.y < canvas.height - 100) this.y += 7;
    }

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.fill();

  }
  
  direction(dir) {
    switch (dir) {
      case "down":
        this.up = false;
        this.down = true;
        break;
      case "up":
        this.up = true;
        this.down = false;
        break;
    }
  }
}

class Opponent {

  constructor(x, y, width, height, ctx, innerColor, outerColor) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.ctx = ctx;
    this.speed = 5;
    this.innerColor = innerColor;
    this.outerColor = outerColor;
    this.count = 0;
  }
  changeCoords(x, y) {
    this.x = x;
    this.y = y;
  }

  drawBG() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(canvas.width / 2 + 10, 0, canvas.width / 2, canvas.height);
  }

  render() {
    let ctx = this.ctx;
    this.drawBG();
    ctx.beginPath();
    ctx.fillStyle = this.innerColor;
    ctx.strokeStyle = this.outerColor;

    if (this.y > mouseY && mouseY>0) {
      this.y-= 5;
    } else if(this.y<mouseY && mouseY<canvas.height) {
      this.y += 5;
    }

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.fill();

  }
}

function adjust_for_dpi(canvas_ele) {
  canvas_ele.style.width = "100%";
  canvas_ele.style.height = "100%";

  let canvas_gcs = getComputedStyle(canvas_ele);
  let canvas_css_width = canvas_gcs.getPropertyValue('width')
    .slice(0, -2);
  let canvas_css_height = canvas_gcs.getPropertyValue('height')
    .slice(0, -2);

  let dpi = window.devicePixelRatio;

  let setAttr = canvas_ele.setAttribute.bind(canvas_ele);
  setAttr('width', canvas_css_width * dpi);
  setAttr('height', canvas_css_height * dpi);

  let setCss = canvas_ele.style;
  setCss.width = canvas_css_width;
  setCss.height = canvas_css_height;
}

function drawBG(ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw_center_line(ctx) {
  let currentX = canvas.width / 2,
    currentY = 0;
  ctx.moveTo(currentX, currentY);
  let buffer = 2;
  let numberOfDashes = 30;
  let bufferSize = numberOfDashes * buffer;
  let heightOfDash = canvas.height / numberOfDashes;
  for (let i = 0; i < numberOfDashes; i++) {
    currentY += heightOfDash;
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.beginPath();
    currentY += buffer;
    ctx.moveTo(currentX, currentY);
  }
}

function init_ball(ctx) {
  ctx.beginPath();
  let ball_x = canvas.width / 2;
  let ball_y = canvas.height / 2;
  let ball_radius = 5;
  ctx.arc(ball_x, ball_y, ball_radius, 0, 2 * Math.PI);
  ball = new Ball(ball_x, ball_y, ball_radius);
  ctx.fillStyle = "white";
  ctx.save();
  ctx.shadowColor = '#999';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 15;
  ctx.shadowOffsetY = 15;
  ctx.strokeStyle = "purple";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function init_paddles(ctx) {

  function draw_player() {
    ctx.beginPath();
    let paddle_x = canvas.width / 4;
    let paddle_y = canvas.height / 2 - 50;
    ctx.fillStyle = "rgba(0, 150, 0, .2)";
    ctx.strokeStyle = "rgba(0, 200, 0, .7)";
    ctx.rect(paddle_x, paddle_y, 10, 100);
    ctx.stroke();
    ctx.fill();
    player = new Player(paddle_x, paddle_y, 2, 100, ctx);
  }

  function draw_opponent() {
    ctx.beginPath();
    let paddle_x = canvas.width / 4 * 3;
    let paddle_y = canvas.height / 2 - 50;
    ctx.fillStyle = "rgba(150, 0, 0, .2)";
    ctx.strokeStyle = "rgba(200, 0, 0, .7)";
    ctx.rect(paddle_x, paddle_y, 10, 100);
    ctx.stroke();
    ctx.fill();
    opponent = new Opponent(paddle_x, paddle_y, 2, 100, ctx, "rgba(150, 0, 0, .2)", "rgba(200, 0, 0, .7)");
  }
  draw_player();
  draw_opponent();

}

function add_keys(player, canvas) {
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 38:
        player.direction('up');
        break;
      case 40:
        player.direction('down');
        break;
    }
  }
  window.focus();
}

function draw_scores(ctx) {
  ctx.fillStyle = "white";
  ctx.font = '16px "Seven Segment"'
  ctx.fillText("Player 1: " + player_points, 20, 30);
  ctx.fillText("Player 2: " + opponent_points, canvas.width - 100, 30);
}

function winner(points, player){
  if (points==20){
    alert("El ganador es: Player "+player);
    window.location.reload();
  }

}

function check_for_collisions() {
  if (ball.x > canvas.width || ball.x < 0) {

  if (ball.x > canvas.width) addPoint("player");
  if (ball.x < 0) addPoint("opponent");
    
    
  } else if (ball.y >= canvas.height - ball.radius || ball.y <= 0 + ball.radius) {
    ball.changeAngle(360 - ball.angle);
    if (ball.y >= canvas.height - ball.radius) ball.y = canvas.height - ball.radius - 1;
    if (ball.y <= 0 + ball.radius) ball.y = ball.radius + 1;
  }
  if (ball.x - ball.radius < player.x + player.width && ball.x + ball.radius > player.x + player.width &&
ball.y - ball.radius > player.y && ball.y + ball.radius < player.y + player.height && ball.xunits < 0) {
  audio.play();
   ball.changeAngle( Math.floor(Math.random() * (175 - 180) + 175) - ball.angle);
   
  }
    if (ball.x + ball.radius > opponent.x - opponent.width && ball.x - ball.radius < opponent.x + opponent.width &&
ball.y - ball.radius >= opponent.y && ball.y + ball.radius <= opponent.y + opponent.height && ball.xunits > 0) {
  audio.play();
    ball.changeAngle( Math.floor(Math.random() * (185 - 175) + 175) - ball.angle);
  }
  
  function addPoint(playerORopponent) {
    switch(playerORopponent) {
      case "player": 
        player_points += 1;
        winner(player_points, 1);
      break;
      case "opponent":
        opponent_points += 1;
        winner(opponent_points, 2);
      break;
    }

    ball.changeAngle(180 - ball.angle);
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
}

function redraw() {
  adjust_for_dpi(canvas);
  drawBG(ctx);
  draw_center_line(ctx);
}

function keyDownHandler(e){
  if(e.keyCode==40)
    downPressed=true;
  else if(e.keyCode==38)
    upPressed=true;
}
 
function keyUpHandler(e){
   if(e.keyCode==40)
    downPressed=false;
   if(e.keyCode==38)
     upPressed=false;
}

adjust_for_dpi(canvas);
window.addEventListener('resize', redraw);

let player, opponent, ball;
let player_points = 0;
let opponent_points = 0;
var mouseY = 0;
init_paddles(ctx);
init_ball(ctx);


function draw() {
  drawBG(ctx);
  draw_center_line(ctx);
  player.render();
  opponent.render();
  ball.render();

  check_for_collisions();
  draw_scores(ctx);
  requestAnimationFrame(draw);
}

function mouseMove(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseY = evt.clientY-rect.top;
}

window.onload = function(){ 
  document.addEventListener("keydown",keyDownHandler,false);
  document.addEventListener("keyup",keyUpHandler,false);
  canvas.addEventListener("mousemove",mouseMove,false);
  requestAnimationFrame(draw);
};
