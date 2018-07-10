var RulesEngine = RulesEngine || null;

if (RulesEngine === null) {

	RulesEngine = function() {
    this.game = {
      background: null,
      drawHealth: false,
      drawPoints: false,
    };

    this.zombie = new function() {
      this.whenHitRunAway = false;
      this.whenHitDie = false; // TODO: collides
      this.whenAttackedDie = false;
      this.playDeathAnimation = false;
      this.disappearOnDeath = false;
    };

    this.player = new function() {

      this.maxHealth = 1;
      this.healthLostPerHit = 0;
      this.retreatOnDeath = false;

      this.actions = Object.freeze({
        Run: 1,
        Jump: 2,
        Attack: 3,
      });

      this.triggers = new function() {
        this.up    = null;
        this.down  = null;
        this.left  = null;
        this.right = null;
      }

      this.whenMeetZombieAction = null;
      this.whenAttackAction = null;

      this.animations = {
        jump: false,
        attack: false,
      };
    }
  };

	RulesEngine.prototype = {

	}

	RulesEngine = new RulesEngine();
}