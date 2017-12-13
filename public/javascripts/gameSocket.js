//window.onload = function() {


// game.js code copied from Clara's Circles game

    var socket = io();

//    manager.reconnection([value])

// socket.on('allPlayerLocations', function(opponentPositions){
//   console.log('opponentPositions', opponentPositions)
// });


    // socket send to sever functions

    function sendPosition(model) {
        socket.emit('currentPosition', model);
    }


    function wasEaten() {
        console.log('was eaten')
        socket.emit('playerEaten', snake);
    }


    function ateOpponent(opponent) {
        console.log('ate opponent')
        socket.emit('playerEaten', opponent);
    }


    // socket receive from sever functions


//https://stackoverflow.com/questions/33136892/socketio-client-silently-loses-connection-and-creates-new-socket-transport-clos
// fixes problem with connecting/reconnecting as new client
    socket.on('ping', function(data){
        socket.emit('pong', {beat: 1});
    });



    socket.on('setId', function(id) {

        console.log('*********************************   set model.id   ********************************');
        model.id = id;
        console.log('socket: setId = ' + id);
        console.log('socket: model.id = ' + model.id);

    });

    socket.on('allPlayerLocations', function (snake) {
        // console.log('rec all locations', players)

        console.log('socket: allPlayerLocations snake (from game.js snake = ' + JSON.stringify(snake));

        oppoSnake = snake;
        sOpponent = snake;

        console.log('***** socket: oppoSnake = ' + JSON.stringify(oppoSnake));
        console.log('***** socket: sOpponent = ' + JSON.stringify(sOpponent));
    })

    socket.on('allPlayerLocationsID', function (snake) {

        console.log('socket: allPlayerLocationsID id = ' + JSON.stringify(snake));

        oppoSnake = model;
        //sOpponent = snake;

        //console.log('socket: oppoSnake = ' + JSON.stringify(oppoSnake));
        console.log('socket: sOpponent = ' + JSON.stringify(sOpponent));

        // trigger off sending snake to opponent



    })

    socket.on('atMaxPlayers', function (players) {
        message('Reached max players for multiplayer')
        preventStart()
    })

//}