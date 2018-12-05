EffectTimer = function(duration, effect, name, additionalParams=null) {
    this.effect = effect;
    this.remainingDuration = duration;
    this.name = name;
    this.additionalParams = additionalParams;
    //console.log(additionalParams)
}

var effects = {};
effects.munchDeer = function(gameBoard) {
    if (gameBoard.containsAnimal('wolf')) {
        //console.log("MUNCH EVENT")
        if (gameBoard.containsAnimal("deer")) {
            console.log("One adult dear eaten. Expect adult removed.")

            gameBoard.removeAnimal("deer");
            gameBoard.addEffectTimer(new EffectTimer(2, effects.munchDeer, "munchDeer"));
            gameBoard.log("Wolf ate deer v nice +2 to big starve");
            
            return;
        }

        if (gameBoard.containsAnimal("youngDeer")) {
            console.log("One baby dear eaten. Expect adult removed.")
            gameBoard.removeAnimal("youngDeer");
            // halftime
            gameBoard.addEffectTimer(new EffectTimer(1, effects.munchDeer, "munchDeer"));
            gameBoard.log("Wolf had baby deer yikes +1 big starve instead of 2");
            return;
        }

        gameBoard.log("rip inu ;(");
        gameBoard.removeSpecies("wolf");
    }
}

effects.matureDeer = function(gameBoard) {
    console.log("Deer is now maturing. Expected = 1 baby remove, 1 adult insert")
    if (!gameBoard.containsAnimal("youngDeer")) {
        //console.log("FUCK FUCK FUCK");
    }

    let babyDeerSlot = gameBoard.removeAnimal("youngDeer");
    gameBoard.addAnimal("deer", babyDeerSlot);
    gameBoard.log("bambi is legal now");
}

effects.nukeZone = function(gameBoard, zone) {
    
    switch (zone) {
        case 0 :
            gameBoard.log("Your land animals died of radiation!")
            gameBoard.removeSpecies("deer")
            gameBoard.removeSpecies("wolf")
            break;
        case 1 :
            gameBoard.log("Your swamp animals died of radiation!")
            gameBoard.removeSpecies("bat")
            gameBoard.removeSpecies("frog")
            break;
        case 2 :
            gameBoard.log("Your water animals died of radiation!")
            gameBoard.removeSpecies('salmon')
            gameBoard.removeSpecies('squid')
            break;
    }
}

effects.anaconda = function(gameBoard) {
    let magicNumber = 5;
    // Anaconda animation call
    if (gameBoard.containsAnimal("bat")) {
        gameBoard.log("An anaconda ate your bats :( +5 Stars")
        gameBoard.removeSpecies("bat")
        gameBoard.stars += magicNumber;
        gameBoard.starsTextObj.text.text = gameBoard.stars;
    }
    if (gameBoard.containsAnimal("frog")) {
        gameBoard.log("An anaconda ate your frogs :( +5 Stars")
        gameBoard.removeSpecies("frog")
        gameBoard.stars += magicNumber;
        gameBoard.starsTextObj.text.text = gameBoard.stars;
    }
}

effects.flood = function(gameBoard) {
    console.log("Hi");
    if (gameBoard.terrainState == 'treeswampwater') {
        gameBoard.terrainState = 'treewaterwater'
        gameBoard.removeAnimal('bat', -2)
        //gameBoard.removeAnimal('frog', -2)
    } else if (gameBoard.terrainState == 'treeswampoil') {
        gameBoard.terrainState = 'treeoiloil'
        gameBoard.removeAnimal('bat', -2)
        //gameBoard.removeAnimal('frog', -2)
    } else if (gameBoard.terrainState == 'treetreewater') {
        gameBoard.terrainState = 'treeswampwater'
    } else if (gameBoard.terrainState == 'treetreeoil') {
        gameBoard.terrainState = 'treeswampoil'
    }
    gameBoard.updateTerrain();
}

effects.drought = function(gameBoard) {
    gameBoard.log("A drought dried up the swamp!")
    if (gameBoard.terrainState == 'treeswampwater') {
        gameBoard.terrainState = 'treetreewater'
        //gameBoard.removeAnimal('bat', -2)
        gameBoard.removeAnimal('frog', -2)
    } else if (gameBoard.terrainState == 'treeswampoil') {
        gameBoard.terrainState = 'treetreeoil'
        //gameBoard.removeAnimal('bat', -2)
        gameBoard.removeAnimal('frog', -2)
    } else if (gameBoard.terrainState == 'treewaterwater') {
        gameBoard.terrainState = 'treeswampwater'
    } else if (gameBoard.terrainState == 'treeoiloil') {
        gameBoard.terrainState = 'treeswampoil'
    }
    gameBoard.updateTerrain()
}

effects.salmonDouble = function(gameBoard) {
    if (gameBoard.containsAnimal('salmon')) {
        gameBoard.log ("Your salmon doubled in value!")
        gameBoard.animalValues['salmon'] *= 2
        gameBoard.addEffectTimer(new EffectTimer(3, effects.salmonDouble, "salmonDouble"))
        gameBoard.doubleSalmon();
    }   
}

effects.oil = function(gameBoard) {
    gameBoard.log ("An oil spill occured!")
    gameBoard.terrainState = gameBoard.terrainState.replace('water', 'oil')
    gameBoard.removeSpecies('salmon');
    gameBoard.removeSpecies('squid')

    gameBoard.updateTerrain();
}

effects.bugDeath = function(gameBoard, n) {
    if (n == 0) {
        gameBoard.log('The bugs have left the swamp.')
        gameBoard.animalValues['frog'] /= 2
        gameBoard.animalValues['bat'] /= 2
        app.stage.removeChild(gameBoard.bugman.sprite)
        gameBoard.bugman = -1;
    } else {
        gameBoard.addEffectTimer(new EffectTimer(1, effects.bugDeath, "bugDeath", n-1))
        

    }
}

effects.harvest = function(gameBoard) {
    let magicNumber = 3
    let starCount = 0;
    // Anaconda animation call
    for (animal in gameBoard.animals) {
        starCount += gameBoard.animals[animal] * 3;
        gameBoard.removeSpecies(animal)
        
    }
    gameBoard.log("All animals were harvested for " + starCount + " stars.")
    gameBoard.stars += starCount
    gameBoard.starsTextObj.text.text = gameBoard.stars;
}

effects.fungus = function(gameBoard) {
    let magicNumber = 3
    let starCount = 2 * gameBoard.deadAnimalNum

    gameBoard.log("Dead animals rewarded " + starCount + " stars.")
    gameBoard.stars += starCount
    gameBoard.starsTextObj.text.text = gameBoard.stars;
}

GameBoard = function () {
    this.stars;
    this.animals;
    this.animalObjects;
    this.effectTimers;
    this.logQueue;
    this.terrainState;
    this.animalValues;
    this.logTextObj;

    this.starsTextObj;
    this.world;
    this.worldTextures;
    this.deadAnimalNum = 0;
    this.bugman = -1;

    this.doubleSalmon = function() {
        let mySalmon = this.animalObjects.filter(a => a.animalName == 'salmon')
        mySalmon.doubleMySalmon();
    }

    this.init = function(world) {
        console.log("FRESH");
        this.world = world;
        this.worldTextures = {
            "treeswampwater": PIXI.loader.resources["pics/treeswampwater.png"].texture,
            "treetreewater": PIXI.loader.resources["pics/treetreewater.png"].texture,
            "treewaterwater": PIXI.loader.resources["pics/treewaterwater.png"].texture,
            "treeswampoil": PIXI.loader.resources["pics/treeswampoil.png"].texture,
            "treetreeoil": PIXI.loader.resources["pics/treetreeoil.png"].texture,
            "treeoiloil": PIXI.loader.resources["pics/treeoiloil.png"].texture,
        };

        this.stars = 0;
        this.animals = {};
        this.effectTimers = [];
        this.logQueue = [];
        this.terrainState = "treeswampwater";
        this.logTextObj = new graphics.TextObj();
        this.logTextObj.init("", {fontSize: 12, align:"left"}, 25, 25);
        this.animalObjects = [];
        this.starsTextObj = new graphics.TextObj();
        this.starsTextObj.init("0", {}, 400, 50);

        this.animalValues = {
            'youngDeer' : 0,
            'deer' : 1,
            'wolf' : 4,
            'salmon' : 1,
            'squid' : 2,
            'frog' : 2,
            'bat' : 2
        }
    }

    this.updateTerrain = function() {
        console.log(this.terrainState);
        console.log(this.worldTextures);
        console.log(this.worldTextures[this.terrainState]);
        this.world.sprite.texture = this.worldTextures[this.terrainState];
    }

    this.pluralizeAnimal = function(animal) {
        switch (animal) {
            case 'deer' :
                return 'deer'
            case 'wolf' :
                return 'wolves'
            case 'bat':
                return 'bats'
            case 'frog' :
                return 'frogs'
            case 'salmon':
                return 'salmon'
            case 'squid' :
                return 'squid'
        }
    }

    this.containsAnimal = function(animalName) {
        return animalName in this.animals && this.animals[animalName] != 0;
    }

    this.log = function(message) {
        //console.log(message)
        //console.log(this.logTextObj.text.text);
        this.logQueue.unshift(message);
        if (this.logQueue.length > 5) {
            this.logQueue.pop();
        }

        this.logTextObj.text.text = "";
        for (i = this.logQueue.length - 1; i >= 0; i--) {
            this.logTextObj.text.text += this.logQueue[i] + "\n";
        }
    }

    this.addAnimal = function(animalName, babyDeerSlot = -1) {
        if (!(animalName in this.animals)) {
            this.animals[animalName] = 0;
        }

        this.animals[animalName] += 1;
        let newAnimal = new graphics.AnimalObj();
        newAnimal.init(animalName,this, babyDeerSlot)
        console.log("pushing new animal", newAnimal)
        this.animalObjects.push(newAnimal);
        console.log(this.animalObjects);

    }

    // You can attach a message to your remove animal function
    // -1 no message, default
    // -2 generic message
    this.removeAnimal = function(animalName, message = -1) {
        this.deadAnimalNum += 1
        if (message == -2) {
            message = 'Your ' + this.pluralizeAnimal(animalName) + ' have died!'
        }
        if (!(animalName in this.animals)) {
            console.log("THERE WAS NO ANIMAL FOUND", animalName)
            return -1;
        }

        if (this.animals[animalName] > 0) {
            this.animals[animalName] -= 1;
            if (message != -1) {
                this.log(message)
            }
            
            let index = -1;

            for (let i = 0; i < this.animalObjects.length; i++) {
                if (this.animalObjects[i].trueAnimalName == animalName) {
                    index = i;
                    break;
                }
            }
            let toKill = this.animalObjects.filter(obj => obj.trueAnimalName === animalName);
            //console.log(toKill)
            if (toKill.length > 0)
            toKill[0].killme();
            this.animalObjects.splice(index, 1)

            return -1;
        }

        console.log("THERE WAS NO ANIMAL FOUND", animalName)

        return -1;
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
        let numOf = this.animals[animalName]
        for (let i = 0; i < numOf; i ++) {
            this.removeAnimal(animalName)
        }

        this.animals[animalName] = 0;
        /*let indexes = [];
        //console.log(this.animalObjects)

        let toKill = this.animalObjects.filter(obj => obj.trueAnimalName === animalName);
        for (let i= 0; i < toKill.length; i++) {
            toKill[i].killme();
        }
        this.animalObjects = this.animalObjects.splice(index, 1)*/
    }

    this.removeEffect = function(effectName) {
        this.effectTimers = this.effectTimers.filter(effectTimer => effectTimer.name !== effectName);
    }

    this.runObjects = function() {
        for (let i = 0; i < this.animalObjects.length; i++) {
            this.animalObjects[i].runObject();
        }
        if (this.bugman != -1) {
            this.bugman.runObject();
        }
    }

    this.countdown = function() {   
        let effectTimersToExecute = []
        // Figure out which effect timers to execute
        for (let i = 0; i < this.effectTimers.length; i++) {
            //console.log(this.effectTimers[i].remainingDuration)
            this.effectTimers[i].remainingDuration -= 1;
            if (this.effectTimers[i].remainingDuration === 0) {
                //console.log("Im supposed to be making an effect right now")
                effectTimersToExecute.push(this.effectTimers[i])
            }
        }
        // Execute em
        for (let i = 0; i < effectTimersToExecute.length; i++) {
            if (effectTimersToExecute[i].additionalParams == null) {
                effectTimersToExecute[i].effect(this);
            } else {
                console.log(effectTimersToExecute[i].additionalParams)
                effectTimersToExecute[i].effect(this, effectTimersToExecute[i].additionalParams)
            }
        }

        this.effectTimers = this.effectTimers.filter(timer => timer.remainingDuration !== 0);


        console.log(this.animals)
        console.log(this.animalObjects)
    }

    this.getStarsForAnimals = function() {
        for (let animal in this.animals) {
            if (this.animals[animal] > 0) {
                let numStars = this.animalValues[animal] * this.animals[animal]
                this.stars += numStars;
                this.starsTextObj.text.text = this.stars;
                this.log("You gained " + numStars + " stars from your " + this.pluralizeAnimal(animal) + "!");
            }
        }
    }
}
