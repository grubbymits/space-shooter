"use strict";

class Entity {
  constructor(x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;
  }

  get img() {
    return this.sprite.img;
  }

  set img(sprite) {
    this.sprite = sprite;
  }
}

class Star extends Entity {
  constructor(x, y, speed) {
    super(x, y, speed, starSprite);
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
      this.speed = (Math.random() / 2) + 0.2;
    }
  }
}

class Laser extends Entity {
  constructor(x, y, speed, sprite) {
    super(x, y, speed, sprite);
    this.isFired = false;
  }
}

class EnemyLaser extends Entity {
  constructor(x, y, speed) {
    super(x, y, speed, enemyLaserSprite);
    this.sound = new Audio('res/audio/sfx_laser1.mp3');
    this.sound.load();
  }

  update() {
    if (this.isFired) {
      this.y += this.speed;
    }
    if (this.y > canvas.height) {
      this.isFired = false;
    }
  }
}

class PlayerLaser extends Entity {
  constructor(x, y, speed) {
    super(x, y, speed, playerLaserSprite);
    this.sound = new Audio('res/audio/sfx_laser2.mp3');
    this.sound.load();
  }

  update() {
    if (this.isFired) {
      this.y -= this.speed;
    }
    if (this.y < 0) {
      this.isFired = false;
    }
  }
}

class Enemy extends Entity {
  constructor(x, y, speed, sprite) {
    super(x, y, speed, sprite);
    this.deathSound = new Audio('res/audio/sfx_zap.mp3');
    this.deathSound.load();
    this.health = 1;
    this.lastShot = Date.now();
    this.laser = new EnemyLaser(this.x, this.y, 5);
  }

  update() {
    this.y += this.speed;
        
    if (this.y > canvas.height) {
      return true;
    }
    if (Date.now() > this.lastShot + this.fireRate) {
      if (!this.laser.isFired) {
        this.laser.x = this.x + this.img.width / 2;
        this.laser.y = this.y + this.img.height;
        this.laser.isFired = true;
        this.laser.sound.play();
        this.lastShot = Date.now();
      }
    }
    if (this.laser.isFired) {
      this.laser.update();
    }
    return false;
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health < 1) {
      return true;
    }
    return false;
  }
}

// 5 types of enemy:
// scout
// intercepter
// fighter
// bomber
// destroyer
var enemyHealths =    [ 7, 10, 13, 18, 20 ];
var enemySpeeds =     [ 1.75, 1.5, 1.25, 1, 0.75 ];
var enemyFirePowers = [ 1, 2, 3, 4, 5 ];
var enemyFireRates =  [ 4000, 5000, 6000, 80000, 10000 ];

function respawnEnemy(enemy, i) {
  enemy.deathSound.play();
  let type = getBoundedRandom(enemySprites.length, 0);
  enemy.x = getBoundedRandom(COLUMN_WIDTH / 2 + (COLUMN_WIDTH * i),
                             COLUMN_WIDTH * i);
  enemy.y = getBoundedRandom(-256, -128);
  enemy.img = enemySprites[type];
  enemy.speed = enemySpeeds[type];
  enemy.health = enemyHealths[type];
  enemy.firePower = enemyFirePowers[type];
  enemy.fireRate = enemyFireRates[type];
}

class Player extends Entity {
  constructor(x, y, sprite) {
    super(x, y, 5, sprite);
    this.maxLasers = maxNumLasers;
    this.isShooting = false;
    this.lastShot = Date.now();
    this.shootDelay = 100;
    this.score = 0;
    this.lives = 5;
    this.maxHealth = 4;
    this.health = 4;

    this.lasers = [];
    for (let i = 0; i < maxNumLasers; ++i) {
      let x = this.x;
      let y = this.y;
      this.lasers.push(new PlayerLaser(x, y, 5));
    }
    this.deathSound = new Audio('res/audio/sfx_lose.mp3');
    this.deathSound.load();
  }

  update() {
    this.isShooting = false;
  
    if (leftPressed) {
      if (this.x > this.speed) {
        this.x -= this.speed;
      }
    } else if (rightPressed) {
      if (this.x < canvas.width - this.img.width - this.speed) {
        this.x += this.speed;
      }
    }
    
    for (let i in this.lasers) {
      var laser = this.lasers[i];
      if (laser.isFired) {
        laser.update();
      } else if (spacePressed && !this.isShooting &&
                (Date.now() > this.lastShot + this.shootDelay)) {
        laser.x = this.x + this.img.width / 2;
        laser.y = this.y;
        laser.isFired = true;
        laser.sound.play();
        this.isShooting = true;
        this.lastShot = Date.now();
      }
    }
  }
}
