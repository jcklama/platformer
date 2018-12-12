/* A game is a series of constant updates using requestAnimationFrame to paint the screen.
Updates are made from input, processing and output. 
main.js kicks off the update & render on load */

window.addEventListener("load", function () {

    const keyDown = function (event) {
        input.keys[event.keyCode] = true;
        input.pressState(event.type, event.keyCode);
    }

    const keyUp = function (event) {
        input.keys[event.keyCode] = false;
        input.pressState(event.type, event.keyCode);
    }

    // relation b/w input and game
    const update = function () {
        if (input.keys[37]) { game.player.moveLeft(); }
        if (input.keys[38] && input.up.active) { game.player.jump(); input.up.active = false }
        /* 
        input.up.active = false prevents jumping while holding down key 
        Comparison inside input.js: 
        1. true != true (this.down != down)
        2. this.active never set to true
        3. jump will not fire when key is fired after the first trigger (i.e. key held down)

        When keyup is triggered:
        1. true != false
        2. this.down set to 'false'
        3. this.active = false; jump is not triggered. Makes sense to not jump when key not held down
        
        When keydown triggered again:
        1. false != true <-- if pressState() is not triggered on keyup, this would be true!= true and this.active would stay false
        2. this.down set to 'true'
        3. this.active now set to true. Was previously false from the first keydown. Jump will fire.

        this.active is false the moment keydown is detected until the next keydown
        */
        if (input.keys[39]) { game.player.moveRight() }

        game.update(game.player);
        // console.log(game.player.x);
        // console.log(game.player.y);
    }

    // relation b/w game and display
    const render = function () {
        output.drawMap(game.map, game.columns) /* map is draw every update as opposed to on load, because may change? */
        output.drawPlayer(game.player.getX(), game.player.getY(), game.player.getWidth(), game.player.getHeight());
    }

    const input = new Input();
    const game = new Game();
    const output = new Output(document.querySelector('canvas'), game.player);
    const engine = new Engine(1000 / 30, update, render);

    output.tilesheet.image.src = "../../assets/jungle tileset.png";

    output.tilesheet.image.addEventListener('load', function () {

        engine.run();

    }, { once: true })

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);


});