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
.add("pics/tempdeckcard.png")
.add("pics/tempsubmit.png")
.load(function () {
    app.setup();
});

app.setup = function () {
    app.mouse_pressed = false;

    let deck = new Deck()
    deck.init(25)
    let saveDeck = new Deck()
    saveDeck.init(0)
    let hand = new Hand();
    let submitButton = new graphics.SubmitObj();
    hand.init(deck, saveDeck, submitButton)
    submitButton.init(hand);

    hand.drawCards();

    let gameBox = {
        hand:hand,
        submit:submitButton,
    }
    // Start the game loop
    app.gameLoop(gameBox);
}

app.gameLoop = function (gameBox) {
    // Comment
    requestAnimationFrame(() => app.gameLoop(gameBox));

    //console.log(app.mouse_pressed)

    // Get mouse data
    var mouseposition = app.renderer.plugins.interaction.mouse.global;
    let mouseX = Math.round(mouseposition.x)
    let mouseY = Math.round(mouseposition.y)
    
    // 
    gameBox.hand.runCards(mouseX,mouseY);
    gameBox.submit.runObject(mouseX,mouseY);


    // Render my game palsy
    app.renderer.render(app.stage);
}
    
