graphics = {}
graphics.CardObj = function() {
    this.animateFrame;
    this.sprite;
    this.position;
    this.interactable;
    this.card;

    this.init = function(card, pos) {
        this.animateFrame = 0;
        this.interactable = false;
        this.position = pos;
        console.log(pos)
        this.sprite = this.getSprite(card)
        this.sprite.width = 175
        this.sprite.height = 280
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.card = card;
        this.cardState = 'draw'
        app.stage.addChild(this.sprite);
    }

    this.getSprite = function(card) {
        //code goes here //
        return new PIXI.Sprite(PIXI.loader.resources['pics/tempcard.png'].texture);
    }

    this.isMousedOver = function(mouseX, mouseY) {
        //console.log(mouseX, mouseY)
        return (
            this.sprite.x <= mouseX && this.sprite.x + this.sprite.width >= mouseX &&
            this.sprite.y <= mouseY && this.sprite.y + this.sprite.height >= mouseY 
        )
    }

    this.onHover = function() {
        console.log("Hey I'm " + this.position + " and you're watching the hover channel")
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
        console.log(this.sprite.x, this.sprite.y)
    }

    this.animate = function() {
        switch (this.cardState)  {
            case 'draw' :
                this.animateDraw();
                break;
            case 'hand' :
                let meme = 1;
                break;
        }
    }

    this.animateDiscard = function() {

    }

    this.animateSave = function() {

    }

    this.animateUse = function() {

    }
}

graphics.SubmitObj = function() {
    this.sprite;

    this.init = function() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/tempsubmit.png"].texture)
        this.sprite.x = 500
        this.sprite.y = 350;
        this.sprite.width = 165;
        this.sprite.height = 60;
        app.stage.addChild(this.sprite)
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
