const Engine = function (updateInterval, update, render) {

    this.accumulatedTime = 0;
    this.count = 0;
    this.updateInterval = updateInterval;
    this.update = update;
    this.render = render;

    this.updated = false;

    this.run = function () {
        this.count += 1;
        // console.log(0);
        this.update();
        this.render();
        // this.time = window.performance.now();
        // this.accumulatedTime += this.time - (this.updateInterval * this.count);

        // while (this.accumulatedTime >= this.updateInterval) {
        //     this.accumulatedTime -= this.updateInterval;
        //     this.count += 1;
        //     this.update();
        //     this.updated = true;
        // }

        // if (this.updated) {
        //     this.updated = false;
        //     this.render();
        // }

        // console.log('Frames updated');

        // cannot simply pass this.run because 'this' will refer to the calling object (window) 
        // By creating arrow function, this.argRun runs this.run where 'this' in 'this.run' refers to the engine object
        window.requestAnimationFrame(this.argRun);
        // we don't pass in this.argRun(); we are not invoking the function, simply passing it as an argument
    }

    this.argRun = () => { this.run() };

};

// Engine.prototype = {
//     start: function () {
//         this.time = window.performance.now();
//     }
// };

const Input = function () {

    // const self = this;
    this.keys = [];

    this.left = new Input.Object();
    this.up = new Input.Object();
    this.right = new Input.Object();

    this.pressState = function (type, keyCode) {

        const down = (type === "keydown") ? true : false;
        switch (keyCode) {
            case 37: this.left.updateState(down);
            case 38: this.up.updateState(down);
            case 39: this.right.updateState(down);
        }
    }

    // Jump logic addresses 2 things:
    // 1. Not being able to jump mid air. This is handled inside game.js if !this.jumping
    // 2. Not repeatedly jumping when holding down up key. This is handled by active/down state logic in main.js.
    // 1. will not execute if 2. is not satisfied

};

Input.Object = function () {
    this.active = this.down = false;
}

Input.Object.prototype = {

    updateState: function (down) {
        if (this.down != down) this.active = down;
        this.down = down;
    }

}

// First time through (keydown):
// false != true
// this.active = true
// this.down = true
// jump & this.active = false <-- this prevents triggering jump again while mid-air

// First time through (keyup):
// true!= false
// this.active = false
// this.down = false
// no jump
// *** By not adding pressState function to keyup, we are not setting 'this.down' to false. 
// If this the case, on next keypress, we will have true!= true. This prevents this.active being set to true on next keydown. ***

// Second time through (keydown):
// false != true
// this.active = true
// this.down = true
// jump
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
const Output = function (canvas, player) {

    // declaring tilesize of 32px & 10 columns
    this.tilesheet = new Output.Tilesheet(16, 39);

    this.ctx = canvas.getContext('2d');
    this.ctx.canvas.width = 640;    // 40 tiles
    this.ctx.canvas.height = 512;   // 32 tiles
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    // canvas.style.border = "solid 2px black";

    // this.ctx.canvas.width = window.innerWidth;      // width of viewport
    // this.ctx.canvas.height = window.innerHeight;    // height of viewport

    this.drawPlayer = function (x, y, width, height, ) {

        this.ctx.fillRect(x, y, width, height);
    }

    this.drawMap = function (map, columns) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (i = 0; i < map.length; i++) {
            let value = map[i];
            /* using value for the tilesheet because that's what it maps to */
            let srcX = (value % this.tilesheet.numOfColumns) * this.tilesheet.tileSize;
            let srcY = Math.floor(value / this.tilesheet.numOfColumns) * this.tilesheet.tileSize;
            let destX = (i % columns) * this.tilesheet.tileSize;
            let destY = Math.floor(i / columns) * this.tilesheet.tileSize;

            this.ctx.drawImage(this.tilesheet.image, srcX, srcY, this.tilesheet.tileSize, this.tilesheet.tileSize, destX, destY, this.tilesheet.tileSize, this.tilesheet.tileSize);
        }
    }
};

Output.Tilesheet = function (tilesize, columns) {
    this.image = document.createElement('img'); /* can also use new Image(); */ /* Both return HTMLImageElement instances */
    this.tileSize = tilesize;
    this.numOfColumns = columns;
}

Output.Tilesheet.prototype = {};