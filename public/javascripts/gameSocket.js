//window.onload = function() {


// game.js code copied from Clara's Circles game

    var socket = io();

// socket.on('allPlayerLocations', function(opponentPositions){
//   console.log('opponentPositions', opponentPositions)
// });


    // socket send to sever functions

    function sendPosition(snake) {
        socket.emit('clientPosition', snake);
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


    socket.on('setId', function (id) {

        model.id = id;
        console.log('*********************************   set snake.id   ********************************');
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

        oppoSnake = players
        sOpponent = players;

        console.log('socket: sOpponent = ' + JSON.stringify(sOpponent));
        console.log('socket: players = ' + JSON.stringify(players));
    })


    socket.on('atMaxPlayers', function (players) {
        message('Reached max players for multiplayer')
        preventStart()
    })

//}