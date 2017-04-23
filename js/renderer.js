
/* Drawing functions */ 
function drawEntity(entity) {
  context.drawImage(entity.img, entity.x, entity.y);
}

function drawEntities(entities) {
  for (let i in entities) {
    let entity = entities[i];
    context.drawImage(entity.img, entity.x, entity.y);
    if (entity.laser && entity.laser.isFired) {
      context.drawImage(entity.laser.img, entity.laser.x, entity.laser.y);
    }
  }
}

function drawStats(player) {
  context.drawImage(playerLivesSprite.img, 5, 5);
  context.drawImage(numberSprites[player.lives].img, 30, 8);
  
  let score = player.score;
  let thousands = Math.floor(player.score / 1000);
  context.drawImage(numberSprites[thousands].img, 5, 30);
  
  score -= thousands * 1000;
  let hundreds = Math.floor(score / 100);
  context.drawImage(numberSprites[hundreds].img, 15, 30);
  
  score -= hundreds * 100;
  let tens = Math.floor(score / 10);
  context.drawImage(numberSprites[tens].img, 25, 30);
  
  score -= tens * 10;
  context.drawImage(numberSprites[score].img, 35, 30);
}

function drawPlayer(player) {
  drawStats(player);
  drawEntity(player);
  if (player.health < player.maxHealth) {
    if (player.health > 0) {
      context.drawImage(playerDamageSprites[player.health-1].img,
                        player.x, player.y);
    }
  }
  for (let i in player.lasers) {
    let laser = player.lasers[i];
    if (laser.isFired) {
      drawEntity(laser);
    }
  }
}
