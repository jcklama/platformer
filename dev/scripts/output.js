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