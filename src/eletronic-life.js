/*var plan = [
    "##############################",
    "#     #     #         o     ##",
    "#                            #",
    "#         #####              #",
    "##        #   #    ##        #",
    "###          ##     #        #",
    "#          ###      #        #",
    "#   ###                      #",
    "#   ##      o                #",
    "# o  #        o          ### #",
    "#    #                       #",
    "##############################"
];*/

/*var planWallFlowers = [
    "############",
    "#     #    #",
    "#   ~    ~ #",
    "#  ##      #",
    "#  ##  o####",
    "#          #",
    "############"
];*/

var valley = [
    "##############################",
    "#####                    #####",
    "##   ***                  **##",
    "#   *##**          **   o  *##",
    "#    ***      o    ##**     *#",
    "#        o         ##***     #",
    "#                  ##**      #",
    "#   o       #*               #",
    "#*          #**       o      #",
    "#***        ##**    o      **#",
    "##****     ###***         *###",
    "###############################"
];

//**************************************************
//*                    VECTOR
//**************************************************

/*
 *  Type Vector. To represent squares identified by x an y coordinates.
 */

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

/*
 * Adds two vectors.
 */
Vector.prototype.plus = function (otherVector) {
    return new Vector(this.x + otherVector.x, this.y + otherVector.y);
};

//**************************************************
//*                    GRID
//**************************************************

/*
 * Grid. (x, y) = x + (y * width)
 * Op1: var grid =[[1, 2, 3],
 *                 [4, 5, 6],
 *                 [7, 8, 9]];
 *      width = 3, heigth = 3
 *      Object at (1, 3) = grid[2][0] = 7
 * Op2: var grid = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 *      width = 3, heigth = 3, length = 3 x 3 = 9;
 *      Object at (1, 3) = grid[x + (y * width)] = grid[0 + (2 * 3)] = grid[6] = 7
 * Ex. //var grid = ["top left", "top middle", "top right", "bottom left", "bottom middle", "bottom right"];
 * Type Grid.
 */
function Grid(width, height) {
    this.space = new Array(width * height); // Saves the space.
    this.width = width;
    this.height = height;
}

/*
 * Checks if the vector is inside the bounds of the grid.
 */
Grid.prototype.isInside = function (vector) {
    return vector.x >= 0 && vector.x < this.width && vector.y >= 0 && vector.y < this.height;
};

/*
 * Get the element at the x + (y * width) position in the Grid.
 */
Grid.prototype.get = function (vector) {
    return this.space[vector.x + this.width * vector.y];
};

/*
 * Sets a value at the x + (y * width) position in the Grid.
 */
Grid.prototype.set = function (vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
};

// Trivial Test:
/*var grid = new Grid(5, 5);
console.log(grid.get(new Vector(1, 1))); // Undefined
grid.set(new Vector(1, 1), "X");
console.log(grid.get(new Vector(1, 1))); // "X"*/

/*
 * own ForEach function
 */
Grid.prototype.forEach = function (f, context) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var value = this.space[x + y * this.width];
            if (value !== null) {
                f.call(context, value, new Vector(x, y));
            }
        }
    }
};

//**************************************************
//*               DIRECTIONS
//**************************************************

/*
 * Directions to map names to coordinates offsets.
 */
var directions = {
    n: new Vector(0, -1),
    ne: new Vector(1, -1),
    e: new Vector(1, 0),
    se: new Vector(1, 1),
    s: new Vector(0, 1),
    sw: new Vector(-1, 1),
    w: new Vector(-1, 0),
    nw: new Vector(-1, -1)
};

// Example:
/*
 * Chooses a random element from an array.
 */
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/*
 * directionNames = ["n", "ne", "e", ...]
 */
var directionNames = "n ne e se s sw w nw".split(" ");

// Computes Compass Directions.
function dirPlus(dir, n) { //ne, 2 = (45°)
    var index = directionNames.indexOf(dir); //1
    return directionNames[(index + n + 8) % 8]; // (1 + 2 + 8) % 8 = 3 = 'se'
}

//console.log(dirPlus('ne', 2)); // 'se'

//**************************************************
//*                      VIEW
//**************************************************
/*
 * The View Object
 */
function View(world, vector) {
    this.world = world;
    this.vector = vector;
}

View.prototype.look = function (dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target)) {
        return charFromElement(this.world.grid.get(target));
    } else {
        return '#';
    }
};

View.prototype.findAll = function (ch) {
    var found = [];
    for (var dir in directions) {
        if (this.look(dir) === ch) {
            found.push(dir);
        }
    }
    return found;
};

View.prototype.find = function (ch) {
    var found = this.findAll(ch);
    if (found.length === 0) {
        return null;
    }
    return randomElement(found);
};

//**************************************************
//*                 CRITTERS
//**************************************************

/*
 * Class BouncingCritter.
 */
function BouncingCritter() {
    //Asigns a random direction.
    this.direction = randomElement(directionNames);
}

/*
 * Act method for the critter.
 */
BouncingCritter.prototype.act = function (view) {
    //If when looking to the Critter's direction there's NOT a space
    if (view.look(this.direction) !== " ") {
        // Try to find a empty space to move
        // Otherwise, move to the south.
        this.direction = view.find(" ") || 's';
    }
    // Act, always returns a action type and extra information.
    // In this case, the type is "move" and "direction" indicates
    // where to move.
    return {
        type: "move",
        direction: this.direction
    };
};

//**************************************************
//*                  WALL OBJECT
//**************************************************
function Wall() {}

//**************************************************
//*               WALL FLOWER OBJECT
//**************************************************
function WallFlower() {
    this.dir = "s";
}

WallFlower.prototype.act = function (view) {
    var start = this.dir; // Default "s"
    if (view.look(dirPlus(this.dir, -3)) !== " ") { //if position 'ne' != empty space maybe a wall
        start = this.dir = dirPlus(this.dir, -2); //start = this.dir = 'e'
    }
    while (view.look(this.dir) !== " ") { //While this.dir is not a empty space...
        this.dir = dirPlus(this.dir, 1); //Turn 45° until you find a empty space.
        if (this.dir === start) { // If never found a empty space, breaks the while.
            break;
        }
    }
    return {
        type: "move",
        direction: this.dir
    };
};

//**************************************************
//*               THE WORLD OBJECT
//**************************************************

/*
 * Gets an element from the legend usign its constructor.
 */
function elementFromChar(legend, ch) {
    if (ch === " "){
        return null;
    }
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
}

/*
 * Gets the char of an element.
 */
function charFromElement(element) {
    if (element === null) {
        return " ";
    } else {
        return element.originChar;
    }
}

/*
 * World Class.
 */
function World(map, legend) {
    var grid = new Grid(map[0].length, map.length); // width * height
    this.grid = grid;
    this.legend = legend;

    map.forEach(function (line, y) {
        for (var x = 0; x < line.length; x++) {
            grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
        }
    });
}

/*
 * Prints a World as a String.
 */
World.prototype.toString = function () {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += '\n';
    }
    return output;
};

// Example New World:
/*var world = new World(plan, {
    "#": Wall,
    "o": BouncingCritter
});*/

/*
 * Turn
 */
World.prototype.turn = function () {
    var acted = [];
    this.grid.forEach(function (critter, vector) {
        if (critter.act && acted.indexOf(critter) === -1) {
            acted.push(critter);
            this.letAct(critter, vector);
        }
    }, this);
    return acted.length;
};

/*
 * letAct
 */
World.prototype.letAct = function (critter, vector) {
    var action = critter.act(new View(this, vector));
    if (action && action.type === "move") {
        var dest = this.checkDestination(action, vector);
        if (dest && this.grid.get(dest) === null) {
            this.grid.set(vector, null);
            this.grid.set(dest, critter);
        }
    }
};

/*
 * checkDestination
 */
World.prototype.checkDestination = function (action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest)) {
            return dest;
        }
    }
};

//**************************************************
//*            THE LIFE LIKE WORLD OBJECT
//**************************************************

function LifeLikeWorld(map, legend) {
    World.call(this, map, legend);
}

LifeLikeWorld.prototype = Object.create(World.prototype);

LifeLikeWorld.prototype.letAct = function (critter, vector) {
    var action = critter.act(new View(this, vector));
    var handled = action && action.type in actionTypes && actionTypes[action.type].call(this, critter, vector, action);
    if (!handled) {
        critter.energy -= 0.2;
        if (critter.energy <= 0) {
            this.grid.set(vector, null); //Critter dies :'(
        }
    }
};

//**************************************************
//*            ACTION TYPES
//**************************************************
var actionTypes = Object.create(null);

actionTypes.grow = function (critter) {
    critter.energy += 0.5;
    return true;
};

actionTypes.move = function (critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    if (dest === null || critter.energy <= 1 || this.grid.get(dest) !== null) {
        return false;
    }
    critter.energy -= 1;
    this.grid.set(vector, null);
    this.grid.set(dest, critter);
    return true;
};

actionTypes.eat = function (critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    var atDest = dest !== null && this.grid.get(dest);
    if (!atDest || atDest.energy === null) {
        return false;
    }
    critter.energy += atDest.energy;
    this.grid.set(dest, null);
    return true;
};

actionTypes.reproduce = function (critter, vector, action) {
    var baby = elementFromChar(this.legend, critter.originChar);
    var dest = this.checkDestination(action, vector);
    if (dest === null || critter.energy <= 2 * baby.energy || this.grid.get(dest) !== null) {
        return false;
    }
    critter.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return true;
};

//**************************************************
//*                     PLANT OBJECT
//**************************************************
function Plant() {
    this.energy = 3 + Math.random() * 4;
}

Plant.prototype.act = function (view) {
    if (this.energy > 15) {
        var space = view.find(" ");
        if (space) {
            return {
                type: "reproduce",
                direction: space
            };
        }
    }
    if (this.energy < 20) {
        return {
            type: "grow"
        };
    }
};

//**************************************************
//*              PLANT EATER OBJECT
//**************************************************
function PlantEater() {
    this.energy = 20;
}

PlantEater.prototype.act = function (view) {
    var space = view.find(" ");
    if (this.energy > 60 && space) {
        return {
            type: "reproduce",
            direction: space
        };
    }
    var plant = view.find("*");
    if (plant) {
        return {
            type: "eat",
            direction: plant
        };
    }
    if (space) {
        return {
            type: "move",
            direction: space
        };
    }
};

//**************************************************
//*                     TESTS
//**************************************************
/*
 * IT MOVES!!!!!!
 */
// Initial State of the World
//console.log(world.toString());
/*for (var i = 0; i < 5; i++){
    world.turn();
    console.log(world.toString());
}*/

/** Test world two with wallflowers */
/*var world2 = new World(planWallFlowers, {
    "#": Wall,
    "~": WallFlower,
    "o": BouncingCritter
});
console.log(world2.toString());
for (var i = 0; i < 3; i++) {
    world2.turn();
    console.log(world2.toString());
}*/


/** Test 3 Valley!!! */

var world3 = new LifeLikeWorld(valley, {
    "#": Wall,
    "o": PlantEater,
    "*": Plant
});

var animatedWorld = setInterval(animate, 100);

function animate(){
    var livingCreatures = world3.turn();
    console.log(world3.toString());
    if (livingCreatures === 0){
        clearInterval(animatedWorld);
    }
}