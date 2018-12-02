graphics = {}
graphics.CardObj = function() {
    this.animateFrame;
    this.sprite;
    this.position;
    this.interactable;
    this.card;
    this.destroyCounter;

    this.init = function(card, pos) {
        this.animateFrame = 0;
        this.interactable = false;
        this.position = pos;
        this.sprite = this.getSprite(card)
        this.sprite.width = 175
        this.sprite.height = 280
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.card = card;
        this.cardState = 'draw'
        this.destroyCounter = 0;
        app.stage.addChild(this.sprite);
    }

    this.getSprite = function(card) {
        //code goes here //
        return new PIXI.Sprite(PIXI.loader.resources['pics/tempcard.png'].texture);
    }

    this.isMousedOver = function(mouseX, mouseY) {
        return (
            this.sprite.x <= mouseX && this.sprite.x + this.sprite.width >= mouseX &&
            this.sprite.y <= mouseY && this.sprite.y + this.sprite.height >= mouseY 
        )
    }

    this.onHover = function() {
    }

    this.runObject = function(mouseX,mouseY) {
        if (this.isMousedOver(mouseX,mouseY)) {
            this.onHover();
        }
        this.animate()
    }

    this.animateDraw = function() {
        this.sprite.x = 51 + (this.position * (31 + this.sprite.width))

        this.sprite.y = 720 - 20 - this.sprite.height;
        this.interactable = true;
        this.cardState = 'hand'
    }

    this.animate = function() {
        switch (this.cardState)  {
            case 'draw' :
                this.animateDraw();
                break;
            case 'hand' :
                let meme = 1;
                break;
            case 'use' :
                this.animateUse();
                break;
            case 'discard' :
                this.animateDiscard();
                break;
            case 'save' :
                this.animateSave();
                break;
        }
    }

    this.animateDiscard = function() {
        this.animateDestroy();
    }

    this.animateSave = function() {
        this.animateDestroy();
    }

    this.animateUse = function() {
        this.animateDestroy();
    }

    this.animateDestroy = function() {
        this.destroyCounter++;
        if (this.destroyCounter > 50) {
            app.stage.removeChild(this.sprite);
        }
    }

}

graphics.SubmitObj = function() {
    this.sprite;
    this.hand;
    this.enabled;

    this.init = function(hand) {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/tempsubmit.png"].texture)
        this.sprite.x = 500
        this.sprite.y = 350;
        this.sprite.width = 165;
        this.sprite.height = 60;
        this.hand = hand;
        this.enabled = true;
        app.stage.addChild(this.sprite)
    }

    this.isMousedOver = function(mouseX, mouseY) {

        return (
            this.sprite.x <= mouseX && this.sprite.x + this.sprite.width >= mouseX &&
            this.sprite.y <= mouseY && this.sprite.y + this.sprite.height >= mouseY 
        )
    }

    this.onHover = function() {
    }

    this.runObject = function(mouseX,mouseY) {
        if (this.enabled && this.isMousedOver(mouseX,mouseY)) {
            this.onHover();
            if (app.mouse_pressed) {
                this.enabled = false;
                this.hand.submit();
            }
        }
    }

}

graphics.Deck = function() {
    this.sprite;
    this.numCards;
    
    this.init = function(numCards) {
        this.numCards = numCards;
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/tempdeckcard.png"].texture);
        this.sprite.x = x;
        this.sprite.y = y;
        app.stage.addChild(this.sprite);
    }

    this.setNumCards = function(n) {
        this.numCards = n;
    }
}
