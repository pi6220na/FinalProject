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

    console.log('inside snakeGame ... user._id = ' + user._id);
    for (item in user) {
        console.log('snakegame item = ' + item + ' user[item] = ' + user[item]);
    }


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
    var images = [];
    var tileimage;


    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;


//    var player = {id: null};


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
    //var snake = new Snake();
    var model = new Snake();
    var snake = model;               // make a copy to switch back and forth between model and opponent

    console.log('in init - ------------------------------------  model = ' + JSON.stringify(model));
    // var level = new Level(20, 15, 32, 32);  //original
    var level = new Level(48, 36, 16, 16);   // (columns, rows, tilewidth, tileheight)


    // Variables
    var score = 0;              //
  //  var dbHighScore;              // initialize from server   TODO
    var newHighScore = 0;       // new high score within this game, will replace dbHighScore on server if higher
    var gameover = true;        // Game is over === set to true to stop snake from moving when initialized
    var roundover = false;      // when player collides with something, the round is over
    var roundOverTime = 1;       // How long we have been game over
    var gameoverdelay = 0.25;    // Waiting time after game over, was 0.5
    var maxlives = 5;        // max number of lives
    var livesLeft = maxlives;  // number of lives
    var gameLevel = 1;         // number of levels to play, advances after completing TODO rounds
    var sSpeed = 10;           // initial speed, bumped to 15 for level 2
    var wallValue = 1;          // grid values in 2 dimension array used for collision detection
    var appleValue = 2;
    var openValue = 0;          // snake contained in snake object, collision detection done on that object
    var opponent = null;         // id of opponents on other web pages
    var playThisSnake = false;   // switch controls updating snake or opponent
    var sOpponent = {};
    var oppoSnake = {};                   // hold copy of snake



    // Initialize the game
    function init() {
        // Load images
        images = loadImages(["./images/snake-graphics.png"]);
        tileimage = images[0];
        //for (item in tileimage) {
        //    console.log('tileimage = ' + tileimage[item]);
        //}
        /*
        // Add mouse events
        canvas.addEventListener("mousedown", onMouseDown);
        */


        // Add keyboard events
        document.addEventListener("keydown", onKeyDown);

        // New game
        newGame();
        roundover = true;

        // Enter main loop
        main(0);
    }

    // Check if we can start a new game
    function tryNewGame() {
        if (roundOverTime > gameoverdelay) {
            $('#lives').html(livesLeft);
     //       $('#highestscore').html(newHighScore);
            if (gameLevel < 2 && newHighScore > 3 && roundover) { // advance to level 2 only if highest this round score at least 10
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
            gameover = false;          //testing this location

            $('#scorethis').html("000");
            $('#gameLevel').html(gameLevel);
            $('#speed').html(sSpeed);
            $('#highestscore').html(user.highScore);
            $('#hDate').html(user.highDate);
            $('#hComment').html(user.comment);

        }
    }



    function newGame() {
        // Initialize the model
        var saveId = model.id;
        model.init(0, 5, 10, 1, sSpeed, 4);  //  function(id, x, y, direction, speed, numsegments)
        model.id = saveId;

        // Generate the default level
        level.generate();

        // Add an apple
        addApple();

        // Initialize the score
        score = 0;

        // Initialize variables
        gameover = true;
        roundover = false;
        $('#scorethis').html("000");
        $('#lives').html(livesLeft);  // setup new game with total number of lives available
        $('#gameLevel').html(gameLevel);
        $('#highestscore').html(user.highScore);
        $('#hDate').html(user.highDate);
        $('#hComment').html(user.comment);


    }

    // Add an apple to the level at an empty position
    function addApple() {
        // Loop until we have a valid apple
        var valid = false;
        while (!valid) {
            // Get a random position
            var ax = randRange(0, level.columns-1);
            var ay = randRange(0, level.rows-1);

            // Make sure the snake doesn't overlap the new apple
            var overlap = false;
            for (var i=0; i<model.segments.length; i++) {
                // Get the position of the current snake segment
                var sx = model.segments[i].x;
                var sy = model.segments[i].y;

                // Check overlap
                if (ax === sx && ay === sy) {
                    overlap = true;
                    break;
                }
            }

            // Tile must be empty
            if (!overlap && level.tiles[ax][ay] === 0) {
                // Add an apple at the tile position
                level.tiles[ax][ay] = 2;
                valid = true;
            }
        }
    }

    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);

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

        if (!gameover) {
            updateGame(dt);
        } else {
            roundOverTime += dt;
        }
    }

    function updateGame(dt) {



    //alternate player snake with opponent snake for the following functions

        console.log('opponent = ' + JSON.stringify(opponent));
        console.log('sOpponent = ' + JSON.stringify(sOpponent));
        console.log('model.id = ' + JSON.stringify(model.id));

        /*
        if ((sOpponent !== '' || sOpponent !== null) && (model.id === '' || model.id === null)) {
            model.id = sOpponent[1];
        }
        */


        if (!playThisSnake && oppoSnake !== null && typeof oppoSnake !== 'undefined') {
            playThisSnake = true;
            //model = oppoSnake;
            Object.assign(model,oppoSnake);
            console.log('setting model to opponent snake *************************************************')
        } else
            if (playThisSnake && oppoSnake !== null && typeof oppoSnake !== 'undefined') {
            //model = snake;            // snake and model are sourced from the same thing
            Object.assign(model,snake);
            playThisSnake = false;
            console.log('fell through setting model to snake *********************************************')
        } else { // single player
            Object.assign(model,snake);
            //model = snake;
            console.log('single player setting model to snake *********************************************')
        }


        console.log('snake = ' + JSON.stringify(snake));
        console.log('');
        console.log('oppoSnake = ' + JSON.stringify(oppoSnake));
        console.log('');
        console.log('model = ' + JSON.stringify(model));
        console.log('');

        console.log('in update loop ... model.id = ' + model.id);

        // Move the snake
        if (model.tryMove(dt)) {
            // Check snake collisions

            // Get the coordinates of the next move
            var nextmove = model.nextMove();
            var nx = nextmove.x;
            var ny = nextmove.y;

            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
                if (level.tiles[nx][ny] === wallValue) {
                    // Collision with a wall
                    gameover = true;
                    snakeCollideWall(model.id);

                }

                // sockets add call to server to notify players of collision

                // Collisions with the snake itself
                for (var i=0; i<model.segments.length; i++) {
                    var sx = model.segments[i].x;
                    var sy = model.segments[i].y;

                    if (nx === sx && ny === sy) {
                        // Found a snake part
                        gameover = true;
                        snakeCollideSelf(model.id);
                        break;
                    }
                }

                if (!gameover) {
                    // The snake is allowed to move

                    // Move the snake
                    model.move();

                    // Check collision with an apple
                    if (level.tiles[nx][ny] === appleValue) {
                        // Remove the apple
                        level.tiles[nx][ny] = 0;

                        // Add a new apple
                        addApple();
                        snakeEatApple(model.id);

                        // Grow the snake
                        model.grow();

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

                    // Sockets send player's current position to the server.
                    sendPosition(model);
                    console.log('((((((((( ________________________ ))))))))))))))))');
                    console.log('         sendPosition model = ' + JSON.stringify(model));
                    console.log('((((((((( ________________________ ))))))))))))))))');


                }
            } else {
                // Out of bounds
                gameover = true;

            }

            if (gameover) {
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
            }
        }
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
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawLevel();
        drawSnake();

        // Game over
        if (gameover) {
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

        }
    }

    function updateDatabase (HighScore) {

        console.log('in updateDatabase _id = ' + user._id);
        console.log(' in updateDatabase highScore = ' + HighScore);
        $.ajax({
            method: "POST",
            url: "/update",
            data: { highScore: HighScore, _id: user._id, highDate: Date.now(), comment: "placeholder" }
        }).done (function(data) {
            console.log('ajax success');
            //console.log('ajax success' + data);
            //for (item in data) {
            //    console.log('snakegame item = ' + item + ' data[item] = ' + data[item]);
           // }
        }).fail(function (xhr) {
           console.log("ajax Post error:");
           for (item in xhr) {
               console.log(xhr[item]);
           }
        });


        // $('#highestscore').html(HighScore);
        // post to index.hbs file the fields we just updated to the database
        /*
        $('#highestscore').html(HighScore);
        $('#hDate').html(Date.now());
        $('#hComment').html("update");
        */
        $('#highestscore').html(HighScore);
        $('#hDate').html(Date.now());
        $('#hComment').html("a comment");

        console.log('leaving updateDatabase');
    }


    // Draw the level tiles
    function drawLevel() {
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
                    context.fillStyle = "#000000";
                    context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
                } else if (tile === wallValue) {
                    // Wall
                    //context.fillStyle = "#bcae76";
                    context.fillStyle = "#000000";
                    context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
                    var tx = 0;
                    var ty = 2;
                    var tilew = 64;
                    var tileh = 64;
                    //context.drawImage(wallimage, tx*tilew, ty*tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                    context.drawImage(tileimage,tx*tilew, ty*tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                } else if (tile === appleValue) {
                    // Apple

                    // Draw apple background
                    //context.fillStyle = "#f7e697";
                    context.fillStyle = "#000000";
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

    // Draw the snake
    function drawSnake() {
        // Loop over every snake segment
        for (var i=0; i<model.segments.length; i++) {
            var segment = model.segments[i];
            var segx = segment.x;
            var segy = segment.y;
            var tilex = segx*level.tilewidth;
            var tiley = segy*level.tileheight;

            // Sprite column and row that gets calculated
            var tx = 0;
            var ty = 0;

            if (i === openValue) {
                // Head; Determine the correct image
                nseg = model.segments[i+1]; // Next segment
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
            } else if (i === model.segments.length-1) {
                // Tail; Determine the correct image
                pseg = model.segments[i-1]; // Prev segment
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
                var pseg = model.segments[i-1]; // Previous segment
                var nseg = model.segments[i+1]; // Next segment
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

    // Keyboard event handler
    function onKeyDown(e) {
        if (gameover || roundover) {
            if (e.keyCode === 32 && livesLeft > 0) {    // if spacebar places and number of lives left > 0, keep playing
                tryNewGame();
            } else if (e.keyCode === 71&& livesLeft <= 0) {  // if 'g' pressed and lives left 0 or less, start new game
                livesLeft = maxlives;
                tryNewGame();
            }
        } else {
            if (e.keyCode === 37 || e.keyCode === 65) {
                // Left or A
                if (model.direction !== 1)  {
                    model.direction = 3;
                }
            } else if (e.keyCode === 38 || e.keyCode === 87) {
                // Up or W
                if (model.direction !== 2)  {
                    model.direction = 0;
                }
            } else if (e.keyCode === 39 || e.keyCode === 68) {
                // Right or D
                if (model.direction !== 3)  {
                    model.direction = 1;
                }
            } else if (e.keyCode === 40 || e.keyCode === 83) {
                // Down or S
                if (model.direction !== 0)  {
                    model.direction = 2;
                }
            }

            // Grow for demonstration purposes
            if (e.keyCode === 32) {
                model.grow();
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

    // Call init to start the game
    init();

//};