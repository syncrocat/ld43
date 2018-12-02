graphics = {}
graphics.CardObj = function() {
    this.animateFrame;
    this.sprite;
    this.position;
    this.interactable;
    this.card;
    this.destroyCounter;
    this.regTexture;
    this.hoverTexture;
    this.selectedTexture;
    this.isHovered;
    this.clicking;

    this.init = function(card, pos, hand) {
        this.regTexture = this.getTexture(card, 'pics/tempcard.png');
        this.hoverTexture = this.getTexture(card, 'pics/tempcardhovered.png');
        this.selectedTexture = this.getTexture(card, 'pics/tempcardselected.png');
        this.sprite = this.getSprite(card);
        this.animateFrame = 0;
        this.interactable = false;
        this.position = pos;
        this.sprite.width = 175
        this.sprite.height = 280
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.card = card;
        this.cardState = 'draw'
        this.destroyCounter = 0;
        this.isHovered = false;
        this.clicking = false;
        this.hand = hand;
        app.stage.addChild(this.sprite);
    }

    this.getTexture = function(card, img) {
        console.log(img);
        return PIXI.loader.resources[img].texture;
    }

    this.getSprite = function(card) {
        return new PIXI.Sprite(this.regTexture);
    }

    this.isMousedOver = function(mouseX, mouseY) {
        return (
            this.sprite.x <= mouseX && this.sprite.x + this.sprite.width >= mouseX &&
            this.sprite.y <= mouseY && this.sprite.y + this.sprite.height >= mouseY 
        )
    }

    this.onHover = function() {
        this.isHovered = true;
    }

    this.offHover = function() {
        this.isHovered = false;
    }

    this.onSelect = function() {
        if (this.position === this.hand.selectedCardPos) {
            // Deselect the card
            this.hand.selectedCardPos = -1;
        } else {
            if (this.hand.selectedCardPos === -1) {
                // Select the card
                this.hand.selectedCardPos = this.position;
            } else {
                // Swap the cards
                this.hand.swapCards(this.position, this.hand.selectedCardPos);
                this.hand.selectedCardPos = -1;
            }
        }
    }

    this.runObject = function(mouseX,mouseY) {
        if (this.isMousedOver(mouseX,mouseY)) {
            this.onHover();
            if (app.mouse_pressed && !this.clicking) {
                this.clicking = true;
                this.onSelect();
            } else if (!app.mouse_pressed) {
                this.clicking = false;
            }
        } else {
            this.offHover();
        }
        this.animate()
    }

    this.animateDraw = function() {
        this.sprite.x = 50 + (this.position * (47 + this.sprite.width))

        this.sprite.y = 720 - 20 - this.sprite.height;
        this.interactable = true;
        this.cardState = 'hand'
    }

    this.animate = function() {
        console.log(this.hand.selectedCardPos);
        switch (this.cardState)  {
            case 'draw' :
                this.animateDraw();
                break;
            case 'hand' :
                if (this.hand.selectedCardPos === this.position) {
                    if (this.sprite.texture !== this.selectedTexture) {
                        this.sprite.texture = this.selectedTexture;
                    }
                } else if (this.isHovered) {
                    if (this.sprite.texture !== this.hoverTexture) {
                        this.sprite.texture = this.hoverTexture;
                    }
                } else {
                    if (this.sprite.texture !== this.regTexture) {
                        this.sprite.texture = this.regTexture;
                    }
                }
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
