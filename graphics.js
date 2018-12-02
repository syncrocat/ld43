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
        this.sprite.width = 175;
        this.sprite.height = 175;
        this.sprite.x = -500;
        this.sprite.y = -500;
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
        this.sprite.y = 720 - 50 - this.sprite.height;
    }

}

graphics.SubmitObj = function() {
    this.sprite;
    this.hand;
    this.enabled;

    this.init = function(hand) {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/commitbutton.png"].texture)
        this.sprite.x = 530
        this.sprite.y = 400;
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
    
    this.init = function() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/deck.png"].texture);
        this.sprite.x = 550;
        this.sprite.y = 46;
        app.stage.addChild(this.sprite);
    }
}

graphics.World = function() {
    this.sprite;
    this.textures = {};

    this.init = function() {
        this.textures = {
            treeswampwater: this.loadTexture("pics/treeswampwater.png"),
            treetreewater: this.loadTexture("pics/treetreewater.png"),
            treewaterwater: this.loadTexture("pics/treewaterwater.png"),
            treeswampoil: this.loadTexture("pics/treeswampoil.png"),
            treetreeoil: this.loadTexture("pics/treetreeoil.png"),
            treeoiloil: this.loadTexture("pics/treeoiloil.png")
        };

        this.sprite = new PIXI.Sprite(this.textures.treeswampwater);
        this.sprite.x = 75;
        this.sprite.y = 110;;
        app.stage.addChild(this.sprite);
    }

    this.loadTexture = function(img) {
        return PIXI.loader.resources[img].texture;
    }
}

graphics.Log = function() {
    this.sprite;

    this.init = function() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/logbackground.png"].texture);
        this.sprite.x = 10;
        this.sprite.y = 10;
        app.stage.addChild(this.sprite);
    }
}

graphics.CardBackground = function() {
    this.sprite;

    this.init = function(x, y) {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/cardbackground.png"].texture);
        this.sprite.x = x;
        this.sprite.y = y;
        app.stage.addChild(this.sprite);
    }
}

graphics.HelpButtonObj = function() {
    this.sprite;

    this.init = function() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/helpbutton.png"].texture);
        this.sprite.x = 50;
        this.sprite.y = 400;
        app.stage.addChild(this.sprite);
    }
}

graphics.BackgroundObj = function() {
    this.sprite;
    this.cloudSprite;

    this.init = function() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/background.png"].texture);
        this.cloudSprite = new PIXI.Sprite(PIXI.loader.resources["pics/cloudbackground.png"].texture);
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.cloudSprite.x = 0;
        this.cloudSprite.y = 0;
        app.stage.addChild(this.sprite);
        app.stage.addChild(this.cloudSprite);
    }
}

graphics.AnimalObj = function() {
    this.animalName;
    this.gameBoard;
    this.textures;
    this.animationState;
    this.frame;

    this.init = function(animalName, gameBoard) {

        this.animalName = animalName;
        this.gameBoard = gameBoard;
        this.animationState = 0;
        if (this.animalName == 'salmon') this.animationState = 1;
        this.frame = 0;

        this.textures = [];
        // This is the worst possible way to do this but we're short on time so don't @ me
        let numTexts = (animalName == 'wolf' || animalName == 'salmon') ? 3 : 2;
        if (animalName == 'frog') numTexts = 1;
        for (let i = 1; i < numTexts + 1; i++) {
            let imgName = "pics/animals/" + animalName + i + '.png';
            console.log(imgName)
            this.textures.push(this.loadTexture(imgName))
        };
        
        this.sprite = new PIXI.Sprite(this.textures[0]);
        this.sprite.x = -10;
        this.sprite.y = -10;

        this.sprite.anchor.set(0.5);
        
        

        this.placeOnGameBoard();
        app.stage.addChild(this.sprite)
    }

    this.placeOnGameBoard = function() {
        console.log(this.animalName)
        if (this.animalName == 'deer') {
            this.sprite.x = 367 +24
            this.sprite.y = 289 +8
        }
        if (this.animalName == 'salmon') {
            this.sprite.scale.x = -1
            this.sprite.scale.y = -1
            this.sprite.x = 520;
            this.sprite.y = 337;
        }
    }

    this.loadTexture = function(img) {
        console.log(img)
        return PIXI.loader.resources[img].texture;
    }

    this.runDeer = function() {
        if (this.frame > 100) {
            this.sprite.y += this.animationState == 0 ? 5 : -5;
            this.animationState = this.animationState == 0 ? 1 : 0;
            this.sprite.texture = this.textures[this.animationState];
            this.frame = 0;
        }
    }

    this.runSalmon = function() {
        if (this.frame >1) {
            this.sprite.x -= 0.3 * this.animationState
            this.sprite.y += 0.3 * (6/11) * this.animationState
            this.frame = 0;

            if (this.sprite.x < 345 || this.sprite.x > 590) {
                this.animationState = this.animationState * -1
                this.sprite.scale.x *= -1;
                this.sprite.scale.y *= -1;
            }
        } 
        
    }

    this.runObject = function() {
        this.frame += 1;
        if (this.animalName == 'deer') this.runDeer()
        if (this.animalName == 'salmon') this.runSalmon()

    }
}

graphics.TextObj = function() {
    this.text;

    this.init = function(text, style, x, y) {
        this.text = new PIXI.Text(text, style); //{ fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center' });
        this.text.x = x;
        this.text.y = y;
        app.stage.addChild(this.text);
    }
};