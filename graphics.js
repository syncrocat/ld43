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
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/commitbutton.png"].texture)
        this.sprite.x = 530
        this.sprite.y = 420;
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
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["pics/deck.png"].texture);
        this.sprite.x = 550;
        this.sprite.y = 46;
        app.stage.addChild(this.sprite);
    }

    this.setNumCards = function(n) {
        this.numCards = n;
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
        this.sprite.y = 130;
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
        this.sprite.y = 420;
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

app.numDeer = 0;

graphics.AnimalObj = function() {
    this.speed;
    this.animalName;
    this.gameBoard;
    this.textures;
    this.animationState;
    this.animationState2;
    this.animationStates;
    this.headDownTimer;
    this.headUpTimer;
    this.changeTimer;
    this.numFish;
    this.xPointLeft;
    this.xPointRight;
    this.speeds;
    this.frame;

    this.init = function(animalName, gameBoard) {
        this.speed = 0.5;
        

        this.animalName = animalName;
        this.gameBoard = gameBoard;
        this.animationState = 0;
        this.animationState2 = 0;
        
        //if (this.animalName == 'salmon') this.animationState = 1;
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
        
        if (this.animalName != 'salmon') {
            this.sprite = new PIXI.Sprite(this.textures[0]);
            this.sprite.x = -10;
            this.sprite.y = -10;
    
            this.sprite.anchor.set(0.5);
            this.placeOnGameBoard();
            app.stage.addChild(this.sprite)
        } else {
            this.sprites = []
            this.numFish =7;
            this.animationStates = []
            this.xPointLeft = [];
            this.xPointRight = [];
            this.speeds = [];
            for (let i = 0; i<this.numFish; i++) {
                this.animationStates.push(1)
                let fishyman = Math.floor(Math.random() * 3)
                this.sprites[i] = new PIXI.Sprite(this.textures[fishyman])
                let bigMOOD = Math.floor(Math.random() * 50)
                this.sprites[i].x = 520 - bigMOOD
                this.sprites[i].y = 337 - bigMOOD * (6/11)
                let randMoved = Math.floor(Math.random() * 200 - 40)
                this.sprites[i].x -= randMoved;
                this.sprites[i].y += randMoved*(6/11);
                this.sprites[i].scale.x *= -1
                this.sprites[i].scale.y *= -1
                this.xPointLeft[i] = 345 - bigMOOD
                this.xPointRight[i] = 590 - bigMOOD * (6/11)
                this.speeds[i] = 0.3 + Math.random() * 0.4 - 0.2
                console.log(this.sprites[i].x)
                console.log(this.sprites[i].y)
                this.sprites[i].anchor.set(0.5);
                app.stage.addChild(this.sprites[i])
            }

        }
        
        
        

        
        
    }

    this.placeOnGameBoard = function() {
        console.log(app.numDeer)
        if (this.animalName == 'deer') {
            app.numDeer += 1;
            if (app.numDeer ==1 ) {
                this.sprite.x = 367 +24
                this.sprite.y = 289 +8
                this.headUpTimer = 100;
                this.headDownTimer = 100;
            } else if (app.numDeer ==2) {
                this.sprite.x = 461 
                this.sprite.y = 240
                this.sprite.scale.x = -1;
                this.headUpTimer = 200;
                this.headDownTimer = 50;
                this.frame = 30;
            } else {
                this.sprite.x = 229 
                this.sprite.y = 314
                this.sprite.scale.x = -1
                this.headUpTimer = 150;
                this.headDownTimer = 75;
                this.frame = 89;
            }
            this.changeTimer = this.headDownTimer;
        }
        if (this.animalName == 'salmon') {
            this.sprite.scale.x = -1
            this.sprite.scale.y = -1
            this.sprite.x = 520;
            this.sprite.y = 337;
        }
        if (this.animalName == 'wolf') {
            this.sprite.x = 411
            this.sprite.y = 213
        }
        if (this.animalName == 'frog') {
            this.sprite.x = 206
            this.sprite.y = 280
        }
        if (this.animalName == 'bat') {
            this.animationState = 1;
            this.sprite.x = 205
            this.sprite.y = 200
        }
        if (this.animalName == 'squid') {
            this.sprite.x = 354
            this.sprite.y = 414
        }
    }

    this.loadTexture = function(img) {
        console.log(img)
        return PIXI.loader.resources[img].texture;
    }

    this.runDeer = function() {
        if (this.frame > this.changeTimer) {
            this.sprite.y += this.animationState == 0 ? 5 : -5;
            this.changeTimer = this.animationState == 0 ? this.headUpTimer : this.headDownTimer;
            this.animationState = this.animationState == 0 ? 1 : 0;
            this.sprite.texture = this.textures[this.animationState];
            this.frame = 0;
        }
    }

    this.runWolf = function() {
        if (this.animationState == 0) {
            if (this.frame > 300) {
                //this.frame = 0
                this.animationState = 1;
            }
        } else if (this.animationState ==1 ) {
            if (this.frame > 30) {
                this.animationState2 = this.animationState2 == 0? 1 : 0;
                this.sprite.texture = this.textures[this.animationState2 + 1];
                this.frame = 0;
            }
            this.sprite.x -= 0.25
            if (this.sprite.x < 290) {
                this.sprite.scale.x = -1;
                this.animationState = 2;
            }
        } else {
            if (this.frame > 30) {
                this.animationState2 = this.animationState2 == 0? 1 : 0;
                this.sprite.texture = this.textures[this.animationState2 + 1];
                this.frame = 0;
            }
            this.sprite.x += 0.25
            if (this.sprite.x >= 411) {
                this.sprite.scale.x = 1;
                this.animationState = 0;
                this.frame = 0;
            }
        }
    }

    this.runBat = function() {
        if (this.frame > 30) {
            this.animationState2 = this.animationState2 == 0? 1 : 0;
            this.sprite.texture = this.textures[this.animationState2 ];
            this.frame = 0;
        }
        this.sprite.x -= 0.5 * this.animationState
        this.sprite.y += 0.5 * (6/11) * this.animationState
        //this.frame = 0;

        if (this.sprite.x < 113 || this.sprite.x > 205) {
            this.animationState = this.animationState * -1
            this.sprite.scale.x *= -1;
            //this.sprite.scale.y *= -1;
        }

    }

    this.runSquid = function() {
        this.sprite.x += this.speed;
        this.sprite.y -= this.speed * (6/11);
        if (this.frame > 100) {
            this.sprite.texture = this.textures[1];
            this.speed = 4 * (this.speed / Math.abs(this.speed));
            this.frame = 0;
        }
        if (Math.abs(this.speed) > 0.5) {
            this.speed *= 0.95;
            this.frame = 0;
        } else {
            this.sprite.texture = this.textures[0];
        }
        if (this.sprite.x < 345 || this.sprite.x > 590) {
            this.speed *= -1;
            this.sprite.scale.x *= -1;
            this.sprite.scale.y *= -1;
        }
    }

    this.runSalmon = function() {
        for (let i = 0; i < this.numFish; i++) {
            //console.log(this.animationStates[i])
            this.sprites[i].x -= this.speeds[i] * this.animationStates[i]
            this.sprites[i].y += this.speeds[i] * (6/11) * this.animationStates[i]

            if (this.sprites[i].x < this.xPointLeft[i] || this.sprites[i].x > this.xPointRight[i]) {
                this.animationStates[i] = this.animationStates[i] * -1
                this.sprites[i].scale.x *= -1;
                this.sprites[i].scale.y *= -1;
            }
            
        }
        
        
    }

    this.runObject = function() {
        this.frame += 1;
        if (this.animalName == 'deer') this.runDeer()
        if (this.animalName == 'salmon') this.runSalmon()
        if (this.animalName == 'wolf') this.runWolf()
        if (this.animalName == 'bat') this.runBat();
        if (this.animalName == 'squid') this.runSquid();

    }
}