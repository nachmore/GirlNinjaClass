var RulesEditor = RulesEditor || function () { };

RulesEditor.prototype = {

  elems: {},

  playerActions: {
    Player: {
      Jump: 0,
      Attack: 0,
    }
  },

  validTriggers: {},

  get curActor() { return this.elems.selectActor[this.elems.selectActor.selectedIndex].text; },
  get curSituation() { return this.elems.selectSituation[this.elems.selectSituation.selectedIndex].text; },
  get curTarget() { return this.elems.selectTarget[this.elems.selectTarget.selectedIndex].text; },
  get curAction() { return this.elems.selectAction[this.elems.selectAction.selectedIndex].text; },

  init: function () {

    this.initValidTriggers();

    this.rules = [];

    this.elems.selectActor = document.getElementById("actor");
    this.elems.selectSituation = document.getElementById("situation");
    this.elems.selectTarget = document.getElementById("target");
    this.elems.selectAction = document.getElementById("action");

    this.elems.divRules = document.getElementById("existing_rules");

    this.elems.selectActor.onchange = function () { RulesEditor.updateSituations(); };
    this.elems.selectSituation.onchange = function () { RulesEditor.updateTargets(); };
    this.elems.selectTarget.onchange = function () { RulesEditor.updateActions(); }

    // this will set off an onchange() cascade
    this.initSelect(this.elems.selectActor, this.validTriggers);
  },

  // init once the object is constructed so that we have access to internal properties such as playerActions

  // TODO: This needs to be in its own set of files
  // TODO: Need to create a DefaultRules structure to reset to defaults on undo
  initValidTriggers: function () {

    this.validTriggers = {
      Game: {
        Load: {
          Background: {
            "Draw Graveyard": {
              apply: function() {
                RulesEngine.game.background = "background_graveyard";
              },
              undo: function() {
                RulesEngine.game.background = "non_existant";
              }
            },
            "Draw Pink Moon": {
              apply: function() {
                RulesEngine.game.background = "background_graveyard_magenta";
              },
              undo: function() {
                RulesEngine.game.background = "non_existant";
              }            
            },
            "Draw Party": {
              apply: function() {
                RulesEngine.game.background = "background_party";
              },
              undo: function() {
                RulesEngine.game.background = "non_existant";
              }            
            },
            "Draw Red": {
              apply: function() {
                RulesEngine.game.background = "background_red";
              },
              undo: function() {
                RulesEngine.game.background = "non_existant";
              }            

            },
            "Draw Placeholder": {
              apply: function() {
                RulesEngine.game.background = "background_placeholder";
              },
              undo: function() {
                RulesEngine.game.background = "non_existant";
              }            
            }
          },
          "Player Health": {
            "Be 1": {
              apply: function() {
                RulesEngine.player.maxHealth = 1;
              },
              undo: function() {
                RulesEngine.player.maxHealth = 1;
              }
            },
            "Be 2": {
              apply: function() {
                RulesEngine.player.maxHealth = 2;
              },
              undo: function() {
                RulesEngine.player.maxHealth = 2;
              }
            },
            "Be 3": {
              apply: function() {
                RulesEngine.player.maxHealth = 3;
              },
              undo: function() {
                RulesEngine.player.maxHealth = 3;
              }
            },
            "Be 4": {
              apply: function() {
                RulesEngine.player.maxHealth = 4;
              },
              undo: function() {
                RulesEngine.player.maxHealth = 4;
              }
            },
            "Be 5": {
              apply: function() {
                RulesEngine.player.maxHealth = 5;
              },
              undo: function() {
                RulesEngine.player.maxHealth = 5;
              }
            },
          },
          UI: {
            'Should Draw Health': {
              apply: function() {
                RulesEngine.game.drawHealth = true;
              },
              undo: function() {
                RulesEngine.game.drawHealth = false;
              }
            },
            'Should Draw Points': {
              apply: function() {
                RulesEngine.game.drawPoints = true;
              },
              undo: function() {
                RulesEngine.game.drawPoints = false;
              }
            }
          }
        },
      },
      "Human Player": {
        "Presses Up": {
          Player: {
            Jump: {
              apply: function () {
                RulesEngine.player.triggers.up = RulesEngine.player.actions.Jump;
              },
              undo: function () {
                RulesEngine.player.triggers.up = null;
              }
            },
            Attack: {
              apply: function () {
                RulesEngine.player.triggers.up = RulesEngine.player.actions.Attack;
              },
              undo: function () {
                RulesEngine.player.triggers.up = null;
              }
            },
          },
        },
        "Presses Down": {
          Player: {
            Jump: {
              apply: function () {
                RulesEngine.player.triggers.down = RulesEngine.player.actions.Jump;
              },
              undo: function () {
                RulesEngine.player.triggers.down = null;
              }
            },
            Attack: null,
          },
        },
        "Presses Left": {
          Player: {
            Jump: {
              apply: function () {
                RulesEngine.player.triggers.left = RulesEngine.player.actions.Jump;
              },
              undo: function () {
                RulesEngine.player.triggers.left = null;
              }
            },
            Attack: null,
          },
        },
        "Presses Right": {
          Player: {
            Jump: {
              apply: function () {
                RulesEngine.player.triggers.right = RulesEngine.player.actions.Jump;
              },
              undo: function () {
                RulesEngine.player.triggers.right = null;
              }
            },
            Attack: null,
          },
        },
      },
      "Ninja": {
        Jumps: {
          Animations: {
            "Play Jump Animation": {
              apply: function() {
                RulesEngine.player.animations.jump = true;
              },
              undo: function() {
                RulesEngine.player.animations.jump = false;
              }
            }
          },
        },
        Attacks: {
          Zombie: {
            "Should Die": {
              apply: function() {
                RulesEngine.zombie.whenAttackedDie = true;
              },
              undo: function() {
                RulesEngine.zombie.whenAttackedDie = false;
              }
            }
          },
          Animations: {
            "Play Attack Animation": {
              apply: function() {
                RulesEngine.player.animations.attack = true;
              },
              undo: function() {
                RulesEngine.player.animations.attack = false;
              }
            }
          }
        },
        "Gets Hit By Zombie": {
          Health: {
            "Drop by 1": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 1;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Drop by 2": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 2;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Drop by 3": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 3;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Drop by 4": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 4;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Drop by 5": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 5;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
          },
          "Health is 0 or below": {
            "Retreat!": {
              apply: function() {
                RulesEngine.player.retreatOnDeath = true;
              },
              undo: function() {
                RulesEngine.player.retreatOnDeath = false;
              }
            }
          }
        },
      },
      "Zombie": {
        "Attacks Player": {
          Player: {
            "Loses 1 Health": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 1;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Loses 2 Health": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 2;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Loses 3 Health": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 3;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Loses 4 Health": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 4;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
            "Loses 5 Health": {
              apply: function() {
                RulesEngine.player.healthLostPerHit = 5;
              },
              undo: function() {
                RulesEngine.player.healthLostPerHit = 0;
              }
            },
          }
        },
        "Dies": {
          Zombie: {
            "Should Disappear": {
              apply: function() {
                RulesEngine.zombie.disappearOnDeath = true;
              },
              undo: function() {
                RulesEngine.zombie.disappearOnDeath = false;
              }
            },
            "Play Death Animation": {
              apply: function() {
                RulesEngine.zombie.playDeathAnimation = true;
              },
              undo: function() {
                RulesEngine.zombie.playDeathAnimation = false;
              }
            }
          }
        },
        "Collides With Player": {
          Zombie: {
            "Should Die": {
              apply: function() {
                RulesEngine.zombie.whenHitDie = true;
              },
              undo: function() {
                RulesEngine.zombie.whenHitDie = false;
              }
            }
          }
        }
      }
    };
  },

  updateSituations: function () {
    this.initSelect(this.elems.selectSituation, this.validTriggers[this.curActor]);
  },

  updateTargets: function () {
    this.initSelect(this.elems.selectTarget, this.validTriggers[this.curActor][this.curSituation]);
  },

  updateActions: function () {
    this.initSelect(this.elems.selectAction, this.validTriggers[this.curActor][this.curSituation][this.curTarget]);
  },

  initSelect: function (select, options) {
    select.innerHTML = "";

    for (var option in options) {
      this.addOption(select, option);
    }

    if (typeof select.onchange == "function")
      select.onchange.apply(select);
  },

  addOption: function(select, text) {
    var elem = document.createElement("option");
    elem.text = text;

    select.add(elem);
  },
  deleteRule: function(index, rerun = true) {
    var rule = this.rules[index];
    this.rules[index] = null;

    rule.undo();
    
    var divRule = document.getElementById("rule" + index);
    this.elems.divRules.removeChild(divRule);

    if (rerun)
      this.runAllRules();
  },
  addRule: function () {

    var index = this.rules.push(this.validTriggers[this.curActor][this.curSituation][this.curTarget][this.curAction]) - 1;

    this.rules[index].apply();

    var text = '<div id="rule' + index + '" class="rule">' + 
                '<button class="delete_rule_btn" onclick="javascript:RulesEditor.deleteRule(' + index + ')">💩</button>' +
                'When <span class="variable">'+ this.curActor + '</span></b> ' + 
                '<span class="variable">' + this.curSituation + '</span>' + 
                 '<div class="rule_action">' + 
                   'Then <span class="variable">' + this.curTarget + '</span> ' + 
                   'should <span class="variable">' + this.curAction + '</span>' + 
                 '</div>' +
               '</div>';

    this.elems.divRules.innerHTML += text;
  },
  runAllRules: function() {
    for (var index = 0; index < this.rules.length; index++) {
      if (this.rules[index] != null)
        this.rules[index].apply();
    }
  }
}

RulesEditor = new RulesEditor();