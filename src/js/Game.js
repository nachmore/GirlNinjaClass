var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Game = function(){};

InfiniteScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {

    //set up background
    this.game.world.setBounds(0, 0, 3500, this.game.height);
    this.bg= this.add.tileSprite(0, 0, this.game.world.width, this.game.cache.getImage('background_graveyard').height, 'non_existant');
    this.bg.fixedToCamera = true;
    this.bg.tileScale.x = 0.4;
    this.bg.tileScale.y = 0.4;

    // ground
    //this.grass = this.add.tileSprite(0,this.game.height-100,this.game.world.width,70,'grass');
    this.ground = this.add.tileSprite(0,this.game.height-70,this.game.world.width,70,'ground');
    
    // player default sprite + run animation
    this.player = this.game.add.sprite(this.game.width/2, this.game.height-90, 'ninja_run');
    this.player.animations.add('run');
    
    Animations.setPlayer(this.player);

    // animations list
    this.player.animations.add('jump');
    this.player.animations.add('attack');

    //create the fleas
    this.generateFleas();
    //and the toy mounds
    this.generateMounds();
    
    //put everything in the correct order (the grass will be camoflauge),
    //but the toy mounds have to be above that to be seen, but behind the
    //ground so they barely stick up
    //this.game.world.bringToTop(this.grass);
    this.game.world.bringToTop(this.mounds);
    this.game.world.bringToTop(this.ground);

    //enable physics on the player and ground
    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.ground);

    //player gravity
    this.player.body.gravity.y = 1000;
    
    //so player can walk on ground
    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;

    //properties when the player is digging, scratching and standing, so we can use in update()
    var playerDigImg = this.game.cache.getImage('playerDig');
    this.player.animations.add('dig');
    this.player.digDimensions = {width: playerDigImg.width, height: playerDigImg.height};
    
    var playerScratchImg = this.game.cache.getImage('playerScratch');
    this.player.animations.add('scratch');
    this.player.scratchDimensions = {width: playerScratchImg.width, height: playerScratchImg.height};
    
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    
    Animations.ninjaRun();

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    //...or by swiping
    this.swipe = this.game.input.activePointer;

    //sounds
    this.barkSound = this.game.add.audio('bark');
    this.whineSound = this.game.add.audio('whine');
    
    //set some variables we need throughout the game
    this.isJumping = false;
    this.isAttacking = false;

    // number of times the player has been hit
    this.hits = 0;

    this.wraps = 0;
    this.points = 0;
    this.wrapping = true;
    this.stopped = false;
    
    //create an array of possible toys that can be gathered from toy mounds
    var bone = this.game.add.sprite(0, this.game.height-130, 'bone');
    var ball = this.game.add.sprite(0, this.game.height-130, 'ball');
    bone.visible = false;
    ball.visible = false;
    this.toys = [bone, ball];
    this.currentToy = bone;
    
    //stats
    var style1 = { font: "20px Raleway", fill: "#ff0"};
    var t1 = this.game.add.text(200, 20, "Points:", style1);
    var t2 = this.game.add.text(this.game.width-120, 20, "Health:", style1);
    t1.fixedToCamera = true;
    t2.fixedToCamera = true;

    var style2 = { font: "26px Raleway", fill: "#00ff00"};
    this.pointsText = this.game.add.text(270, 13, "", style2);
    this.healthText = this.game.add.text(this.game.width-50, 13, "", style2);
    
    this.pointsText.fixedToCamera = true;
    this.healthText.fixedToCamera = true;
    
  },
  
  update: function() {

    //collision
    this.game.physics.arcade.collide(this.player, this.ground, this.playerHit, null, this);
    this.game.physics.arcade.collide(this.player, this.fleas, this.playerBit, null, this);
    this.game.physics.arcade.overlap(this.player, this.mounds, this.collect, this.checkDig, this);
    
    this.refreshStats();

    //only respond to keys and keep the speed if the player is alive
    //we also don't want to do anything if the player is stopped for scratching or digging
    if(this.player.alive && !this.stopped) {
      
      this.player.body.velocity.x = 300;
      
      //We do a little math to determine whether the game world has wrapped around.
      //If so, we want to destroy everything and regenerate, so the game will remain random
      if(!this.wrapping && this.player.x < this.game.width) {
        //Not used yet, but may be useful to know how many times we've wrapped
        this.wraps++;
        
        //We only want to destroy and regenerate once per wrap, so we test with wrapping var
        this.wrapping = true;
        this.fleas.destroy();
        this.generateFleas();
        this.mounds.destroy();
        this.generateMounds();
        
        //put everything back in the proper order
        //this.game.world.bringToTop(this.grass);
        this.game.world.bringToTop(this.mounds);
        this.game.world.bringToTop(this.ground);
      }
      else if(this.player.x >= this.game.width) {
        this.wrapping = false;
      }

      this.updateBackground();
      this.handleCursorKeys();
      
      //The game world is infinite in the x-direction, so we wrap around.
      //We subtract padding so the player will remain in the middle of the screen when
      //wrapping, rather than going to the end of the screen first.
      this.game.world.wrap(this.player, -(this.game.width/2), false, true, false);
    }

  },
  updateBackground: function() {
    if (RulesEngine.game.background != null && this.bg.key != RulesEngine.game.background) {
      this.bg.loadTexture(RulesEngine.game.background, 0, false);
      this.bg.refreshTexture = true;
    }
  },
  handleCursorKeys: function() {

    // note that only one trigger per-cursor is supported. Multiple rules will
    // be stomped in favour of the highest number rule (i.e. Last-In)
    
    if (this.cursors.up.isDown) {
      if (RulesEngine.player.triggers.up == RulesEngine.player.actions.Jump) {
        this.playerJump();
      } else if (RulesEngine.player.triggers.up == RulesEngine.player.actions.Attack) {
        this.playerAttack();
      }
    }

    if (this.cursors.down.isDown) {
      if (RulesEngine.player.triggers.down == RulesEngine.player.actions.Jump) {
        this.playerJump();
      }
    }

    if (this.cursors.left.isDown) {
      if (RulesEngine.player.triggers.left == RulesEngine.player.actions.Jump) {
        this.playerJump();
      }
    }

    if (this.cursors.right.isDown) {
      if (RulesEngine.player.triggers.right == RulesEngine.player.actions.Jump) {
        this.playerJump();
      }
    }

  },
  //show updated stats values
  refreshStats: function() {
    this.pointsText.text = this.points;
    this.healthText.text = RulesEngine.player.maxHealth - this.hits;
  },
  playerHit: function(player, blockedLayer) {
    if(player.body.touching.right) {
      //can add other functionality here for extra obstacles later
    } else if (player.body.touching.down && this.isJumping == true) {
      Animations.ninjaRun();

      this.isJumping == false;
    }
  },
  //the player has just been bitten by a flea
  playerBit: function(player, flea) {
    //remove the flea that bit our player so it is no longer in the way
    //flea.destroy();
    
    Animations.ninjaAttack();

    // register a hit
    this.hits++;
    
    //change sprite image
    //this.player.loadTexture('playerScratch');
    //this.player.animations.play('scratch', 10, true);
    
    //play audio
    this.whineSound.play();
    
    this.player.body.x += 10;

    //wait a couple of seconds for the scratch animation to play before continuing
    this.stopped = true;
    this.player.body.velocity.x = 0;
    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.playerScratch, this);
  },
  //the player is collecting a toy from a mound
  collect: function(player, mound) {
    //this is called continuously while player is on mound, but we only want to do it once
    if (!this.stopped) {
      //change image and update the body size for the physics engine
      this.player.loadTexture('playerDig');
      this.player.animations.play('dig', 10, true);
      this.player.body.setSize(this.player.digDimensions.width, this.player.digDimensions.height);
    
      //we can't remove the toy mound until digging is finished, so we have to set a variable for
      //the function called from the timer (below)
      this.currentMound = mound;
    
      //we stop a couple of seconds for the dig animation to play
      this.stopped = true;
      this.player.body.velocity.x = 0;
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.playerDig, this);
    }
  },
  gameOver: function() {
    this.game.state.start('Game');
  },
  //checks to see that the player is swiping down or pressing a down arrow while on a toy mound
  checkDig: function() {
    if (this.cursors.down.isDown || (this.swipe.isDown && (this.swipe.position.y > this.swipe.positionDown.y))) {
      return true;
    }
    else {
      return false;
    }
  },
  playerJump: function() {
    //when the ground is a sprite, we need to test for "touching" instead of "blocked"
    if (this.player.body.touching.down) {
      this.player.body.velocity.y -= 600;

      if (RulesEngine.player.animations.jump)
        Animations.ninjaJump();

      this.isJumping = true;
    }    
  },
  playerAttack: function() {
    if (this.isAttacking != true) {
      Animations.ninjaAttack();
      this.isAttacking = true;
      // not the greatest since something else could happen in the meanwhile
      this.game.time.events.add(500, this.playerStopAttack, this);
    }
  },
  playerStopAttack: function() {
    Animations.ninjaRun();

    this.isAttacking = false;
  },
  playerDig: function() {
    //play audio
    this.barkSound.play();

    //grab the location before we destroy the toy mound so we can place the toy
    var x = this.currentMound.x;
  
    //remove toy the mound sprite now that the toy is collected
    this.currentMound.destroy();
    
    //refresh our points stats
    this.points += 5;
    this.refreshStats();
    
    //randomly pull a toy from the array
    this.currentToy = this.toys[ Math.floor( Math.random() * this.toys.length ) ];
    
    //make the toy visible where the mound used to be
    this.currentToy.visible = true;
    this.currentToy.x = x;
    
    //and make it disappear again after one second
    this.game.time.events.add(Phaser.Timer.SECOND, this.currentToyInvisible, this);
    
    //Animations.run(this.player);
    this.stopped = false;
  },
  currentToyInvisible: function() {
    this.currentToy.visible = false;
  },
  playerScratch: function() {
    this.stopped = false;
    
    if (this.hits >= RulesEngine.player.maxHealth) {
      //set to dead (even though our player isn't actually dead in this game, just running home)
      //doesn't affect rendering
      this.player.alive = false;
      
      //destroy everything before player runs away so there's nothing in the way
      this.fleas.destroy();
      this.mounds.destroy();

      //We switch back to the standing version of the player
      
      //...then run home
      this.player.anchor.setTo(.5, 1);
      this.player.scale.x = -1;
      this.player.body.velocity.x = -1000;

      //we want the player to run off the screen in this case
      this.game.camera.unfollow();

      //go to gameover after a few miliseconds
      this.game.time.events.add(1500, this.gameOver, this);
    } else {
      //change image and update the body size for the physics engine
      Animations.ninjaRun();
    }
  },
  generateMounds: function() {
    this.mounds = this.game.add.group();

    //enable physics in them
    this.mounds.enableBody = true;

    //phaser's random number generator
    var numMounds = this.game.rnd.integerInRange(0, 5)
    var mound;

    for (var i = 0; i < numMounds; i++) {
      //add sprite within an area excluding the beginning and ending
      //  of the game world so items won't suddenly appear or disappear when wrapping
      var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
      mound = this.mounds.create(x, this.game.height-75, 'mound');
      mound.body.velocity.x = 0;
    }

  },
  generateFleas: function() {
    this.fleas = this.game.add.group();
    
    //enable physics in them
    this.fleas.enableBody = true;

    //phaser's random number generator
    var numFleas = this.game.rnd.integerInRange(1, 5)
    var flea;

    for (var i = 0; i < numFleas; i++) {
      //add sprite within an area excluding the beginning and ending
      //  of the game world so items won't suddenly appear or disappear when wrapping
      var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
      flea = this.fleas.create(x, this.game.height - 227, 'zombie_walk');

      flea.animations.add('walk');
      flea.play('walk', 10, true);

      //physics properties
      flea.body.velocity.x = this.game.rnd.integerInRange(-20, 0);
      
      flea.body.immovable = false;
      flea.body.collideWorldBounds = false;
    }
  },
  render: function()
    {
        //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");   
    }
};