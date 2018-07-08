var RulesEditor = new function() {

  this.elems = {};

  this.playerActions = {
    Player: {
      Jump: 0,
      Attack: 0,
    }
  }

  this.validTriggers = {
    Game: {
      Load: 0,
      Bloat: 0,
    },
    "Human Player": {
      "Presses Up": this.playerActions,
      "Presses Down": this.playerActions,
      "Presses Left": this.playerActions,
      "Presses Right": this.playerActions
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
  }

  this.init = function() {

    this.elems.selectActor     = document.getElementById("actor");
    this.elems.selectSituation = document.getElementById("situation");

    this.initSelect(this.elems.selectActor, this.validTriggers);

    this.elems.selectActor.onchange = function() {RulesEditor.updateActorActions();};
    this.updateActorActions();
  }

  this.updateActorActions = function() {
    var selected = this.elems.selectActor[this.elems.selectActor.selectedIndex].text;

    this.initSelect(this.elems.selectSituation, this.validTriggers[selected]);
  }

  this.initSelect = function(select, options) {
    select.innerHTML = "";

    for (var option in options) {
      var elem = document.createElement("option");
      elem.text = option;

      select.add(elem);
    }
  }
}