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
.add("pics/wolfcard.png")
.add("pics/deercard.png")
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
.add("pics/animals/squid1.png")
.add("pics/animals/squid2.png")
.load(function () {
    app.setup();
});

app.setup = function () {
    app.mouse_pressed = false;
    let background = new graphics.BackgroundObj();
    background.init();

    let gameBoard = new GameBoard();
    gameBoard.init();
    let deckObj = new graphics.Deck();
    deckObj.init();
    let deck = new Deck()
    deck.init(gameBoard, 25)
    let saveDeck = new Deck()
    saveDeck.init(gameBoard, 0)
    let hand = new Hand();
    let submitButton = new graphics.SubmitObj();
    hand.init(gameBoard, deck, saveDeck, submitButton)
    submitButton.init(hand);
    let world = new graphics.World();
    world.init();
    let log = new graphics.Log();
    log.init();
    let cardBackgrounds = [];
    for (let i = 0; i < 3; i++) {
        cardBackgrounds.push(new graphics.CardBackground());
        cardBackgrounds[i].init(15 + (202 + 42) * i, 500);
    }
    let helpButton = new graphics.HelpButtonObj();
    helpButton.init();

    let test = new graphics.AnimalObj();
    test.init('salmon', gameBoard);
    let testDeer = new graphics.AnimalObj();
    testDeer.init('squid',gameBoard)
    let testDeer2 = new graphics.AnimalObj();
    testDeer2.init('bat',gameBoard)
    let testDeer3 = new graphics.AnimalObj();
    testDeer3.init('wolf',gameBoard)
    let m = new graphics.AnimalObj();
    m.init('frog',gameBoard)
    let mm = new graphics.AnimalObj();
    mm.init('deer',gameBoard)
    let mmm = new graphics.AnimalObj();
    mmm.init('deer',gameBoard)
    let mmmm = new graphics.AnimalObj();
    mmmm.init('deer',gameBoard)
    let animals = []
    animals.push(test)
    animals.push(testDeer)
    animals.push(testDeer2)
    animals.push(testDeer3)
    animals.push(m)
    animals.push(mm)
    animals.push(mmm)
    animals.push(mmmm)

    
    hand.drawCards();

    let gameBox = {
        hand:hand,
        submit:submitButton,
        gameBoard:gameBoard,
        animals:animals
    };
    // Start the game loop
    app.gameLoop(gameBox);
}

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
    for (let animal in gameBox.animals) {
        gameBox.animals[animal].runObject();
    }
    //gameBox.test.runObject();

    app.mouse_held = app.mouse_pressed;

    

    // Render my game palsy
    app.renderer.render(app.stage);
}
    
