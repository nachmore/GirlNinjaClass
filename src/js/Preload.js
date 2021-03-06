var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.Preload = function(){};

InfiniteScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.spritesheet('ninja_run', 'assets/images/ninja_run.png', 92, 126.8, 10);
    this.load.spritesheet('ninja_jump', 'assets/images/ninja_jump.png', 92, 125.2, 10);
    this.load.spritesheet('ninja_attack', 'assets/images/ninja_attack.png', 118, 127, 10);

    this.load.spritesheet('zombie_walk', 'assets/images/zombie_walk.png', 145, 160, 10);
    this.load.spritesheet('zombie_die', 'assets/images/zombie_die.png', 175, 160, 12);

    this.load.image('background_graveyard', 'assets/images/background.png');
    this.load.image('background_graveyard_magenta', 'assets/images/background_magenta.png');
    this.load.image('background_red', 'assets/images/background_red.jpg');
    this.load.image('background_party', 'assets/images/background_party.jpg');
    this.load.image('background_placeholder', 'assets/images/background_placeholder.png');

    this.load.image('ground', 'assets/images/ground.png');
    

    
    this.load.audio('whine', ['assets/audio/whine.ogg', 'assets/audio/whine.mp3']);
    this.load.audio('bark', ['assets/audio/bark.ogg', 'assets/audio/bark.mp3']);
    
  },
  create: function() {
    this.state.start('Game');
  }
};