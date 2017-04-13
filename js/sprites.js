class Sprite {
  constructor(name) {
    this.img = new Image();
    this.img.src = 'res/img/' + name + '.png';
  }
}

var starSprite = new Sprite('star');

var playerSprite = new Sprite('player_orange1');
var playerLivesSprite = new Sprite('lives_orange');
var playerLaserSprite = new Sprite('laser_green1');
var enemyLaserSprite = new Sprite('laser_red1');

var enemySprites = [];
for (let i = 0; i < 5; ++i) {
  let enemySprite = new Sprite('enemyBlue' + (i + 1)); 
  enemySprites.push(enemySprite);
}

var numberSprites = [];
for (let i = 0; i < 10; ++i) {
  let sprite = new Sprite(i);
  numberSprites.push(sprite);
}

