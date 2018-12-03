Card = function() {
    this.gameBoard;

    this.init = function(gameBoard, type=-1) {
        this.cardType = type
        this.gameBoard = gameBoard;
    }

    this.useAction = function() {
        //console.log(this.gameBoard)
        switch (this.cardType) {
            case "wolf":
                this.gameBoard.removeSpecies("wolf")
                this.gameBoard.effectTimers = this.gameBoard.effectTimers.filter(f => f.name != 'munchDeer')

                this.gameBoard.addAnimal("wolf")
                this.gameBoard.addEffectTimer(new EffectTimer(3, effects.munchDeer, "munchDeer"));
                break;
            case "deer":
                this.gameBoard.addAnimal("deer")
                //this.gameBoard.addEffectTimer(new EffectTimer(3, effects.matureDeer, "matureDeer"));
                break;
            case "salmon":
                if (this.gameBoard.terrainState.includes('oil')) {
                    this.gameBoard.log("Salmon died immediately due to oil!")
                    this.gameBoard.deadAnimalNum += 1
                } else {
                    this.gameBoard.addAnimal("salmon")
                }
                break;
            case "squid":
                if (this.gameBoard.terrainState.includes('oil')) {
                    this.gameBoard.log("Squid died immediately due to oil!")
                    this.gameBoard.deadAnimalNum += 1
                } else {
                    this.gameBoard.addAnimal("squid")
                }
                break;
            case "frog":
                if (this.gameBoard.terrainState.includes('oil') && !this.gameBoard.terrainState.includes('swamp')) {
                    this.gameBoard.log("Frog died immediately due to oil bad!")
                    this.gameBoard.deadAnimalNum += 1
                } else if (this.gameBoard.terrainState == 'treetreewater') {
                    this.gameBoard.log("Frog died immediately due to insufficient terrain!")
                    this.gameBoard.deadAnimalNum += 1
                } else {
                    this.gameBoard.addAnimal("frog")
                }
                break;
            case "bat":
                if (this.gameBoard.terrainState.includes('waterwater')) {
                    this.gameBoard.log("Bat died immediately due to insufficient terrain!")
                    this.gameBoard.deadAnimalNum += 1
                } else {
                    this.gameBoard.addAnimal("bat")
                }
                break;
            case "bug":
                this.gameBoard.bugman = new graphics.BugObj();
                this.gameBoard.log("Bugs nourish the creatures of the swamp!")
                this.gameBoard.animalValues['frog'] += 1
                this.gameBoard.animalValues['bat'] += 1
                this.gameBoard.addEffectTimer(new EffectTimer(1, effects.bugDeath, "bugDeath", 3))
                break;
            case "flood":
                effects.flood(this.gameBoard);
                break;
            case "drought":
                effects.drought(this.gameBoard);
                break;
            case "oilspill":
                effects.oil(this.gameBoard);
                break;
            case "fungus":
                effects.fungus(this.gameBoard)
                break;
            case "nuke":
                let biome = Math.floor (Math.random() * 3);
                // Nuke animation goes here
                effects.nukeZone(this.gameBoard, biome)
                this.gameBoard.addEffectTimer(new EffectTimer(1, effects.nukeZone, "nukeZone", biome));
                break;
            case "anaconda":
                effects.anaconda(this.gameBoard)
                break;
            case "harvest":
                effects.harvest(this.gameBoard)
                break;
            case "seven":
                this.gameBoard.log("You played the seven of diamonds!")
                break;
            default:
                ///console.log("Wuh oh (you should not be deer)");
                break;
        }
    }

    this.discardAction = function() {
        switch (this.cardType) {
            default:
                break;
        }
    }
}


Deck = function() {
    this.textObj;
    this.cards;
    this.text;

    this.init = function(gameBoard, n, text, x, y) {
        this.text = text;
        this.cards = [];
        if (n > 0) {
            for (let i = 0; i < 18; i++) {
            this.cards.push(new Card());
        }
        this.cards[0].init(gameBoard, "deer");
        this.cards[1].init(gameBoard, "deer");
        this.cards[2].init(gameBoard, "deer");
        this.cards[3].init(gameBoard, "wolf");
        this.cards[4].init(gameBoard, "salmon");
        this.cards[5].init(gameBoard, "squid");
        this.cards[6].init(gameBoard, "frog");
        this.cards[7].init(gameBoard, "bug");
        this.cards[8].init(gameBoard, "bat");
        this.cards[9].init(gameBoard, "flood");
        this.cards[10].init(gameBoard, "drought");
        this.cards[11].init(gameBoard, "oilspill");
        this.cards[12].init(gameBoard, "fungus");
        this.cards[13].init(gameBoard, "nuke");
        this.cards[14].init(gameBoard, "anaconda");
        this.cards[15].init(gameBoard, "harvest");
        this.cards[16].init(gameBoard, "seven");
        this.cards[17].init(gameBoard, "harvest");
        }
        


        this.shuffle();

        this.textObj = new graphics.TextObj();
        this.textObj.init(text, {align: "left"}, x, y);//475, 12);
        this.updateCardText();
    }

    this.shuffle = function() {
        // Shuffle
        let j, x, i;
        for (i = this.cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = x;
        }
    }

    this.drawCard = function () {
        let card = this.cards.pop()
        this.updateCardText();
        return card;
    }

    this.addCard = function (card) {
        this.cards.push(card)
        this.updateCardText();
    }

    // Adds a card to a random position in the deck
    this.insertCard = function(card) {
        let randint = Math.floor(Math.random() * this.cards.size());
        this.cards.splice(randint,0,card)
        this.updateCardText();
    }

    this.getDeckSize = function(n=0) {
        return this.cards.length;
    }

    this.updateCardText = function() {
        this.textObj.text.text = this.text + this.getDeckSize();
    }
}

Hand = function() {
    this.cards;
    this.deck;
    this.saveDeck;
    this.drawTimer;
    this.isWaitingToDraw;
    this.submitButton;
    this.selectedCardPos;
    this.gameBoard;
    this.bonusRound;

    this.init = function(gameBoard, deck, saveDeck, submitButton) {
        this.gameBoard = gameBoard;
        this.cards = [-1, -1, -1]
        this.deck = deck;
        this.saveDeck = saveDeck;
        this.submitButton = submitButton;
        this.selectedCardPos = -1;
        this.bonusRound = false;
    }

    this.submit = function() {
        this.cards[0].card.useAction();
        if (!this.bonusRound) {
            this.saveDeck.addCard(this.cards[1].card);
        }

        this.cards[2].card.discardAction();

        // Save card
        this.cards[0].cardState = 'use'
        this.cards[1].cardState = 'save'
        this.cards[2].cardState = 'discard'

        this.drawTimer = 10;
        this.selectedCardPos = -1;
        this.isWaitingToDraw; // ?????
        this.gameBoard.countdown()
        this.gameBoard.getStarsForAnimals()
    }

    this.swapCards = function(n, m) {
        let temp = this.cards[n];
        this.cards[n] = this.cards[m];
        this.cards[m] = temp;

        this.cards[n].position = n;
        this.cards[m].position = m;

        this.cards[n].refreshPosition();
        this.cards[m].refreshPosition();

        this.cards[n].sprite.texture = this.cards[n].hoverTexture;
        this.cards[m].sprite.texture = this.cards[m].regTexture;
    }

    this.drawCards = function() {
        for (let i = 0; i < 3; i++) {
            //console.log("Made it here");
            //console.log(this.deck);
            let card = this.deck.drawCard();
            this.cards[i] = new graphics.CardObj()
            this.cards[i].init(card, i, this)
        }

    }

    this.getAvailableCards = function() {
        let availCards = []
        for (i = 0; i < 3; i++) {
            if (cards[i] != -1) {
                availCards.push(i)
            }
        }
        return availCards;
    }

    this.runCards = function(mouseX,mouseY) {
        hintmeIRL = false;
        this.cards.filter(card => card != -1).forEach(card => card.runObject(mouseX,mouseY));

        if (this.drawTimer > 0) {
            this.drawTimer -= 1;
        } else if (this.drawTimer === 0) {
            this.clearCards();
            console.log("Here we are:", this.deck.getDeckSize(), this.bonusRound);
            
            if (this.deck.getDeckSize() === 0) {
                if (!this.bonusRound) {
                    let temp = this.deck;
                    this.deck = this.saveDeck;
                    this.deck.shuffle(); // TODO make this do something
                    this.bonusRound = true;
                    this.saveDeck = temp;
                    this.saveDeck.updateCardText();
                    this.deck.updateCardText();
                } else {
                    console.log("Game is over!!!!");
                    let endGameScreen = new PIXI.Sprite(PIXI.loader.resources["pics/background.png"].texture);
                    endGameScreen.x = 0;
                    endGameScreen.y = 0;
                    console.log(endGameScreen);
                    app.stage.addChild(endGameScreen);

                    let scoreText = new graphics.TextObj();
                    scoreText.init("Score: " + this.gameBoard.stars, {fontSize: 30}, 300, 300);
                    //app.renderer.render(app.stage);
                    hintmeIRL = true;
                    return 'end me sempai'
                }
            }

            this.drawCards();
            this.submitButton.enabled = true;
            this.drawTimer = -1

            
        }
    }

    this.clearCards = function() {
        this.cards[0] = -1;
        this.cards[1] = -1;
        this.cards[2] = -1;
    }
}
