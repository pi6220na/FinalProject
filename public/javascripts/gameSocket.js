window.onload = function() {


// game.js code copied from Clara's Circles game

    var socket = io();

// socket.on('allPlayerLocations', function(opponentPositions){
//   console.log('opponentPositions', opponentPositions)
// });


    function sendPosition(player) {
        socket.emit('clientPosition', player);
    }


    function wasEaten() {
        console.log('was eaten')
        socket.emit('playerEaten', player);
    }


    function ateOpponent(opponent) {
        console.log('ate opponent')
        socket.emit('playerEaten', opponent);
    }

    socket.on('setId', function (id) {
        //player.id = id;
        //snake.id = id;
    });

    socket.on('allPlayerLocations', function (players) {
        // console.log('rec all locations', players)
        opponents = players;
    })

    socket.on('atMaxPlayers', function (players) {
        message('Reached max players for multiplayer')
        preventStart()
    })
}