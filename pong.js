// Seleccionar elemento canvas
const canvas = document.getElementById("pong");

// getContext del canvas = métodos y propiedades para dibujar y hacer muchas cosas en el canvas
const ctx = canvas.getContext('2d');

// Cargar sonidos
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "hit.mp3";
wall.src = "wall.mp3";
comScore.src = "comScore.mp3";
userScore.src = "userScore.mp3";

// Objecto balon
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// Paleta de usuario
const user = {
    x : 0, // lado izquierdo del canvas
    y : (canvas.height - 70)/2, // -90 la altura del paddle
    width : 10,
    height : 70,
    score : 0,
    color : "WHITE"
}

// La otra paleta
const com = {
    x : canvas.width - 10, // - ancho de paleta
    y : (canvas.height - 70)/2, // -90 la altura del paddle
    width : 10,
    height : 70,
    score : 0,
    color : "WHITE"
}

// Red
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// Dibujar un rectángulo, se usará para dibujar paletas
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Dibujar círculo, se utilizará para dibujar la bola
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// Movimiento con el raton
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// Cuando COM o USER marca, reiniciamos la pelota
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// Dibujar la red
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Dibujar el texto
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Cuando detecta colision
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Función de actualización, la función que hace todos los cálculos
function update(){
    
    // Cambiar la puntuación de los jugadores, si la pelota va a la izquierda "ball.x <0" computadora gana, de lo contrario si "ball.x> canvas.width" el usuario gana
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    
    // La pelota tiene una velocidad
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // Ca computadora juega por sí misma, y debemos ser capaces de vencerla
    // IA simple
    com.y += ((ball.y - (com.y + com.height/2)))*1;
    
    // Cuando la bola choca con las paredes superior e inferior, invertimos la velocidad de y.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    
    //Comprobamos si la paleta golpea al usuario o la paleta de com
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // Si la pelota golpea una paleta
    if(collision(ball,player)){
        // Sonido de juego
        hit.play();
        // Comprobamos donde la pelota golpea la paleta
        let collidePoint = (ball.y - (player.y + player.height/2));
        // Normalizar el valor de collidePoint, necesitamos obtener números entre -1 y 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // uando la pelota golpea la parte superior de una paleta, queremos que la pelota tome un ángulo de -45 grados
        // Cuando la pelota golpea el centro de la paleta, queremos que la pelota tome un ángulo de 0 grados
        // Cuando la pelota golpea la parte inferior de la paleta, queremos que la pelota tome 45 grados
        // Math.PI/4 = 45 grados
        let angleRad = (Math.PI/4) * collidePoint;
        
        // Cambiar la dirección de la velocidad X e Y
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // Acelera la pelota cada vez que una paleta la golpea.
        ball.speed += 0.1;
    }
}

// Función de render, la función que hace todo el dibujo
function render(){
    
    // Limpiar el canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // Dibuja la puntuación del usuario a la izquierda
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // Dibuja la puntuación COM a la derecha
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    // Dibuja la red
    drawNet();
    
    // Dibujar la paleta del usuario
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // Dibujar la paleta de la COM
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // Dibuja la bola
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}
// Número de fotogramas por segundo
let framePerSecond = 50;

//Llamar a la función del juego 50 veces cada 1 segundo
let loop = setInterval(game,1000/framePerSecond);