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