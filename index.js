app.renderer = PIXI.autoDetectRenderer(720, 720);
app.renderer.backgroundColor = 0xff0000;

// Add the canvas to the HTML document
document.body.appendChild(app.renderer.view);

app.stage = new PIXI.Container();
app.stage.interactive = true;
app.stage.buttonMode = true;
app.stage.hitArea = new PIXI.Rectangle(0, 0, 720, 720);
app.stage.on('mousedown', app.mouseDown)
app.stage.on('mouseup', app.mouseUp)

PIXI.loader
.add("pics/tempcard.png")
.add("pics/tempcardhovered.png")
.add("pics/tempcardselected.png")
.add("pics/cards/wolfcard.png")
.add("pics/cards/deercard.png")
.add("pics/cards/squidcard.png")
.add("pics/cards/salmoncard.png")
.add("pics/cards/anacondacard.png")
.add("pics/cards/bugcard.png")
.add("pics/cards/nukecard.png")
.add("pics/cards/batcard.png")
.add("pics/cards/harvestcard.png")
.add("pics/cards/funguscard.png")
.add("pics/cards/frogcard.png")
.add("pics/cards/sevencard.png")
.add("pics/deck.png")
.add("pics/commitbutton.png")
.add("pics/helpbutton.png")
.add("pics/treeswampwater.png")
.add("pics/treetreewater.png")
.add("pics/treewaterwater.png")
.add("pics/treeswampoil.png")
.add("pics/treetreeoil.png")
.add("pics/treeoiloil.png")
.add("pics/background.png")
.add("pics/cardbackground.png")
.add("pics/logbackground.png")
.add("pics/popup.png")
.add("pics/cloudbackground.png")
.add("pics/animals/bat1.png")
.add("pics/animals/bat2.png")
.add("pics/animals/deer1.png")
.add("pics/animals/deer2.png")
.add("pics/animals/frog1.png")
.add("pics/animals/salmon1.png")
.add("pics/animals/salmon2.png")
.add("pics/animals/salmon3.png")
.add("pics/animals/wolf1.png")
.add("pics/animals/wolf2.png")
.add("pics/animals/wolf3.png")
.add("pics/animals/bug1.png")
.add("pics/animals/bug2.png")
.add("pics/animals/bug3.png")
.add("pics/animals/squid1.png")
.add("pics/animals/squid2.png")
.add("pics/skull.png")
.load(function () {
    app.setup();
});

app.setup = function () {
    app.mouse_pressed = false;
    let background = new graphics.BackgroundObj();
    background.init();
    let log = new graphics.Log();
    log.init();

    let gameBoard = new GameBoard();
    gameBoard.init();
    let deckObj = new graphics.Deck();
    deckObj.init();
    let deck = new Deck()
    deck.init(gameBoard, 30, "Number of cards: ", 475, 12);
    let saveDeck = new Deck()
    saveDeck.init(gameBoard, 0, "Saved cards: ", 475, 150);
    let hand = new Hand();
    let submitButton = new graphics.SubmitObj();
    hand.init(gameBoard, deck, saveDeck, submitButton);
    submitButton.init(hand);
    let world = new graphics.World();
    world.init();
    //let killme = new graphics.BugObj();
    
    let cardBackgrounds = [];
    for (let i = 0; i < 3; i++) {
        cardBackgrounds.push(new graphics.CardBackground());
        cardBackgrounds[i].init(15 + (202 + 42) * i, 480);
    }
    let cardLabels = [];
    cardLabels.push(new graphics.TextObj())
    cardLabels.push(new graphics.TextObj());
    cardLabels.push(new graphics.TextObj());
    let style = {align: "left"};
    cardLabels[0].init("ACTIVATE", style, 15 + 101 - 60, 680);
    cardLabels[1].init("SAVE", style, 15 + 202 + 42 + 101 - 40, 680);
    cardLabels[2].init("DISCARD", style, 15 + 202 + 42 + 202 + 42 + 101 - 55, 680);

    let helpButton = new graphics.HelpButtonObj();
    helpButton.init();
    
    hand.drawCards();

    let testText = new graphics.TextObj();
    testText.init();

    let gameBox = {
        hand:hand,
        submit:submitButton,
        gameBoard:gameBoard,
    };
    // Start the game loop
    app.gameLoop(gameBox);
}

app.deadObjects = [];

app.gameLoop = function (gameBox) {
    // Comment
    requestAnimationFrame(() => app.gameLoop(gameBox));

    // Get mouse data
    var mouseposition = app.renderer.plugins.interaction.mouse.global;
    let mouseX = Math.round(mouseposition.x)
    let mouseY = Math.round(mouseposition.y)
    if (app.mouse_pressed) console.log(mouseX,mouseY)
    
    // 
    gameBox.hand.runCards(mouseX,mouseY);
    gameBox.submit.runObject(mouseX,mouseY);
    gameBox.gameBoard.runObjects();
    //gameBox.bugs.runObject()
    //gameBox.test.runObject();
    for (let i = 0; i < app.deadObjects.length; i++) {
        deadObjects[i].runObject();
    }

    app.mouse_held = app.mouse_pressed;

    

    // Render my game palsy
    app.renderer.render(app.stage);
}
    
