EffectTimer = function(duration, effect, name, additionalParams=null) {
    this.effect = effect;
    this.remainingDuration = duration;
    this.name = name;
    this.additionalParams = additionalParams;
}

var effects = {};
effects.munchDeer = function(gameBoard) {
    if (gameBoard.containsAnimal("deer")) {
        gameBoard.removeAnimal("deer");
        gameBoard.addEffectTimer(new EffectTimer(2, effects.munchDeer, "munchDeer"));
        gameBoard.log("Wolf ate deer v nice +2 to big starve");
        return;
    }

    if (gameBoard.containsAnimal("youngDeer")) {
        gameBoard.removeAnimal("youngDeer");
        // halftime
        gameBoard.addEffectTimer(new EffectTimer(1, effects.munchDeer, "munchDeer"));
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
    gameBoard.addAnimal("deer");
    gameBoard.log("bambi is legal now");
}

effects.nukeZone = function(gameBoard, zone) {
    switch (zone) {
        case 'land' :
            gameBoard.log("Your land animals died of radiation!")
            gameBoard.removeSpecies("deer")
            gameBoard.removeSpecies("wolf")
        case 'swamp' :
            gameBoard.log("Your swamp animals died of radiation!")
            gameBoard.removeSpecies("bat")
            gameBoard.removeSpecies("frog")
        case 'water' :
            gameBoard.log("Your water animals died of radiation!")
            gameBoard.removeSpecies('salmon')
            gameBoard.removeSpecies('squid')
    }
}

effects.anaconda = function(gameBoard) {
    let magicNumber = 5;
    // Anaconda animation call
    if (gameBoard.containsAnimal("bat")) {
        gameBoard.log("An anaconda ate your bats :( +5 Stars")
        gameBoard.removeSpecies("bat")
        gameBoard.stars += magicNumber;
    }
    if (gameBoard.containsAnimal("frog")) {
        gameBoard.log("An anaconda ate your frogs :( +5 Stars")
        gameBoard.removeSpecies("frog")
        gameBoard.stars += magicNumber;
    }
}

GameBoard = function () {
    this.stars;
    this.animals;
    this.effectTimers;
    this.logQueue;

    this.init = function() {
        this.stars = 0;
        this.animals = {};
        this.effectTimers = [];
        this.logQueue = [];
    }

    this.containsAnimal = function(animalName) {
        return animalName in this.animals;
    }

    this.log = function(message) {
        console.log(message)
        this.logQueue.unshift(message);
        if (this.logQueue.length > 5) {
            this.logQueue.pop();
        }
    }

    this.addAnimal = function(animalName) {
        if (!(animalName in this.animals)) {
            this.animals[animalName] = 0;
        }

        this.animals[animalName] += 1;
    }

    this.removeAnimal = function(animalName) {
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
        for (let i = 0; i < this.effectTimers.length; i++) {
            if (this.effectTimers[i].name === effectName) {
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
        this.effectTimers = this.effectTimers.filter(effectTimer => effectTimer.name !== effectName);
    }

    this.countdown = function() {   
        let effectTimersToExecute = []
        // Figure out which effect timers to execute
        for (let i = 0; i < this.effectTimers.length; i++) {
            console.log(this.effectTimers[i].remainingDuration)
            this.effectTimers[i].remainingDuration -= 1;
            if (this.effectTimers[i].remainingDuration === 0) {
                console.log("Im supposed to be making an effect right now")
                effectTimersToExecute.push(this.effectTimers[i])
            }
        }
        // Execute em
        for (let i = 0; i < effectTimersToExecute.length; i++) {
            if (effectTimersToExecute[i].additionalParams == null) {
                effectTimersToExecute[i].effect(this);
            } else {
                effectTimersToExecute[i].effect(this, this.effectTimersToExecute[i].additionalParams)
            }
        }

        this.effectTimers = this.effectTimers.filter(timer => timer.remainingDuration !== 0);
    }
}
