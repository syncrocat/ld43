app.renderer = PIXI.autoDetectRenderer(725, 720);
app.renderer.backgroundColor = 0xff0000;

// Add the canvas to the HTML document
document.body.appendChild(app.renderer.view);

app.stage = new PIXI.Container();
app.stage.interactive = true;
app.stage.buttonMode = true;
app.stage.hitArea = new PIXI.Rectangle(0, 0, 725, 720);
app.stage.on('mousedown', app.mouseDown)
app.stage.on('mouseup', app.mouseUp)

PIXI.loader
.add("pics/tempcard.png")
.add("pics/tempcardhovered.png")
.add("pics/tempcardselected.png")
.add("pics/wolfcard.png")
.add("pics/deercard.png")
.add("pics/tempdeckcard.png")
.add("pics/tempsubmit.png")
.load(function () {
    app.setup();
});

app.setup = function () {
    app.mouse_pressed = false;

    let gameBoard = new GameBoard();
    gameBoard.init();
    let deck = new Deck()
    deck.init(gameBoard, 25)
    let saveDeck = new Deck()
    saveDeck.init(gameBoard, 0)
    let hand = new Hand();
    let submitButton = new graphics.SubmitObj();
    hand.init(gameBoard, deck, saveDeck, submitButton)
    submitButton.init(hand);
    
    hand.drawCards();

    let gameBox = {
        hand:hand,
        submit:submitButton,
        gameBoard:gameBoard,
    }
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
    
    // 
    gameBox.hand.runCards(mouseX,mouseY);
    gameBox.submit.runObject(mouseX,mouseY);

    app.mouse_held = app.mouse_pressed;

    // Render my game palsy
    app.renderer.render(app.stage);
}
    
