// game.js code copied from Clara's Circles game


var players = {};   // dict of id + player obj

const MAX_PLAYERS = 2;

function init(io) {

  io.on('connect', function(socket){

    console.log('someone connected', socket.id);
    io.sockets.emit('allPlayerLocations', players);  // send to everyone.

    if (Object.keys(players).length < MAX_PLAYERS) {

      socket.emit('setId', socket.id);   // send only to the thing that connected
      players[socket.id] = null; // placeholder until the player updates with their full info

    }

    else {
      socket.emit('atMaxPlayers');
    }


    socket.on('clientStart', function(player){
        // needed?

    });


    socket.on('clientPosition', function(player){
      // find player in players obj and update
      players[player.id] = player;
      io.sockets.emit('allPlayerLocations', players);

    });


    socket.on('playerEaten', function(player){
      // remove player from players object
      console.log('player was eaten', player);
      delete players[player.id];
      io.sockets.emit('allPlayerLocations', players);

    });

    // Delete this player
    socket.on('disconnect', function() {
        delete players[socket.id];
    });

  })

}

module.exports = init;
