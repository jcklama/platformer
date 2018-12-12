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