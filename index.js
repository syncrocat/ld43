app.renderer = PIXI.autoDetectRenderer(725, 825);
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
.add("assets/player.png")
.load(function () {
    app.setup();
});

app.setup = function () {
    // Set up keyboard input
    app.bindKeys();

    // Set up player
    app.test = new PIXI.Sprite(PIXI.loader.resources["assets/player.png"].texture);
    app.test.x = 340;
    app.stage.addChild(app.test);
    app.mouse_state = 'off';
    app.mouse_pressed = false;

    app.c = 0;
    app.player = new app.playerObj(100, 100);
    app.player.setup();

    // Start the game loop
    app.gameLoop();
}

app.gameLoop = function () {
        // Get mouse data
        var mouseposition = app.renderer.plugins.interaction.mouse.global;
        app.last_mouse_x = app.mouse_x;
        app.last_mouse_y = app.mouse_y;
        app.mouse_x = Math.round(mouseposition.x)
        app.mouse_y = Math.round(mouseposition.y)

        // Comment
        requestAnimationFrame(app.gameLoop);
        
        // 


        // Render my game palsy
        app.renderer.render(app.stage);
    }
    
