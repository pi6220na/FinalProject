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

    function sendCollideWall(model) {
        socket.broadcast.emit('snakeCollideWall', model);
    }


    function wasEaten() {
        console.log('was eaten')
        socket.emit('playerEaten', snake);
    }


    function ateOpponent(opponent) {
        console.log('ate opponent')
        socket.emit('playerEaten', opponent);
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

    socket.on('snakeCollidedWall', function(model) {
        console.log('');
        console.log('');
        console.log('');
        console.log('sockets: setting gameover to true where snakeCollidedWall')
        console.log('');
        console.log('');
        console.log('');
        gameover = true;
        Object.assign(oppoSnake, model);

    });



    socket.on('setId', function(id) {

        console.log('*********************************   set model.id   ********************************');
        //model.id = id;
        console.log('socket: setId = ' + id);
        //console.log('socket: model.id = ' + model.id);

        setModelID(id);

    });

    socket.on('allPlayerLocations', function (snake) {
        // console.log('rec all locations', players)

        console.log('socket: allPlayerLocations snake (from game.js snake = ' + JSON.stringify(snake));

        checkGameState();    // checks if gameover, trys to start a new game

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