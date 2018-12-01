Card = function() {
    
    this.init = function(type=-1) {
        this.consumed = false;
        this.cardType = type
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

    this.init = function(deck, saveDeck) {
        this.cards = [-1, -1, -1]
        this.deck = deck;
        this.saveDeck = saveDeck;
    }

    this.drawCards = function() {
        for (let i = 0; i < 3; i++) {
            let card = this.deck.drawCard();
            this.cards[i] = new graphics.CardObj()
            this.cards[i].init(card, i)
            console.log(this.cards[0])
        }

    }

    this.cardClicked = function(card, n) {
        switch (gameState) {
            case 'use':
                card.useAction();
                break;
            case 'discard' :
                card.discardAction();
                break;
        }
        this.cards[n] = -1;
    }

    this.saveCard = function(n) {
        //this.cards[n].saveAction();
        this.saveDeck.addCard(this.cards[n]);
        this.cards[n] = -1;
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
            //console.log(this.cards[i].position)
        }
        this.cards.filter(card => card != -1).forEach(card => card.runObject());
    }

}

GameBoard = function () {

    this.init = function() {
        this.swampState = 'NORMAL'
        this.deck = new Deck(25);
        this.saveDeck = new Deck(0);
        this.hand = new Hand();
        this.hand.drawCards(this.deck)
        this.roundState = 0;
    }

    this.progressRound = function(n) {
        switch (this.roundState) {
            case 0:
                this.hand.useCard(n)
                break;
            case 1:
                this.hand.discardCard(n)
                break;
            case 2:
                let availCards = this.hand.getAvailableCards()
                for (i = 0; i < availCards.size(); i++) {
                    this.hand.saveCard(availCards[i])
                }
                break;
            case 3:
                this.hand.drawCards() 
                break;          
        }
    }
}



