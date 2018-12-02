EffectTimer = function(effect, duration, name) {
    this.effect = effect;
    this.remainingDuration = duration;
    this.name = name;
}

var effects = {};
effects.munchDeer = function(gameBoard) {
    if (gameBoard.containsAnimal("deer")) {
        gameBoard.removeAnimal("deer");
        gameBoard.addEffectTimer(new EffectTimer(2, effects.munchDeer));
        gameBoard.log("Wolf ate deer v nice +2 to big starve");
        return;
    }

    if (gameBoard.containsAnimal("youngDeer")) {
        gameBoard.removeAnimal("youngDeer");
        gameBoard.splice(gameBoard.indexOfEffect("matureDeer"), 1);
        // halftime
        gameBoard.addEffectTimer(new EffectTimer(1, effects.munchDeer));
        gameBoard.log("Wolf had baby deer yikes +1 big starve instead of 2");
        return;
    }

    gameBoard.log("rip inu ;(");
    gameBoard.removeSpecies("wolf");
}

effects.matureDeer = function(gameBoard) {
    if (!gameBoard.containsAnimal("youngDeer")) {
        console.log("FUCK FUCK FUCK");
    }

    gameBoard.removeSpecies("youngDeer");
    gameBoard.addSpecies("deer");
    gameBoard.log("bambi is legal now");
}

GameBoard = function () {
    this.stars;
    this.animals;
    this.effects;
    this.logQueue;

    this.init = function() {
        this.stars = 0;
        this.animals = {};
        this.effects = [];
        this.logQueue = [];
    }

    this.containsAnimal = function(animalName) {
        return animalName in this.animals;
    }

    this.log = function(message) {
        this.logQueue.unshift(message);
        if (this.logQueue.size() > 5) {
            this.logQueue.pop();
        }
    }

    this.addAnimal = function(animal) {
        if (!(animalName in this.animals)) {
            this.animals[animalName] = 0;
        }

        this.animals[animalName] += 1;
    }

    this.removeAnimal = function(animal) {
        if (!(animalName in this.animals)) {
            return false;
        }

        if (this.animals[animalName] > 0) {
            this.animals[animalName] -= 1;
            return true;
        }

        return false;
    }

    this.indexOfEffect = function(effectName) {
        for (let i = 0; i < this.effects.size(); i++) {
            if (this.effects[i].name === effectName) {
                return i;
            }
        }

        return -1;
    }

    this.addEffectTimer = function(effectTimer) {
        this.effectTimers.push(effectTimer);
    }

    this.removeSpecies = function(animalName) {
        this.animals[animalName] = 0;
    }

    this.removeEffect = function(effectName) {
        this.effects = this.effects.filter(effect => effect.name !== effectName);
    }

    this.countdown = function() {
        for (let i = 0; i < this.effectTimers.size(); i++) {
            this.effectTimers[i].remainingDuration -= 1;
            if (this.effectTimers[i].remainingDuration === 0) {
                this.effectTimers[i].effect(this);
            }
        }

        this.effectTimers = this.effectTimers.filter(timer => timer.remainingDuration !== 0);
    }
}
