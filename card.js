Card = function() {
    this.gameBoard;

    this.init = function(gameBoard, type=-1) {
        this.cardType = type
        this.gameBoard = gameBoard;
    }

    this.useAction = function() {
        console.log(this.gameBoard)
        switch (this.cardType) {
            case "Wolf":
                this.gameBoard.addAnimal("wolf")
                this.gameBoard.addEffectTimer(new EffectTimer(3, effects.munchDeer, "munchDeer"));
                break;
            case "Deer":
                this.gameBoard.addAnimal("youngDeer")
                this.gameBoard.addEffectTimer(new EffectTimer(3, effects.matureDeer, "matureDeer"));
                break;
            case "Salmon":
                this.gameBoard.addAnimal("salmon")
                break;
            case "Squid":
                this.gameBoard.addAnimal("squid")
                break;
            case "Frog":
                this.gameBoard.addAnimal("frog")
                break;
            case "Bat":
                this.gameBoard.addAnimal("bat")
                break;
            case "Mosquito":
                this.gameBoard.log("Mosquitoes nourish the creatures of the swamp!")
                this.gameBoard.animalValues['frog'] += 1
                this.gameBoard.animalValues['bat'] += 1
                this.gameBoard.addEffectTimer(new EffectTimer(1, effects.mosquito, "mosquitoDeath", 3))
                break;
            case "Tsunami":
                effects.flood(this.gameBoard);
                break;
            case "Drought":
                effects.drought(this.gameBoard);
                break;
            case "Oil":
                effects.oil(this.gameBoard);
                break;
            case "Toxic waste":
                break;
            case "Nuke":
                let biome = Math.floor (Math.random * 3);
                // Nuke animation goes here
                effects.nukeZone(this.gameBoard, biome)
                this.gameBoard.addEffectTimer(new EffectTimer(1, effects.nukeZone, "nukeZone", biome));
                break;
            case "Anaconda":
                effects.anaconda(this.gameBoard)
                break;
            default:
                console.log("Wuh oh (you should not be deer)");
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
        for (i = 0; i < n; i++) {
            let card = new Card()
            card.init(gameBoard, i % 2 == 0 ? "Wolf" : "Deer");
            this.cards.push(card);
        }

        this.textObj = new graphics.TextObj();
        this.textObj.init(text, {align: "left"}, x, y);//475, 12);
        this.updateCardText();
    }

    this.shuffle = function() {
        // Shuffle
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

    this.init = function(gameBoard, deck, saveDeck, submitButton) {
        this.gameBoard = gameBoard;
        this.cards = [-1, -1, -1]
        this.deck = deck;
        this.saveDeck = saveDeck;
        this.submitButton = submitButton;
        this.selectedCardPos = -1;
    }

    this.submit = function() {
        this.cards[0].card.useAction();
        this.saveDeck.addCard(this.cards[1].card);
        this.cards[2].card.discardAction();

        // Save card
        this.cards[0].cardState = 'use'
        this.cards[1].cardState = 'save'
        this.cards[2].cardState = 'discard'

        this.drawTimer = 50;
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
            console.log("Made it here");
            console.log(this.deck);
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
        this.cards.filter(card => card != -1).forEach(card => card.runObject(mouseX,mouseY));

        if (this.drawTimer > 0) {
            this.drawTimer -= 1;
        } else if (this.drawTimer === 0) {
            this.clearCards();
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
