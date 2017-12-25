//window.onload = function() {

// game.js code copied from Clara's Circles game

    var socket = io();

//    manager.reconnection([value])

// socket.on('allPlayerLocations', function(opponentPositions){
//   console.log('opponentPositions', opponentPositions)
// });


    //***************                   socket send to sever functions               *********************


    function sendPosition(model) {
        socket.emit('currentPosition', model);
    }

    function getOppoSegments() {
        socket.emit('getAndSendOppoSegments');
    }

    function getSnakeSegments() {
        socket.emit('getAndSendSnakeSegments');
    }

    function sendSnakesDiedMessage() {
        socket.emit('sendSnakesDiedMessage');
    }



function sendSnakeInPlay() {
        console.log('');
        console.log('sendSnakeInPlay function in gameSocket.js')
        console.log('');
        //for (item in snake) {
        //    console.log('item = ' + item + ' snake[item] = ' +snake[item]);
        //}
        console.log('');
        socket.emit('snakeInPlay', snake);
    }

    function sendOppoSnakeInPlay() {
        console.log('');
        console.log('sendOppoSnakeInPlay function in gameSocket.js')
        console.log('');
        socket.emit('oppoSnakeInPlay', oppoSnake);
    }


    // snake collide functions
    function oppoSegments(oppoSnakesegments) {
        socket.emit('oppoSegments', oppoSnakesegments);
    }


    function snakeCollideOppo() {
        socket.emit('snakeCollideOppo');
    }

    function snakeSegments(snakeSegments) {
        socket.emit('snakeSegments', snakeSegments);
    }


    function snakeCollideSnake() {
        socket.emit('snakeCollideSnake');
    }



    function snakeCollideWall(id) {
        socket.broadcast.emit('snakeCollideWall', id);
    }


    function snakeCollideSelf(id) {
        socket.broadcast.emit('snakeCollideSelf', id);
    }


    function snakeEatApple(id) {
        socket.broadcast.emit('snakeEatApple', id);
    }

    function oppoSnakeCollideWall(id) {
        socket.broadcast.emit('oppoSnakeCollideWall', id);
    }


    function oppoSnakeCollideSelf(id) {
        socket.broadcast.emit('oppoSnakeCollideSelf', id);
    }


    function oppoSnakeEatApple(id) {
        socket.broadcast.emit('oppoSnakeEatApple', id);
    }



/*
function collidedWithWall(snake) {
    console.log('received collidedWithWall message from server');
    socket.broadcast.emit('Opponent has hit a wall');
    // will need to handle this message in game loop, if getting message in snakeGame.js must be opponent

}
*/

    //***************                  socket receive from sever functions                **********************


/*
//https://stackoverflow.com/questions/33136892/socketio-client-silently-loses-connection-and-creates-new-socket-transport-clos
// fixes problem with connecting/reconnecting as new client
    socket.on('ping', function(data){
        socket.emit('pong', {beat: 1});
    });
*/

    socket.on('SnakesDied', function() {
        setSnakesDiedMessage();
    });


    socket.on('SendOppoSegments', function () {
        SendOppoSegments();
    });


    socket.on('returnOppoSegments', function(oppoSnakesegments) {
        console.log('gameSocket: oppoSnakesegments = ' + oppoSnakesegments);
        returnOppoSegments(oppoSnakesegments);
    });



    socket.on('SendSnakeSegments', function () {
        SendSnakeSegments();
    });


    socket.on('returnSnakeSegments', function(snakeSegments) {
        console.log('gameSocket: snakeSegments = ' + snakeSegments);
        returnSnakeSegments(snakeSegments);
    });




    socket.on('snakeCollidedWall', function(id) {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where snakeCollidedWall')
        console.log('');
        console.log('');

        setSnakeGameOver();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });

    socket.on('snakeCollidedSelf', function(id) {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where snakeCollidedSelf')
        console.log('');
        console.log('');

        setSnakeGameOver();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });


    socket.on('snakeCollidedOppo', function() {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where snakeCollidedOppo')
        console.log('');
        console.log('');

        setSnakesDiedMessage();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });


    socket.on('snakeCollidedSnake', function() {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where snakeCollidedSnake')
        console.log('');
        console.log('');

        setSnakesDiedMessage();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });



    socket.on('snakeAteApple', function(id) {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where snakeAteApple')
        console.log('');
        console.log('');

        setSnakesDiedMessage();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });



    socket.on('oppoSnakeCollidedWall', function(id) {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where oppoSnakeCollidedWall')
        console.log('');
        console.log('');

        setOppoSnakeGameOver();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });

    socket.on('oppoSnakeCollidedSelf', function(id) {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where oppoSnakeCollidedSelf')
        console.log('');
        console.log('');

        setOppoSnakeGameOver();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });

    socket.on('oppoSnakeAteApple', function(id) {
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where oppoSnakeAteApple');
        console.log('');
        console.log('');

        setOppoSnakeGameOver();

        // gameover = true;
        // Object.assign(oppoSnake, id);  // needed? used?

    });




    socket.on('setId', function(id) {

        console.log('*********************************   set model.id   ********************************');
        //model.id = id;
        console.log('socket: setId = ' + id);
        //console.log('socket: model.id = ' + model.id);

        setModelID(id);

    });

    socket.on('snakeInPlay', function (snake) {

        console.log('socket: calling  snakeInPlay  function  snake = ' + JSON.stringify(snake));
        //for (item in snake) {
        //    console.log('item = ' + item + ' snake[item] = ' +snake[item]);
        //}
        snakeInPlay(snake);

    });

    socket.on('oppoSnakeInPlay', function (oppoSnake) {

        console.log('socket: calling  oppoSnakeInPlay  function  opposnake = ' + JSON.stringify(oppoSnake));

        oppoSnakeInPlay(oppoSnake);

    });



    socket.on('allPlayerLocations', function (snake) {
        // console.log('rec all locations', players)

        console.log('socket: allPlayerLocations snake (from game.js snake = ' + JSON.stringify(snake));

        //checkGameState();    // checks if gameover, trys to start a new game

        setOppoSnake(snake);   // passes client snake to opponent

        // oppoSnake = snake;  // probably useless

        console.log('***** socket: oppoSnake = ' + JSON.stringify(oppoSnake));

    });

    socket.on('allPlayerLocationsID', function (player) {                   // was snake being passed in

        console.log('socket: allPlayerLocationsID id = ' + JSON.stringify(player));
        var countPlayers = 0;

        playerIDs = player;              // was opposnake being set to snake
        for (item in player) {
            countPlayers++;              // count = 1, this is the first player
        }

        setColorValue(countPlayers);
        console.log('socket: countPlayers = ' + countPlayers);

    });

    socket.on('atMaxPlayers', function (players) {
        message('Reached max players for multiplayer')
        // preventStart()
    });

//}