//window.onload = function() {


// game.js code copied from Clara's Circles game

    var socket = io();

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


    socket.on('setId', function(id) {

        console.log('*********************************   set model.id   ********************************');
        model.id = id;
        console.log('socket: setId = ' + id);
        console.log('socket: model.id = ' + model.id);

    });

    socket.on('allPlayerLocations', function (players) {
        // console.log('rec all locations', players)

        console.log('socket: allPlayerLocations player = ' + players);
        temp = players;
        for (item in temp) {
            console.log('item = ' + item + ' player = ' + temp[item]);
        }

        oppoSnake = players;
        sOpponent = players;

        console.log('socket: oppoSnake = ' + JSON.stringify(oppoSnake));
        console.log('socket: players = ' + JSON.stringify(players));
    })


    socket.on('atMaxPlayers', function (players) {
        message('Reached max players for multiplayer')
        preventStart()
    })

//}