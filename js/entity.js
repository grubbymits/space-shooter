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
  }

  update() {
    this.y += this.speed;
        
    if (this.y > canvas.height) {
      return true;
    }
    return false;
  }
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
