app.renderer = PIXI.autoDetectRenderer(725, 720);
app.renderer.backgroundColor = 0xff0000;

// Add the canvas to the HTML document
document.body.appendChild(app.renderer.view);

app.stage = new PIXI.Container();
app.stage.interactive = true;
app.stage.buttonMode = true;
app.stage.hitArea = new PIXI.Rectangle(0, 0, 725, 825);
app.stage.on('mousedown', app.mouse_down)
app.stage.on('mouseup', app.mouse_up)

PIXI.loader
.add("pics/tempcard.png")
.add("pics/tempdeckcard.png")
.add("pics/tempsubmit.png")
.load(function () {
    app.setup();
});

app.setup = function () {
    app.mouse_state = 'off';
    app.mouse_pressed = false;

    let deck = new Deck()
    deck.init(25)
    let saveDeck = new Deck()
    saveDeck.init(0)
    let hand = new Hand()
    hand.init(deck, saveDeck)

    let submitButton = new graphics.SubmitObj();
    submitButton.init();

    hand.drawCards();

    // Start the game loop
    app.gameLoop(hand);
}

app.gameLoop = function (hand) {
    // Comment
    requestAnimationFrame(() => app.gameLoop(hand));

    // Get mouse data
    var mouseposition = app.renderer.plugins.interaction.mouse.global;
    let mouseX = Math.round(mouseposition.x)
    let mouseY = Math.round(mouseposition.y)
    
    // 
    hand.runCards(mouseX,mouseY);

    // Render my game palsy
    app.renderer.render(app.stage);
}
    
