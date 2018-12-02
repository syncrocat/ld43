Card = function() {
    
    this.init = function(type=-1) {
        this.consumed = false;
        this.cardType = type
    }

    this.useAction = function() {
        //do something        
    }

    this.discardAction = function() {
        //do nothing
    }
}

Deck = function() {

    this.init = function(n) {
        this.cards = [];
        for (i = 0; i < n; i++) {
            let card = new Card()
            card.init(i)
            this.cards.push(card);
        }
    }

    this.shuffle = function() {
        // Shuffle
    }

    this.drawCard = function () {
        return this.cards.pop()
    }

    this.addCard = function (card) {
        this.cards.push(card)
    }

    // Adds a card to a random position in the deck
    this.insertCard = function(card) {
        let randint = Math.floor(Math.random() * this.cards.size());
        this.cards.splice(randint,0,card)
    }

    this.getDeckSize = function(n=0) {
        return this.cards.size() 
    }
}

Hand = function() {
    this.cards;
    this.deck;
    this.saveDeck;
    this.drawTimer;
    this.isWaitingToDraw;
    this.submitButton;

    this.init = function(deck, saveDeck, submitButton) {
        this.cards = [-1, -1, -1]
        this.deck = deck;
        this.saveDeck = saveDeck;
        this.submitButton = submitButton;
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
        this.isWaitingToDraw;
    }

    this.swapCards = function(n, m) {
        let temp = this.cards[n];
        this.cards[n] = this.cards[m];
        this.cards[m] = temp;
    }   

    this.drawCards = function() {
        for (let i = 0; i < 3; i++) {
            let card = this.deck.drawCard();
            this.cards[i] = new graphics.CardObj()
            this.cards[i].init(card, i)
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

        for (i = 0;i < 3; i++) {
        }
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
