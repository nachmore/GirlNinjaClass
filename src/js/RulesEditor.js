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
          }
        },
        Bloat: 0,
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
            Attack: null,
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
        Attacks: 0,
        "Gets Hit By Zombie": 0,
        "Hits an Object": 0,
      },
      "Zombie": {
        "Attacks": 0,
        "Gets Hit By Player": 0
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
  deleteRule: function(index) {
    var rule = this.rules[index];
    this.rules[index] = null;

    rule.undo();
    
    var divRule = document.getElementById("rule" + index);
    this.elems.divRules.removeChild(divRule);
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