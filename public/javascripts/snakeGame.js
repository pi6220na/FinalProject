//#############################################################
// See below for game founcdation code credit. Many thanks to
// them. The code base has been significantly modified and
// enhanced with new features. The original version can be
// seen at the link below.
//
// A simple "snake" game played on a HTML5 canvas, using HTML,
// CSS, and Javascript. Running on Node with Express, uses
// Mongo Database to save user and game information.
//
// See: https://github.com/pi6220na/FinalProject for code repo
//
// See live version on Heroku at:
// https://rocky-bayou-42087.herokuapp.com/
//
// Jeremy Wolfe, MCTC Web Client Server Dev Final Project
// 12/10/2017
//#############################################################

// note on sockets: https://stackoverflow.com/questions/30550076/socket-io-passing-javascript-object

// major variables:
// mainplayercount===2 two players signed in
// S = snake = green = IamGreen=true
// O = oppoSnake = blue = IamGreen=false
// IamGreen boolean also used to determine which client is the active client

// ------------------------------------------------------------
// Creating A Snake Game Tutorial With HTML5
// Copyright (c) 2015 Rembound.com
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
//
// http://rembound.com/articles/creating-a-snake-game-tutorial-with-html5
// ------------------------------------------------------------

// The function gets called when the window is fully loaded. Commented out to work with sockets.
//window.onload = function() {

    // keep these displays
    // user holds high score
    console.log('inside snakeGame ... user._id = ' + user._id);

    //var d = user.highDate;
    //var n = d.toString();

    if (user.highDate === !null && user.highDate === !undefined) {
        console.log('user high date type of = ' + typeof user.highDate);

        //thisDate.substr(0, 10)
        console.log('substr date string = ' + user.highDate.substr(0, 10));
    }
    console.log('user high date = ' + user.highDate);
    console.log('user high score = ' + user.highScore);
    console.log('user name = ' + user.local.username);

/*
    for (item in user) {
        console.log('snakegame item = ' + item + ' user[item] = ' + user[item]);
    }
    // logs holds the logged in user info
    for (item in logs[0]) {
        console.log('snakegame logs item = ' + item + ' logs[item] = ' + logs[0][item]);
    }
    console.log('logs = ' + JSON.stringify(logs));
*/

    console.log('logs id = ' + logs[0]._id);
    console.log('logs high date = ' + logs[0].highDate);
    console.log('logs high score = ' + logs[0].highScore);
    console.log('logs user name = ' + logs[0].local.username);

// https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");
    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
    var initialized = false;
    // Images
    var imagesG = [];
    var imagesB = [];
    var tileimage;
    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;

    // Load images
    function loadImages(imagefiles) {
        // Initialize variables
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;

        // Load the images
        var loadedimages = [];
        for (var i=0; i<imagefiles.length; i++) {
            // Create the image object
            var image = new Image();

            // Add onload event handler
            image.onload = function () {
                loadcount++;
                if (loadcount === loadtotal) {
                    // Done loading
                    preloaded = true;
                }
            };

            // Set the source url of the image
            image.src = imagefiles[i];

            // Save to the image array
            loadedimages[i] = image;
        }

        // Return an array of images
        return loadedimages;
    }

    // Level properties
    var Level = function (columns, rows, tilewidth, tileheight) {
        this.columns = columns;
        this.rows = rows;
        this.tilewidth = tilewidth;
        this.tileheight = tileheight;

        // Initialize tiles array
        this.tiles = [];
        for (var i=0; i<this.columns; i++) {
            this.tiles[i] = [];
            for (var j=0; j<this.rows; j++) {
                this.tiles[i][j] = 0;
            }
        }
    };

    // Generate a default level with walls
    Level.prototype.generate = function() {
        // add outer edge walls
        for (var i=0; i<this.columns; i++) {
            for (var j=0; j<this.rows; j++) {
                if (i === 0 || i === this.columns-1 ||
                    j === 0 || j === this.rows-1) {
                    // Add walls at the edges of the level
                    this.tiles[i][j] = 1;
                } else {
                    // Add empty space
                    this.tiles[i][j] = 0;
                }
            }
        }

        // add inner wall segments centered outer vertical
        var wall1StartX = 6;
        var wall1StartY = 14;
        var wall1FinishX = 6;
        var wall1FinishY = 23;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall1StartX && i <= wall1FinishX) &&
                    (j >= wall1StartY && j <= wall1FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        var wall2StartX = 42;
        var wall2StartY = 14;
        var wall2FinishX = 42;
        var wall2FinishY = 23;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall2StartX && i <= wall2FinishX) &&
                    (j >= wall2StartY && j <= wall2FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        // left side upper vertical
        var wall3StartX = 12;
        var wall3StartY = 5;
        var wall3FinishX = 12;
        var wall3FinishY = 14;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall3StartX && i <= wall3FinishX) &&
                    (j >= wall3StartY && j <= wall3FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        // right side upper vertical
        var wall4StartX = 36;
        var wall4StartY = 5;
        var wall4FinishX = 36;
        var wall4FinishY = 14;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall4StartX && i <= wall4FinishX) &&
                    (j >= wall4StartY && j <= wall4FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        // upper left horizontal
        var wall5StartX = 12;
        var wall5StartY = 5;
        var wall5FinishX = 20;
        var wall5FinishY = 5;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall5StartX && i <= wall5FinishX) &&
                    (j >= wall5StartY && j <= wall5FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        // upper right horizontal
        var wall6StartX = 28;
        var wall6StartY = 5;
        var wall6FinishX = 36;
        var wall6FinishY = 5;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall6StartX && i <= wall6FinishX) &&
                    (j >= wall6StartY && j <= wall6FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }


        // left side lower vertical
        var wall7StartX = 12;
        var wall7StartY = 22;
        var wall7FinishX = 12;
        var wall7FinishY = 31;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall7StartX && i <= wall7FinishX) &&
                    (j >= wall7StartY && j <= wall7FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        // right side lower vertical
        var wall8StartX = 36;
        var wall8StartY = 22;
        var wall8FinishX = 36;
        var wall8FinishY = 31;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall8StartX && i <= wall8FinishX) &&
                    (j >= wall8StartY && j <= wall8FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        // lower left horizontal
        var wall9StartX = 12;
        var wall9StartY = 31;
        var wall9FinishX = 20;      // 22
        var wall9FinishY = 31;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall9StartX && i <= wall9FinishX) &&
                    (j >= wall9StartY && j <= wall9FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }
        // lower right horizontal
        var wall10StartX = 28;     // 26
        var wall10StartY = 31;
        var wall10FinishX = 35;
        var wall10FinishY = 31;
        for (i=0; i<this.columns; i++) {
            for (j=0; j<this.rows; j++) {
                if ((i >= wall10StartX && i <= wall10FinishX) &&
                    (j >= wall10StartY && j <= wall10FinishY)) {
                    // Add wall at the these coordinates
                    this.tiles[i][j] = 1;
                }
            }
        }


    };

    // Snake prototype definitions
    var Snake = function() {
        this.init(0, 0, 0, 1, 5, 1);  // 5 was 10
    };

    // Direction table: Up, Right, Down, Left
    Snake.prototype.directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    // Initialize the snake at a location
    Snake.prototype.init = function(id, x, y, direction, speed, numsegments) {
        this.id = id;                      // sockets id
        this.x = x;
        this.y = y;
        this.direction = direction; // Up, Right, Down, Left
        this.speed = speed;         // Movement speed in blocks per second
        this.movedelay = 0;

        // Reset the segments and add new ones
        this.segments = [];
        this.growsegments = 0;
        for (var i=0; i<numsegments; i++) {
            this.segments.push({x:this.x - i*this.directions[direction][0],
                y:this.y - i*this.directions[direction][1]});
        }
    };

    // Increase the segment count
    Snake.prototype.grow = function() {
        this.growsegments++;
    };

    // Check we are allowed to move
    Snake.prototype.tryMove = function(dt) {
        this.movedelay += dt;
        var maxmovedelay = 1 / this.speed;
        if (this.movedelay > maxmovedelay) {
            return true;
        }
        return false;
    };

    // Get the position of the next move
    Snake.prototype.nextMove = function() {
        var nextx = this.x + this.directions[this.direction][0];
        var nexty = this.y + this.directions[this.direction][1];
        return {x:nextx, y:nexty};
    };

    // Move the snake in the direction
    Snake.prototype.move = function() {
        // Get the next move and modify the position
        var nextmove = this.nextMove();
        this.x = nextmove.x;
        this.y = nextmove.y;

        // Get the position of the last segment
        var lastseg = this.segments[this.segments.length-1];
        var growx = lastseg.x;
        var growy = lastseg.y;

        // Move segments to the position of the previous segment
        for (var i=this.segments.length-1; i>=1; i--) {
            this.segments[i].x = this.segments[i-1].x;
            this.segments[i].y = this.segments[i-1].y;
        }

        // Grow a segment if needed
        if (this.growsegments > 0) {
            this.segments.push({x:growx, y:growy});
            this.growsegments--;
        }

        // Move the first segment
        this.segments[0].x = this.x;
        this.segments[0].y = this.y;

        // Reset movedelay
        this.movedelay = 0;
    };

    // Create objects
    var snake = new Snake();
    var oppoSnake = new Snake();

    //Object.assign(snake, model);  // make a copy to switch back and forth between model and opponent

    console.log('in init - -------------  snake = ' + JSON.stringify(snake));
    console.log('in init - -------------  oppoSnake = ' + JSON.stringify(oppoSnake));
    // var level = new Level(20, 15, 32, 32);  //original
    var level = new Level(48, 36, 16, 16);   // (columns, rows, tilewidth, tileheight)
    //var level = new Level(96, 72, 8, 8);   // (columns, rows, tilewidth, tileheight) //super small grid


    // Variables
    var score = 0;              //
    var newHighScore = 0;       // new high score within this game, will replace db HighScore on server if higher
    var gameoverS = true;        // Game is over === set to true to stop snake from moving when initialized
    var gameoverO = true;        // Game is over === set to true to stop oppoSnake from moving when initialized
    var roundover = true;      // when player collides with something, the round is over
    var roundOverTime = 1;       // How long we have been game over
    var gameoverdelay = 0.25;    // Waiting time after game over, was 0.5
    var maxlives = 5;        // max number of lives
    var livesLeft = maxlives;  // number of lives
    var gameLevel = 1;         // number of levels to play, advances after completing
    var sSpeed = 10;           // initial speed, bumped to 15 for level 2
    var openValue = 0;          // snake contained in snake object, collision detection done on that object
    var wallValue = 1;          // grid values in 2 dimension array used for collision detection
    var gAppleValue = 2;
    var bAppleValue = 3;
    var orangeValue = 4;             // hitting fruit other than apple matching snake color same as hitting wall
    var lemonValue = 5;
    var strawberryValue = 6;
    var pearValue = 7;
    var playerIDs = {};          // player id's of this client and opponent
    var runLoop;                 // animation variable used to turn on/off animation loop
    var mainPlayerCount;           // set in gameSocket.js 1 = first player = green snake, 2 = second = blue
    var IamGreen = false;        // main identifier of snake type - green:snake or blue:oppoSnake
                                 // if IamGreen is true, then "this" client browser has the green snake
    var saveSnakeID;
    var saveoppoSnakeID;
    var passSnake = new Snake();    // passed from other client, used for painting the other snake in client window
    var passOppoSnake = new Snake(); // ditto
    var oppoSnakeSegments = [];       // passed from opposing client, used to check for snake/snake collision
    var snakeSegments = [];             // ditto
    var snakesDied = false;         // indicates a collision between snakes, game over for both players

    // Initialize the game
    function init() {
        // Load images
        imagesG = loadImages(["./images/snake-green fruits.png"]);
        imagesB = loadImages(["./images/snake-blue.png"]);
        /*
        // Add mouse events
        canvas.addEventListener("mousedown", onMouseDown);
        */

        // Add keyboard events
        document.addEventListener("keydown", onKeyDown);

        // New game
        newGame();
        roundover = false;   //was true

        // Enter main loop
        main(0);
    }

    // called from gameSocket.js when first player logs into game
    function setColorValue(countPlayers) {
        if (countPlayers === 1) {
            IamGreen = true;
            console.log('setColorValue setting IamGreen to true');
        }
        mainPlayerCount = countPlayers;
        console.log('mainPlayerCount and countPlayers (from sockets:) = ' + mainPlayerCount);
        if (IamGreen) {
            $('.numbers').css('color', 'green');
        } else {
            $('.numbers').css('color', 'blue');
        }
    }

    // Check if we can start a new game
    function tryNewGame() {

        console.log('**************** TRY NEW GAME ********************')

        if ( (roundOverTime > gameoverdelay) &&
             ((!gameoverS && IamGreen) || (!gameoverO && !IamGreen))  ) {
            $('#lives').html(livesLeft);
     //       $('#highestscore').html(newHighScore);
            if (gameLevel < 2 && newHighScore > 9 && roundover) { // advance to level 2 only if highest this round score at least 10
                gameLevel = 2;
                sSpeed = 15;
                score = 0;
            } else {
                //gameLevel = 1;
                //sSpeed = 10;
                score = 0;
            }

            newGame();
            roundover = false;

            $('#scorethis').html("000");
            $('#gameLevel').html(gameLevel);
            $('#speed').html(sSpeed);


            if (user.highDate === null || user.highDate === undefined) {
                user.highDate = new Date().toDateString();
            }
            if (logs[0].highDate === null || logs[0].highDate === undefined) {
                logs[0].highDate = new Date().toDateString();
            }


            $('#highestscore').html(user.highScore);
            $('#hDate').html(user.highDate.substr(0, 10));
            $('#hUser').html(user.local.username);

            $('#highestuserscore').html(logs[0].highScore);
            $('#hdate').html(logs[0].highDate.substr(0, 10));
            $('#huser').html(logs[0].local.username);
            $('#huser1').html(logs[0].local.username);

            // Request animation frames
            // runLoop = window.requestAnimationFrame(main);     // this get executed over and over
        }
    }

    // called from gameSocket.js - passes in opposition snake object to be moved
    function setOppoSnake(snk) {

        if (IamGreen) {
            snake = snk;
            console.log('&&&&&&&&&&&&    setSnake = ' + JSON.stringify(snake) + '    &&&&&&&&&&&&&&&&&&&&');
        }
        if (!IamGreen) {
            oppoSnake = snk;
            console.log('&&&&&&&&&&&&    setOppoSnake = ' + JSON.stringify(oppoSnake) + '    &&&&&&&&&&&&&&&&&&&&');
        }
    }

    function newGame() {
        console.log('NNNNNNNNNNNNNNNNNNNNNNN   new game  NNNNNNNNNNNNNNNNNNNNNNN');
         // Generate the default level
        level.generate();

        // Add an apple
        addApple();

        // Initialize the score
        score = 0;

        // Initialize variables
        //gameoverS = true;       // needed here?
        //gameoverO = true;

        $('#scorethis').html("000");
        $('#lives').html(livesLeft);  // setup new game with total number of lives available
        $('#gameLevel').html(gameLevel);


        if (user.highDate === null || user.highDate === undefined) {
            user.highDate = new Date().toDateString();
        }
        if (logs[0].highDate === null || logs[0].highDate === undefined) {
            logs[0].highDate = new Date().toDateString();
        }


        $('#highestscore').html(user.highScore);
        $('#hDate').html(user.highDate.substr(0, 10));
        $('#hUser').html(user.local.username);

        $('#highestuserscore').html(logs[0].highScore);
        $('#hdate').html(logs[0].highDate.substr(0, 10));
        $('#huser').html(logs[0].local.username);
        $('#huser1').html(logs[0].local.username);

        console.log('');
        console.log('%%%%%%%%%%%%%%% in newGame %%%%%%%%%%%%%%%');
        console.log('%%%%%%%%%%%%%% roundover = ' + roundover + '   %%%%%%%%%%%%%');
        console.log('');

        // reset snakes to home position if starting a new round/game
        if (roundover) {
            snake.init(saveSnakeID, 5, 10, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
            oppoSnake.init(saveoppoSnakeID, 5, 2, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
        } else {
            if (IamGreen) {
                snake.init(saveSnakeID, 5, 10, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
                getOppoSegments();
                drawSnakeB();
                console.log('');
                console.log('%%%%%%%%%%%%% IamGreen drawing blue snake %%%%%%%%%%%%');
                console.log('');
            }
            if (!IamGreen) {
                oppoSnake.init(saveoppoSnakeID, 5, 2, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
                getSnakeSegments();
                drawSnakeG();
                console.log('');
                console.log('%%%%%%%%%%%%% !IamGreen drawing green snake %%%%%%%%%%%%');
                console.log('');
            }
        }
        /*
        snake.init(saveSnakeID, 5, 10, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
        oppoSnake.init(saveoppoSnakeID, 5, 2, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
        */

        addFruits();
        roundover = false;

    }

    // Add an apple to the level at an empty position
    function addApple() {
        // Loop until we have a valid apple for each snake type, green or blue

        if (IamGreen) {
            var valid = false;
            while (!valid) {
                // Get a random position
                var ax = randRange(0, level.columns - 1);
                var ay = randRange(0, level.rows - 1);

                // Make sure the snake doesn't overlap the new apple
                var overlap = false;
                for (var i = 0; i < snake.segments.length; i++) {
                    // Get the position of the current snake segment
                    var sx = snake.segments[i].x;
                    var sy = snake.segments[i].y;

                    // Check overlap
                    if (ax === sx && ay === sy) {
                        overlap = true;
                        break;
                    }
                }

                // Tile must be empty
                if (!overlap && level.tiles[ax][ay] === openValue) {
                    // Add an apple at the tile position
                    level.tiles[ax][ay] = gAppleValue;
                    valid = true;
                }
            }
        }

        //   figure out how to add second apple for opponent

        if (!IamGreen) {
            valid = false;
            while (!valid) {
                // Get a random position
                ax = randRange(0, level.columns - 1);
                ay = randRange(0, level.rows - 1);

                // Make sure the snake doesn't overlap the new apple
                overlap = false;
                for (i = 0; i < oppoSnake.segments.length; i++) {
                    // Get the position of the current snake segment
                    sx = oppoSnake.segments[i].x;
                    sy = oppoSnake.segments[i].y;

                    // Check overlap
                    if (ax === sx && ay === sy) {
                        overlap = true;
                        break;
                    }
                }

                // Tile must be empty
                if (!overlap && level.tiles[ax][ay] === openValue) {
                    // Add an apple at the tile position
                    level.tiles[ax][ay] = bAppleValue;
                    valid = true;
                }
            }
        }
    }

    function addFruits() {

        if (IamGreen) {

            for (var j = 4; j < 8; j++) {
                var valid = false;
                while (!valid) {
                    // Get a random position
                    var ax = randRange(0, level.columns - 1);
                    var ay = randRange(0, level.rows - 1);

                    // Make sure the snake doesn't overlap the new apple
                    var overlap = false;
                    for (var i = 0; i < snake.segments.length; i++) {
                        // Get the position of the current snake segment
                        var sx = snake.segments[i].x;
                        var sy = snake.segments[i].y;

                        // Check overlap
                        if (ax === sx && ay === sy) {
                            overlap = true;
                            break;
                        }
                    }

                    // Tile must be empty
                    if (!overlap && level.tiles[ax][ay] === openValue) {
                        // Add an apple at the tile position
                        level.tiles[ax][ay] = j; // add four other fruit to grid
                        valid = true;
                    }
                }
            }

        }

        if (!IamGreen) {

            for (var j = 4; j < 8; j++) {
                var valid = false;
                while (!valid) {
                    // Get a random position
                    var ax = randRange(0, level.columns - 1);
                    var ay = randRange(0, level.rows - 1);

                    // Make sure the snake doesn't overlap the new apple
                    var overlap = false;
                    for (var i = 0; i < oppoSnake.segments.length; i++) {
                        // Get the position of the current snake segment
                        var sx = oppoSnake.segments[i].x;
                        var sy = oppoSnake.segments[i].y;

                        // Check overlap
                        if (ax === sx && ay === sy) {
                            overlap = true;
                            break;
                        }
                    }

                    // Tile must be empty
                    if (!overlap && level.tiles[ax][ay] === openValue) {
                        // Add an apple at the tile position
                        level.tiles[ax][ay] = j; // add four other fruit to grid
                        valid = true;
                    }
                }
            }
        }

    }


    // Main loop
    function main(tframe) {
        // Request animation frames
        runLoop = window.requestAnimationFrame(main);     // this get executed over and over a bazillion times/second

        if (!initialized) {
            // Preloader

            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw a progress bar
            var loadpercentage = loadcount/loadtotal;
            context.strokeStyle = "#ff8080";
            context.lineWidth=3;
            context.strokeRect(18.5, 0.5 + canvas.height - 51, canvas.width-37, 32);
            context.fillStyle = "#ff8080";
            context.fillRect(18.5, 0.5 + canvas.height - 51, loadpercentage*(canvas.width-37), 32);

            // Draw the progress text
            var loadtext = "Loaded " + loadcount + "/" + loadtotal + " images";
            context.fillStyle = "#000000";
            context.font = "16px Verdana";
            context.fillText(loadtext, 18, 0.5 + canvas.height - 63);

            if (preloaded) {
                initialized = true;
            }

        } else {

            // Update and render the game
            update(tframe);
            render();
        }
    }

    // Update the game state
    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;

        // Update the fps counter
        updateFps(dt);

        if (!gameoverS || !gameoverO) {
            updateGame(dt);
        } else {
            roundOverTime += dt;
        }
    }

    function setModelID(id) {         // called from gameSockets.js when new client instantiated
        console.log('==========================  setModelID = ' + JSON.stringify(id) + ' ========================');

        if (mainPlayerCount === 1) {
            saveSnakeID = id;
            snake.id = id;
            snake.init(snake.id, 5, 10, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
            console.log('setModelID: (id saved)snake = ' + JSON.stringify(snake));
        }
        if (mainPlayerCount === 2) {
            saveoppoSnakeID = id;
            oppoSnake.id = id;
            oppoSnake.init(oppoSnake.id, 5, 2, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
            console.log('setModelID: (id saved)oppoSnake = ' + JSON.stringify(oppoSnake));
        }
    }


    function updateGame(dt) {

        /*
        console.log('oooooooooooo    player count = ' + mainPlayerCount + ' ooooooooooooooooo');
        console.log('oooooooooooo    IamGreen = ' + IamGreen + ' oooooooooooooooo');
        console.log('oooooooooooo    gameOverS = ' + gameoverS + ' oooooooooooooooo');
        console.log('oooooooooooo    gameOverO = ' + gameoverO + ' oooooooooooooooo');
        console.log('oooooooooooo    updateGame snake = ' + JSON.stringify(snake));
        console.log('oooooooooooo    updateGame oppoSnake = ' + JSON.stringify(oppoSnake));
        */

        if (mainPlayerCount === 2) {
            if (!gameoverS && IamGreen) {
                updateGameS(dt);
            }
            if (!gameoverO && !IamGreen) {
                updateGameO(dt);
            }
        } else {
            updateGameS(dt);
        }

    }

    function updateGameS(dt) {       // green snake, client

    //alternate player snake with opponent snake for the following functions

        console.log('');
        console.log('updateGameS snake = ' + JSON.stringify(snake));
        //for (item in snake) {
        //    console.log('item = ' + item + ' snake[item] = ' +snake[item]);
       // }
        console.log('');

        // Move the snake
        if (snake.tryMove(dt)) {

            // Get the coordinates of the next move
            var nextmove = snake.nextMove();
            var nx = nextmove.x;
            var ny = nextmove.y;

            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {  // outer walls
                if (level.tiles[nx][ny] === wallValue ||
                    level.tiles[nx][ny] === orangeValue ||
                    level.tiles[nx][ny] === lemonValue ||
                    level.tiles[nx][ny] === strawberryValue ||
                    level.tiles[nx][ny] === pearValue) {
                    // Collision with a wall or other fruit
                    gameoverS = true;
                    snakeCollideWall(snake.id);
                    //clearFruits();
                }

                // sockets add call to server to notify players of collision

                // Collisions with the snake itself
                if (!gameoverS) {
                    for (var i = 0; i < snake.segments.length; i++) {
                        var sx = snake.segments[i].x;
                        var sy = snake.segments[i].y;

                        if (nx === sx && ny === sy) {
                            // Found a snake part
                            gameoverS = true;
                            snakeCollideSelf(snake.id);  // sockets call
                            break;
                        }
                    }
                }

                if (!gameoverS) {
                    if (mainPlayerCount > 1) {
                        console.log('snakeGame: calling getOppoSegments() from updateGameS');
                        getOppoSegments();

                        // Collisions with oppo snake
                        console.log('snakeGame: oppoSnakeSeqments = ' + oppoSnakeSegments);
                        console.log('snakeGame: oppoSnakeSeqments.length = ' + oppoSnakeSegments.length);
                        for (var i = 0; i < oppoSnakeSegments.length; i++) {
                            var sx = oppoSnakeSegments[i].x;
                            var sy = oppoSnakeSegments[i].y;

                            if (nx === sx && ny === sy) {
                                // Found a snake part
                                gameoverS = true;
                                snakesDied = true;
                                snakeCollideOppo();  // sockets call
                                sendSnakesDiedMessage();
                                break;
                            } else {
                                snakesDied = false;
                            }
                        }
                    }
                }

                if (!gameoverS) {
                    // The snake is allowed to move

                    //new location to before snake.move();  this fixes off by one position error
                    sendSnakeInPlay(snake);

                    // Move the snake
                    snake.move();

                    // Check collision with an apple
                    if (level.tiles[nx][ny] === gAppleValue) {
                        // Remove the apple
                        level.tiles[nx][ny] = 0;
                        //clearFruits();

                        // Add a new apple
                        addApple();
                        snakeEatApple(snake.id);          // sockets call

                        // Grow the snake
                        snake.grow();

                        // Add a point to the score
                        score++;
                        if (score > newHighScore) {    // set new, to this game, high score todo fix for db highscore
                            newHighScore = score;
                            updateDatabase(newHighScore);

                        }

                        // add leading zeroes to score
                        var scoreString;
                        scoreString = score.toString();
                        var s = "";
                        for (i = 0; i < scoreString.length; i++) {
                            while (s.length <= scoreString.length) {s = "0" + s}


                        }
                        scoreString = s + score;
                        console.log('scoreString = ' + scoreString + ' s = ' + s + ' score ' + score);
                        $('#scorethis').html(scoreString);

                    }

/*
                    console.log('((((((((( ________________________ ))))))))))))))))');
                    console.log('         sendPosition snake = ' + JSON.stringify(snake));
                    console.log('((((((((( ________________________ ))))))))))))))))');
                    // Sockets send player's new position to the server.
                    sendPosition(snake);
*/
                    // was here sendSnakeInPlay(snake);

                }
            } else {
                // Out of bounds
                gameoverS = true;

            }

            if (gameoverS) {
                roundOverTime = 0;

                if (livesLeft > 0) {
                    livesLeft -= 1;
                    console.log('woah lives going down by 1');
                }

                $('#lives').html(livesLeft);
                if (score > newHighScore) {
                    newHighScore = score;
                    updateDatabase(newHighScore);
                }

                if (snakesDied) {
                    setSnakesDiedMessage();
                }
                // window.cancelAnimationFrame(runLoop);
            }
        }
    }


    function updateGameO(dt) {           // blue snake, opponent

        //alternate player snake with opponent snake for the following functions
        console.log('');
        console.log('updateGameO oppoSnake = ' + JSON.stringify(oppoSnake));
        console.log('');

        // Move the snake
        if (oppoSnake.tryMove(dt)) {

            // Get the coordinates of the next move
            var nextmove = oppoSnake.nextMove();
            var nx = nextmove.x;
            var ny = nextmove.y;

            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {  // outer walls
                if (level.tiles[nx][ny] === wallValue ||
                    level.tiles[nx][ny] === orangeValue ||
                    level.tiles[nx][ny] === lemonValue ||
                    level.tiles[nx][ny] === strawberryValue ||
                    level.tiles[nx][ny] === pearValue) {
                    // Collision with a wall or other fruit
                    gameoverO = true;
                    snakeCollideWall(snake.id);
                    //clearFruits();
                }

                // sockets add call to server to notify players of collision

                // Collisions with the snake itself
                if (!gameoverO) {
                    for (var i = 0; i < oppoSnake.segments.length; i++) {
                        var sx = oppoSnake.segments[i].x;
                        var sy = oppoSnake.segments[i].y;

                        if (nx === sx && ny === sy) {
                            // Found a snake part
                            gameoverO = true;
                            oppoSnakeCollideSelf(oppoSnake.id);  // sockets call
                            break;
                        }
                    }
                }

                if (!gameoverO) {
                    if (mainPlayerCount > 1) {
                        console.log('snakeGame: calling getSnakeSegments() from updateGameO');
                        getSnakeSegments();

                        // Collisions with snake
                        console.log('snakeGame: snakeSeqments = ' + snakeSegments);
                        console.log('snakeGame: snakeSeqments.length = ' + snakeSegments.length);
                        for (var i = 0; i < snakeSegments.length; i++) {
                            var sx = snakeSegments[i].x;
                            var sy = snakeSegments[i].y;

                            if (nx === sx && ny === sy) {
                                // Found a snake part
                                gameoverO = true;
                                snakesDied = true;
                                snakeCollideSnake();  // sockets call
                                sendSnakesDiedMessage();
                                break;
                            } else {
                                snakesDied = false;
                            }
                        }
                    }
                }

                if (!gameoverO) {
                    // The snake is allowed to move

                    // new location before oppoSnake.move();  this fixes off by one position error
                    sendOppoSnakeInPlay(oppoSnake);

                    // Move the snake
                    oppoSnake.move();

                    // Check collision with an apple
                    if (level.tiles[nx][ny] === bAppleValue) {
                        // Remove the apple
                        level.tiles[nx][ny] = 0;
                        //clearFruits();

                        // Add a new apple
                        addApple();
                        oppoSnakeEatApple(oppoSnake.id);          // sockets call

                        // Grow the snake
                        oppoSnake.grow();

                        // Add a point to the score
                        score++;
                        if (score > newHighScore) {    // set new, to this game, high score todo fix for db highscore
                            newHighScore = score;
                            updateDatabase(newHighScore);

                        }

                        // add leading zeroes to score
                        var scoreString;
                        scoreString = score.toString();
                        var s = "";
                        for (i = 0; i < scoreString.length; i++) {
                            while (s.length <= scoreString.length) {s = "0" + s}


                        }
                        scoreString = s + score;
                        console.log('scoreString = ' + scoreString + ' s = ' + s + ' score ' + score);
                        $('#scorethis').html(scoreString);

                    }

/*
                    console.log('((((((((( ________________________ ))))))))))))))))');
                    console.log('         sendPosition oppoSnake = ' + JSON.stringify(oppoSnake));
                    console.log('((((((((( ________________________ ))))))))))))))))');
                    // Sockets send player's new position to the server.
                    sendPosition(oppoSnake);
*/
                    // was here sendOppoSnakeInPlay(oppoSnake);

                }
            } else {
                // Out of bounds
                gameoverO = true;

            }

            if (gameoverO) {
                roundOverTime = 0;

                if (livesLeft > 0) {
                    livesLeft -= 1;
                    console.log('woah lives going down by 1');
                }

                $('#lives').html(livesLeft);
                if (score > newHighScore) {
                    newHighScore = score;
                    updateDatabase(newHighScore);
                }


                if (snakesDied) {
                    setSnakesDiedMessage();
                }

                // window.cancelAnimationFrame(runLoop);
            }
        }
    }

    function clearFruits() {
        for (var i = 0; i < level.columns; i++) {
            for (var j = 0; j < level.rows; j++) {
                // Get the current tile and location
                var tile = level.tiles[i][j];              // level.tiles is the grid everything is placed on

                if (tile === orangeValue || tile === lemonValue ||
                    tile === strawberryValue || tile === pearValue) {

                    level.tiles[i][j] = 0;
                }
            }
        }
    }


    function message(msg) {
        console.log('over the limit for players, msg = ' + msg);
    }


// snake collision detection functions
    function SendOppoSegments() {
        console.log('snakeGame: SendOppoSegments() triggered');
        socket.emit('oppoSegments', oppoSnake.segments);
    }

    function returnOppoSegments(oppoSnakesegments) {
        console.log('snakeGame: returnOppoSegments oppoSnakesegments = ' + oppoSnakesegments + ' length = ' + oppoSnakesegments.length);
        oppoSnakeSegments = oppoSnakesegments;
    }

    function SendSnakeSegments() {
        console.log('snakeGame: SendSnakeSegments() triggered');
        socket.emit('snakeSegments', snake.segments);
    }

    function returnSnakeSegments(snakesegments) {
        console.log('snakeGame: returnSnakeSegments snakeSegments = ' + snakeSegments + ' length = ' + snakeSegments.length);
        snakeSegments = snakesegments;
    }



// send messages to server

    function snakeCollideWall(id) {
        console.log('snake collided with wall');
        socket.emit('snakeCollideWall', id);
    }

    function snakeCollideSelf(id) {
        console.log('snake collided with self');
        socket.emit('snakeCollideSelf', id);
    }

    function snakeEatApple(id) {
        console.log('snake ate apple');
        socket.emit('snakeAteApple', id);
    }


    function oppoSnakeCollideWall(id) {
        console.log('oppoSnake collided with wall');
        socket.emit('oppoSnakeCollideWall', id);
    }

    function oppoSnakeCollideSelf(id) {
        console.log('oppoSnake collided with self');
        socket.emit('oppoSnakeCollideSelf', id);
    }

    function oppoSnakeEatApple(id) {
        console.log('oppoSnake ate apple');
        socket.emit('oppoSnakeAteApple', id);
    }


    // called from opposition client to move this snake
    function snakeInPlay(snakeIn) {
        // have to recreate snake to pick up prototype methods that get dropped by sockets.io
        console.log('entering snakeInPlay snakeIn = ' + JSON.stringify(snakeIn));

        passSnake = new Snake();

        passSnake.id = snakeIn.id;
        passSnake.x = snakeIn.x;
        passSnake.y = snakeIn.y;
        passSnake.direction = snakeIn.direction;
        passSnake.speed = snakeIn.speed;
        passSnake.movedelay = snakeIn.movedelay;
        passSnake.segments = snakeIn.segments.slice(0);
        //for (item in passSnake) {
        //    console.log('item = ' + item + ' passSnake[item] = ' + passSnake[item]);
        //}

        //var snake = Object.assign( {}, passSnake);
        snake = passSnake;
        snake.move();

    }

    // called from opposition client to move this oppoSnake
    function oppoSnakeInPlay(snakeIn) {
        // have to recreate snake to pick up prototype methods that get dropped by sockets.io
        console.log('entering oppoSnakeInPlay snakeIn = ' + JSON.stringify(snakeIn));
        passOppoSnake = new Snake();
        passOppoSnake.id = snakeIn.id;
        passOppoSnake.x = snakeIn.x;
        passOppoSnake.y = snakeIn.y;
        passOppoSnake.direction = snakeIn.direction;
        passOppoSnake.speed = snakeIn.speed;
        passOppoSnake.movedelay = snakeIn.movedelay;
        passOppoSnake.segments = snakeIn.segments.slice(0);
        //for (item in passOppoSnake) {
        //    console.log('item = ' + item + ' passOppoSnake[item] = ' + passOppoSnake[item]);
        //}

        //var oppoSnake = Object.assign({}, passOppoSnake);
        oppoSnake = passOppoSnake;
        oppoSnake.move();

    }


// messages from server
    function setSnakeGameOver() {
        gameoverS = true;
    }

    function setOppoSnakeGameOver() {
        gameoverO = true;

    }

    // slows down speed of snake? Both fpstime and framecount are not used... ? must be for future release original code ?
    function updateFps(dt) {
        if (fpstime > 1.75) {   // was 0.25
            // Calculate fps
            fps = Math.round(framecount / fpstime);

            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }

        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }

    // Render the game
    function render() {
        // Draw background
        context.fillStyle = "#577ddb";
        context.fillRect(0, 0, canvas.width, canvas.height); //context.clearRect(0, 0, canvas.width, canvas.height);

        drawLevel();
        drawSnake();

        // Game over
        if ( (gameoverS && IamGreen) || (gameoverO && !IamGreen || snakesDied) ) {
            //context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, canvas.width, canvas.height);

            if (livesLeft > 0) {
                context.fillStyle = "#ffffff";
                context.font = "24px Creepster";
                context.textAlign = 'center';
                //drawCenterText("Press spacebar to play again!", 0, canvas.height / 2, canvas.width);
                context.fillText("Press spacebar for next Snake!", canvas.width / 2, canvas.height / 2);
            } else {
                context.fillStyle = "#ff0000";
                context.font = "24px Creepster";
                context.textAlign = 'center';
                //drawCenterText("Press g or G to start a new game", 0, canvas.height / 2 + 5, canvas.width);
                context.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
                context.fillText("Press g to start a new game", canvas.width / 2 , canvas.height / 2 + 25);

                roundover = true;

                // a facinating look at values and functions contained within an object defined with prototypes
               // for (item in snake) {
               //    console.log('item = ' + item + ' snake[item] = ' + snake[item]);
               // }


            }
            if (snakesDied) {
                drawLevel();
                drawSnake();
                setSnakesDiedMessage();
            }
        }
    }

    function setSnakesDiedMessage() {

        // reset these to true if this is the opposing player
        if (IamGreen) {
            gameoverO = true;
        } else {
            gameoverS = true;
        }
        snakesDied = true;

        // console.log('snakeGame:    setSnakesDiedMessage() ');
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#ff0000";
        context.font = "24px Creepster";
        context.textAlign = 'center';
        context.fillText("!!!!!!   BOTH SNAKES DIED   !!!!!!!", canvas.width / 2, canvas.height / 2);
        if (livesLeft > 0) {
            context.fillText("Press spacebar for next Snake!", canvas.width / 2, canvas.height / 2 + 25);
        } else {
            context.fillText("Press g to start a new game", canvas.width / 2, canvas.height / 2 + 25);
        }

    }


    function updateDatabase (HighScore) {
        //console.log('in updateDatabase logs._id = ' + logs[0]._id);
        //console.log('in updateDatabase user.local = ' + user.local);
        //console.log(' in updateDatabase highScore = ' + HighScore);

        // this first ajax method updates the database with the new high score for the player
        $.ajax({
            method: "POST",
            url: "/update",
            //data: { _id: logs[0]._id, highScore: HighScore, highDate: Date.now() }
            data: { _id: logs[0]._id, highScore: HighScore, highDate: new Date() },
        }).done (function(msg) {
            console.log('ajax success');

            //console.log('ajax success' + msg);
            //for (item in data) {
            //    console.log('snakegame item = ' + item + ' data[item] = ' + data[item]);
           // }

            // ajax method embedded within successful completion of first ajax update call to database
            // because we need to wait until the database has a chance to update before proceeding to next
            // database operation. This is a prime example of the useage of callback logic structure.

            console.log('about to call /reload, username = ' + logs[0].local.username);
            $.ajax({
                method: "POST",
                url: "/reload",
                data: { username: logs[0].local.username }
            }).done (function(msg) {

                // all these variable manipulations done here within the ajax method to do the asynchronous delay
                // in response back from the database. javascript will zoom ahead of the db returning data thus
                // making the html updates meaningless. putting the html updates here forces the code to update within
                // the callback.
                console.log('ajax second success');
                //console.log('ajax second success' + msg);
                //for (item in msg) {
                //    console.log('snakegame msg = ' + item + ' msg[item] = ' + msg[item]);
                //}
                passed_user = JSON.parse(msg.user);
                passed_logs = JSON.parse(msg.logs);  // logs is returned as an object within an array
                var rv = {};
                for (var i = 0; i < passed_logs.length; ++i) {
                    rv[i] = passed_logs[i];
                }

                /*
                console.log('');
                console.log('passed_user = ' + JSON.stringify(passed_user));
                console.log('passed_logs = ' + JSON.stringify(passed_logs));
                */

                user.highScore = passed_user.highScore;
                user.highDate = passed_user.highDate;
                user.local.username = passed_user.local.username;
                logs[0].highScore = passed_logs[0].highScore;
                logs[0].highDate = passed_logs[0].highDate;
                logs[0].local.username = passed_logs[0].local.username;

                /*
                console.log('')
                console.log('passed_logs.highScore = ' + logs[0].highScore);
                console.log('passed_logs.highDate = ' + logs[0].highDate);
                console.log('');
                console.log('user.highScore = ' + user.highScore);
                console.log('user.highDate = ' + user.highDate);
                console.log('logs[0].highScore = ' + logs[0].highScore);
                console.log('logs[0].highDate = ' + logs[0].highDate);
                */

                if (user.highDate === null || user.highDate === undefined) {
                    user.highDate = new Date().toDateString();
                }
                if (logs[0].highDate === null || logs[0].highDate === undefined) {
                    logs[0].highDate = new Date().toDateString();
                }

                $('#highestscore').html(user.highScore);
                $('#hDate').html(user.highDate.substr(0, 10));
                $('#hUser').html(user.local.username);

                $('#highestuserscore').html(logs[0].highScore);
                $('#hdate').html(logs[0].highDate.substr(0, 10));
                $('#huser').html(logs[0].local.username);
                $('#huser1').html(logs[0].local.username);

            }).fail(function (xhr,status,error) {
                console.log("ajax Second Post error:");
                console.log('xhr = ' + JSON.stringify(xhr));
                console.log('status = ' + status);
                console.log('error = ' + error);
            });

        }).fail(function (xhr,status,error) {
           console.log("ajax Post error:");
           console.log('xhr = ' + JSON.stringify(xhr));
           console.log('status = ' + status);
           console.log('error = ' + error);
        });

        var passed_user = {};
        var passed_logs = {};

        // this ajax method gets the new highest score on the database as well as the player's highest score


        console.log('leaving updateDatabase');
    }


    // Draw the level tiles and Fruits
    function drawLevel() {

        if (mainPlayerCount === 2) {
            if (IamGreen) {
                tileimage = imagesG[0];
                drawLevelItems();
            } else {
                tileimage = imagesB[0];
                drawLevelItems();
            }
        } else {
            tileimage = imagesG[0];
            drawLevelItems();
        }
        tileimage = imagesG[0];
        drawLevelFruits();
    }

    function drawLevelItems() {

        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                // Get the current tile and location
                var tile = level.tiles[i][j];              // level.tiles is the grid everything is placed on
                var tilex = i*level.tilewidth;
                var tiley = j*level.tileheight;

                // Draw tiles based on their type
                if (tile === openValue) {
                    // Empty space
                    //context.fillStyle = "#f7e697";
                    //context.fillStyle = "#000000";
                    context.fillStyle = "#060B3A";
                    context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
                } else if (tile === wallValue) {
                    // Wall
                    //context.fillStyle = "#bcae76";
                    //context.fillStyle = "#000000";
                    context.fillStyle = "#060B3A";
                    context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
                    var tx = 0;
                    var ty = 2;
                    var tilew = 64;
                    var tileh = 64;
                    //context.drawImage(wallimage, tx*tilew, ty*tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                    context.drawImage(tileimage,tx*tilew, ty*tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                } else if (tile === gAppleValue || tile === bAppleValue) {
                    // Apple

                    // Draw apple background
                    //context.fillStyle = "#f7e697";
                    //context.fillStyle = "#000000";
                    context.fillStyle = "#060B3A";
                    context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);

                    // Draw the apple image
                    tx = 0;
                    ty = 3;
                    tilew = 64;
                    tileh = 64;
                    context.drawImage(tileimage, tx*tilew, ty*tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                }
            }
        }
    }

    function drawLevelFruits() {

        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                // Get the current tile and location
                var tile = level.tiles[i][j];              // level.tiles is the grid everything is placed on
                var tilex = i*level.tilewidth;
                var tiley = j*level.tileheight;

                if (tile === orangeValue || tile === lemonValue ||
                    tile === strawberryValue || tile === pearValue) {

                    //context.fillStyle = "#f7e697";
                    //context.fillStyle = "#000000";
                    context.fillStyle = "#060B3A";
                    context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);

                    if (tile === orangeValue) {
                        tx = 1;
                        ty = 1;
                        tilew = 64;
                        tileh = 64;
                        context.drawImage(tileimage, tx * tilew, ty * tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                    } else if (tile === lemonValue) {
                        tx = 1;
                        ty = 2;
                        tilew = 64;
                        tileh = 64;
                        context.drawImage(tileimage, tx * tilew, ty * tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                    } else if (tile === strawberryValue) {
                        tx = 1;
                        ty = 3;
                        tilew = 64;
                        tileh = 64;
                        context.drawImage(tileimage, tx * tilew, ty * tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                    } else if (tile === pearValue) {
                        tx = 2;
                        ty = 3;
                        tilew = 64;
                        tileh = 64;
                        context.drawImage(tileimage, tx * tilew, ty * tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                    }
                }
            }
        }
    }


    // Draw the snake
    function drawSnake() {

        //console.log('in drawSnake driver function, mainPlayerCount = ' + mainPlayerCount);
        if (mainPlayerCount === 2) {
            tileimage = imagesG[0];
            drawSnakeG();
            tileimage = imagesB[0];
            drawSnakeB();
        } else {
            tileimage = imagesG[0];
            drawSnakeG();
        }
    }

    function drawSnakeG() {
        //console.log('');
        //console.log('function drawSnakeG');
        //console.log('');
        // Loop over every snake segment

        //console.log('drawSnakeG: snake = ' + JSON.stringify(snake));


        for (var i=0; i<snake.segments.length; i++) {
            var segment = snake.segments[i];
            var segx = segment.x;
            var segy = segment.y;
            var tilex = segx*level.tilewidth;
            var tiley = segy*level.tileheight;

            // Sprite column and row that gets calculated
            var tx = 0;
            var ty = 0;

            if (i === openValue) {
                // Head; Determine the correct image
                nseg = snake.segments[i+1]; // Next segment
                if (segy < nseg.y) {
                    // Up
                    tx = 3; ty = 0;
                } else if (segx > nseg.x) {
                    // Right
                    tx = 4; ty = 0;
                } else if (segy > nseg.y) {
                    // Down
                    tx = 4; ty = 1;
                } else if (segx < nseg.x) {
                    // Left
                    tx = 3; ty = 1;
                }
            } else if (i === snake.segments.length-1) {
                // Tail; Determine the correct image
                pseg = snake.segments[i-1]; // Prev segment
                if (pseg.y < segy) {
                    // Up
                    tx = 3; ty = 2;
                } else if (pseg.x > segx) {
                    // Right
                    tx = 4; ty = 2;
                } else if (pseg.y > segy) {
                    // Down
                    tx = 4; ty = 3;
                } else if (pseg.x < segx) {
                    // Left
                    tx = 3; ty = 3;
                }
            } else {
                // Body; Determine the correct image
                var pseg = snake.segments[i-1]; // Previous segment
                var nseg = snake.segments[i+1]; // Next segment
                if (pseg.x < segx && nseg.x > segx || nseg.x < segx && pseg.x > segx) {
                    // Horizontal Left-Right
                    tx = 1; ty = 0;
                } else if (pseg.x < segx && nseg.y > segy || nseg.x < segx && pseg.y > segy) {
                    // Angle Left-Down
                    tx = 2; ty = 0;
                } else if (pseg.y < segy && nseg.y > segy || nseg.y < segy && pseg.y > segy) {
                    // Vertical Up-Down
                    tx = 2; ty = 1;
                } else if (pseg.y < segy && nseg.x < segx || nseg.y < segy && pseg.x < segx) {
                    // Angle Top-Left
                    tx = 2; ty = 2;
                } else if (pseg.x > segx && nseg.y < segy || nseg.x > segx && pseg.y < segy) {
                    // Angle Right-Up
                    tx = 0; ty = 1;
                } else if (pseg.y > segy && nseg.x > segx || nseg.y > segy && pseg.x > segx) {
                    // Angle Down-Right
                    tx = 0; ty = 0;
                }
            }

            // Draw the image of the snake part
            context.drawImage(tileimage, tx*64, ty*64, 64, 64, tilex, tiley,
                level.tilewidth, level.tileheight);
        }
    }


    function drawSnakeB() {
        //console.log('');
        //console.log('function drawSnake');
        //console.log('');
        // Loop over every snake segment

        //console.log('drawSnakeB: oppoSnake = ' + JSON.stringify(oppoSnake));

        for (var i=0; i<oppoSnake.segments.length; i++) {
            var segment = oppoSnake.segments[i];
            var segx = segment.x;
            var segy = segment.y;
            var tilex = segx*level.tilewidth;
            var tiley = segy*level.tileheight;

            // Sprite column and row that gets calculated
            var tx = 0;
            var ty = 0;

            if (i === openValue) {
                // Head; Determine the correct image
                nseg = oppoSnake.segments[i+1]; // Next segment
                if (segy < nseg.y) {
                    // Up
                    tx = 3; ty = 0;
                } else if (segx > nseg.x) {
                    // Right
                    tx = 4; ty = 0;
                } else if (segy > nseg.y) {
                    // Down
                    tx = 4; ty = 1;
                } else if (segx < nseg.x) {
                    // Left
                    tx = 3; ty = 1;
                }
            } else if (i === oppoSnake.segments.length-1) {
                // Tail; Determine the correct image
                pseg = oppoSnake.segments[i-1]; // Prev segment
                if (pseg.y < segy) {
                    // Up
                    tx = 3; ty = 2;
                } else if (pseg.x > segx) {
                    // Right
                    tx = 4; ty = 2;
                } else if (pseg.y > segy) {
                    // Down
                    tx = 4; ty = 3;
                } else if (pseg.x < segx) {
                    // Left
                    tx = 3; ty = 3;
                }
            } else {
                // Body; Determine the correct image
                var pseg = oppoSnake.segments[i-1]; // Previous segment
                var nseg = oppoSnake.segments[i+1]; // Next segment
                if (pseg.x < segx && nseg.x > segx || nseg.x < segx && pseg.x > segx) {
                    // Horizontal Left-Right
                    tx = 1; ty = 0;
                } else if (pseg.x < segx && nseg.y > segy || nseg.x < segx && pseg.y > segy) {
                    // Angle Left-Down
                    tx = 2; ty = 0;
                } else if (pseg.y < segy && nseg.y > segy || nseg.y < segy && pseg.y > segy) {
                    // Vertical Up-Down
                    tx = 2; ty = 1;
                } else if (pseg.y < segy && nseg.x < segx || nseg.y < segy && pseg.x < segx) {
                    // Angle Top-Left
                    tx = 2; ty = 2;
                } else if (pseg.x > segx && nseg.y < segy || nseg.x > segx && pseg.y < segy) {
                    // Angle Right-Up
                    tx = 0; ty = 1;
                } else if (pseg.y > segy && nseg.x > segx || nseg.y > segy && pseg.x > segx) {
                    // Angle Down-Right
                    tx = 0; ty = 0;
                }
            }

            // Draw the image of the snake part
            context.drawImage(tileimage, tx*64, ty*64, 64, 64, tilex, tiley,
                level.tilewidth, level.tileheight);
        }
    }



// Draw text that is centered
    function drawCenterText(text, x, y, width) {
        var textdim = context.measureText(text);
        context.fillText(text, x + (width-textdim.width)/2, y);
    }

    // Get a random int between low and high, inclusive
    function randRange(low, high) {
        return Math.floor(low + Math.random()*(high-low+1));
    }

    /*
    // Mouse event handlers
    function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);

        if (gameover) {
            // Start a new game
            tryNewGame();
        } else {
            // Change the direction of the snake
            snake.direction = (snake.direction + 1) % snake.directions.length;
        }
    }
    */

    // Keyboard event handler                           // add roundover to tryNewGame check
    function onKeyDown(e) {
        //if ((gameoverS && IamGreen) || (gameoverO && !IamGreen)) {
        if ( (gameoverS && IamGreen) ) {
            if (e.keyCode === 32 && livesLeft > 0) {    // if spacebar places and number of lives left > 0, keep playing
                gameoverS = false;
                gameoverO = true;
                tryNewGame();
            } else if (e.keyCode === 71&& livesLeft <= 0) {  // if 'g' pressed and lives left 0 or less, start new game
                livesLeft = maxlives;
                gameoverS = false;
                gameoverO = true;
                tryNewGame();
            }
        } else if ( (gameoverO && !IamGreen) ) {
            if (e.keyCode === 32 && livesLeft > 0) {    // if spacebar places and number of lives left > 0, keep playing
                gameoverO = false;
                gameoverS = true;
                tryNewGame();
            } else if (e.keyCode === 71 && livesLeft <= 0) {  // if 'g' pressed and lives left 0 or less, start new game
                livesLeft = maxlives;
                gameoverO = false;
                gameoverS = true;
                tryNewGame();
            }
        } else {
            if (e.keyCode === 37 || e.keyCode === 65) {
                // Left or A
                if (IamGreen) {
                    if (snake.direction !== 1) {
                        snake.direction = 3;
                    }
                } else {
                    if (oppoSnake.direction !== 1) {
                        oppoSnake.direction = 3;
                    }
                }
            } else if (e.keyCode === 38 || e.keyCode === 87) {
                // Up or W
                if (IamGreen) {
                    if (snake.direction !== 2) {
                        snake.direction = 0;
                    }
                } else {
                    if (oppoSnake.direction !== 2) {
                        oppoSnake.direction = 0;
                    }
                }
            } else if (e.keyCode === 39 || e.keyCode === 68) {
                // Right or D
                if (IamGreen) {
                    if (snake.direction !== 3) {
                        snake.direction = 1;
                    }
                } else {
                    if (oppoSnake.direction !== 3) {
                        oppoSnake.direction = 1;
                    }
                }
            } else if (e.keyCode === 40 || e.keyCode === 83) {
                // Down or S
                if (IamGreen) {
                    if (snake.direction !== 0) {
                        snake.direction = 2;
                    }
                } else {
                    if (oppoSnake.direction !== 0) {
                        oppoSnake.direction = 2;
                    }
                }
            }

            // Grow for demonstration purposes
            if (e.keyCode === 32) {
                snake.grow();
                oppoSnake.grow();
            }
        }
    }

    /*
    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    */

    console.log('fell through to bottom of code, call init()');
    // Call init to start the game
    init();

//};