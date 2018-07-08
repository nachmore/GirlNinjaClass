var RulesEngine = RulesEngine || null;

if (RulesEngine === null) {

	RulesEngine = function() {
    this.zombie = new function() {
      this.whenHitRunAway = false;
      this.whenHitDie = false;
    };

    this.player = new function() {

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
      this.whenJumpAction = null;
      this.whenAttackAction = null;
    }
  };

	RulesEngine.prototype = {

	}

	RulesEngine = new RulesEngine();
}