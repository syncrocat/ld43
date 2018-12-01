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
            let card = new Card(i)
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
    this.init = function() {
        this.cards = [-1, -1, -1]
    }

    this.drawCards = function(deck) {
        for (i = 0; i < 3; i++) {
            let card = deck.drawCard();
            this.cards[i] = card;
        }
    }

    this.discardCard = function(n) {
        this.cards[n].discardAction();
        this.cards[n] = -1;
    }

    this.saveCard = function(n, saveDeck) {
        //this.cards[n].saveAction();
        saveDeck.addCard(this.cards[n]);
        this.cards[n] = -1;
    }

    this.useCard = function(n) {
        this.cards[n].useAction();
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
            case 1:
                this.hand.discardCard(n)
            case 2:
                let availCards = this.hand.getAvailableCards()
                for (i = 0; i < availCards.size(); i++) {
                    this.hand.saveCard(availCards[i])
                }
            case 3:
                this.hand.drawCards()           
        }
    }
}



