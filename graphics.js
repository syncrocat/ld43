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

    this.init = function(card, pos, hand) {
        this.regTexture = this.getRegTexture(card);
        this.hoverTexture = this.getHoverTexture(card, 'pics/tempcardhovered.png');
        this.selectedTexture = this.getSelectedTexture(card, 'pics/tempcardselected.png');
        this.sprite = this.getSprite(card);
        this.animateFrame = 0;
        this.interactable = false;
        this.position = pos;
        this.sprite.width = 200
        this.sprite.height = 200
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.card = card;
        this.cardState = 'draw'
        this.destroyCounter = 0;
        this.isHovered = false;
        this.hand = hand;
        app.stage.addChild(this.sprite);
    }

    this.getRegTexture = function(card) {
        switch (card.cardType) {
            case "Wolf":
                return PIXI.loader.resources["pics/wolfcard.png"].texture;
            case "Deer":
                return PIXI.loader.resources["pics/deercard.png"].texture;
            default:
                return PIXI.loader.resources["pics/tempcard.png"].texture;
        }
    }

    this.getHoverTexture = function(card) {
        return PIXI.loader.resources["pics/tempcardhovered.png"].texture;
    }

    this.getSelectedTexture = function(card) {
        return PIXI.loader.resources["pics/tempcardselected.png"].texture;
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
            console.log(";)");
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
        let ohno = Math.random();
        if (this.isMousedOver(mouseX,mouseY)) {
            this.onHover();
            if (app.mouse_pressed && !app.mouse_held) {
                app.mouse_held = true;
                console.log("SELECTING CARD", this.position, ohno);
                this.onSelect();
            }
        } else {
            this.offHover();
        }

        this.animate();
    }

    this.animateDraw = function() {
        this.refreshPosition();
        this.interactable = true;
        this.cardState = 'hand'
    }

    this.animate = function() {
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

    this.refreshPosition = function() {
        this.sprite.x = 30 + (this.position * (30 + this.sprite.width));
        this.sprite.y = 720 - 20 - this.sprite.height;
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
