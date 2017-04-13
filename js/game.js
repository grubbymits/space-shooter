"use strict";

var canvas = document.getElementById('mainCanvas');
var context = canvas.getContext('2d');
var COLUMN_WIDTH = canvas.width / numEnemies;
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;

context.fillStyle = '#002B36';
context.fillRect(0, 0, canvas.width, canvas.height);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

 
function getBoundedRandom(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/* Event handlers */
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  } else if (e.keyCode == 32) {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  } else if (e.keyCode == 32) {
    spacePressed = false;
  }
}

/* Game logic */
function respawnEnemy(enemy, i) {
  enemy.deathSound.play();
  enemy.x = getBoundedRandom(COLUMN_WIDTH / 2 + (COLUMN_WIDTH * i),
                             COLUMN_WIDTH * i);
  enemy.y = -128;
  let index = getBoundedRandom(enemySprites.length, 0);
  enemy.img = enemySprites[index];
}

function updateStars(stars) {
  for (let star of stars) {
    star.update();
  }
}

function updateEnemies(enemies) {
  let escapedEnemies = 0;
  for (let i in enemies) {
    let enemy = enemies[i];
    if (enemy.update()) {
      respawnEnemy(enemy, i);
      ++escapedEnemies;
    }
  }
  return escapedEnemies;
}

function detectCollisions(player, enemies) {
  for (let i in player.lasers) {
    let laser = player.lasers[i];
    if (!laser.isFired) {
      continue;
    }
    let column = Math.floor(laser.x / COLUMN_WIDTH);
    let enemy = enemies[column];
      
    if ((laser.x + laser.img.width >= enemy.x) &&
        (laser.x < enemy.x + enemy.img.width) &&
        (laser.y > enemy.y) &&
        (laser.y < enemy.y + enemy.img.height)) {
  
      laser.isFired = false;
      player.score++;
      respawnEnemy(enemy, column);
    }
  }
  let start = Math.floor(player.x / COLUMN_WIDTH);
  let end = Math.ceil(player.x / COLUMN_WIDTH);
  if (end >= numEnemies) {
    end = numEnemies - 1;
  }
  for (let i = start; i <= end; ++i) {
    let enemy = enemies[i];
    if ((player.x + player.img.width >= enemy.x) &&
        (player.x < enemy.x + enemy.img.width) &&
        (player.y > enemy.y) &&
        (player.y < enemy.y + enemy.img.height)) {
      player.score++;
      respawnEnemy(enemy, i);
    }
  }
}

/* Begin */
window.onload = function() {
  let stars = [];
    
  for (let i = 0; i < 40; ++i) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let speed = (Math.random() / 2) + 0.2;
    let star = new Star(x, y, speed);
    stars.push(star);
  }
    
  let enemies = [];
  for (let i = 0; i < 8; ++i) {
    let index = getBoundedRandom(enemySprites.length, 0);
    let enemySprite = enemySprites[index];
    let x = getBoundedRandom(COLUMN_WIDTH / 2 + (COLUMN_WIDTH * i),
                             COLUMN_WIDTH * i);
    let enemy = new Enemy(x, 0, 1, enemySprite);
    enemies.push(enemy);
  }
  
  let x = canvas.width / 2;
  let y = canvas.height - 70;
  var player = new Player(x, y, playerSprite);
  
  
  var maxFrameSkip = 10;
  var FPS = 1000 / 60;
  var nextUpdate = Date.now();
  
  /* Game loop */
  function update() {
    let framesSkipped = 0;

    if (!document.hasFocus()) {
      nextUpdate = Date.now() + FPS;
    } else {
      while (nextUpdate < Date.now() && framesSkipped < maxFrameSkip) {
        ++framesSkipped;
        nextUpdate += FPS;
      
        if (player.lives > 0) {
          updateStars(stars);
          detectCollisions(player, enemies);
          let escapedEnemies = updateEnemies(enemies);
          player.lives -= escapedEnemies;
          if (player.lives < 0) {
            player.lives = 0;
          }
          player.update();
        } else {
          context.font="30px serif";
          context.fillStyle = 'orange';
          context.fillText("GAME OVER", (canvas.width / 2) - 100, 
                           canvas.height / 2);
          player.deathSound.play();
          return;
        }
      }
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawEntities(stars);
      drawEntities(enemies);
      drawPlayer(player);
    }
    
    window.requestAnimationFrame(update);
  }    
  window.requestAnimationFrame(update);
}
