var Animations = Animations || null;

if (Animations === null) {

	Animations = function(){};

	Animations.prototype = {

		// if you don't call this first, bad things will happen
		setPlayer: function(player) {
			this.player = player;
		},

		animate: function(texture, animation, speed=10) {

			if (this.player.key != texture) {
				this.player.loadTexture(texture);
			}
			
			if (this.player.animations.currentAnim.name != animation) {
				this.player.play(animation, speed, true);
			}

			// currently not needed since we're not really changing the size
			//this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);

		},

		ninjaRun: function() {
			this.animate('ninja_run', 'run', 30);
		},

		ninjaJump: function() {
			this.animate('ninja_jump', 'jump');
		},

		ninjaAttack: function() {
			this.animate('ninja_attack', 'attack', 30);
		}

	}

	Animations = new Animations();
}