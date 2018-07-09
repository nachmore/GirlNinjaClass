var RulesEditor = RulesEditor || function() {};

RulesEditor.prototype = {

  elems: {},

  playerActions: {
    Player: {
      Jump: 0,
      Attack: 0,
    }
  },

  validTriggers: {},

  get curActor()     {return this.elems.selectActor[this.elems.selectActor.selectedIndex].text;},
  get curSituation() {return this.elems.selectSituation[this.elems.selectSituation.selectedIndex].text;},
  get curTarget()    {return this.elems.selectTarget[this.elems.selectTarget.selectedIndex].text;},
  get curAction()    {return this.elems.selectAction[this.elems.selectAction.selectedIndex].text; },

  init: function() {

    this.initValidTriggers();

    this.elems.selectActor     = document.getElementById("actor");
    this.elems.selectSituation = document.getElementById("situation");
    this.elems.selectTarget    = document.getElementById("target");
    this.elems.selectAction     = document.getElementById("action");

    this.elems.selectActor.onchange     = function() {RulesEditor.updateSituations();};
    this.elems.selectSituation.onchange = function() {RulesEditor.updateTargets();};
    this.elems.selectTarget.onchange    = function() {RulesEditor.updateActions();}

    // this will set off an onchange() cascade
    this.initSelect(this.elems.selectActor, this.validTriggers);
  },

  // init once the object is constructed so that we have access to internal properties such as playerActions
  initValidTriggers: function() {
    
    this.validTriggers = {
      Game: {
        Load: 0,
        Bloat: 0,
      },
      "Human Player": {
        "Presses Up": {
          Player: {
            Jump: {
              apply: function() {},
              undo: function() {}
            },
            Attack: null,
          },
        },
        "Presses Down": RulesEditor.playerActions,
        "Presses Left": RulesEditor.playerActions,
        "Presses Right": RulesEditor.playerActions
      },
      "Ninja": {
        Jumps: 0,
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

  updateSituations: function() {
    this.initSelect(this.elems.selectSituation, this.validTriggers[this.curActor]);
  },

  updateTargets: function() {
    this.initSelect(this.elems.selectTarget, this.validTriggers[this.curActor][this.curSituation]);
  },

  updateActions: function() {
    this.initSelect(this.elems.selectAction, this.validTriggers[this.curActor][this.curSituation][this.curTarget]);
  },

  initSelect: function(select, options) {
    select.innerHTML = "";

    for (var option in options) {
      var elem = document.createElement("option");
      elem.text = option;

      select.add(elem);
    }

    if (typeof select.onchange == "function")
      select.onchange.apply(select);    
  }
}

RulesEditor = new RulesEditor();