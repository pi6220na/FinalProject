// game.js code copied from Clara's Circles game


//var players = {};   // dict of id + player obj
var players = [];   // change to array dict of id + player obj

var p1 = '';
var p2 = '';
var p1_set = false;
var p2_set = false;
var sock;

const MAX_PLAYERS = 2;

function init(io) {

  io.on('connect', function(socket){

    console.log('someone connected', socket.id);
    io.sockets.emit('allPlayerLocations', players);  // send to everyone.


      console.log('game.js:  players.length = ' + players.length);
    if (players.length <= MAX_PLAYERS) {

        if (p1 === '') {
            p1 = socket.id;
        }
        if (p2 === '' && socket.id !== p1) {
            p2 = socket.id;
        }

        console.log('p1 = ' + p1 + ' p2 = ' + p2);

        players[0] = p1;
        players[1] = p2;
        console.log('*******************    on someone connected = ' + players);

        if (!p1_set) {
          sock = p1;
            socket.emit('setId', sock);   // send only to the thing that connected
            console.log('p1*********** set snake id *************')
            console.log('p1 = ' + p1);
          p1_set = true;
        }
        if (!p2_set) {
            sock = p2;
            socket.emit('setId', sock);   // send only to the thing that connected
            console.log('p2*********** set snake id *************')
            console.log('p2 = ' + p2);
            p2_set = true;
        }

 //     players[socket.id] = null; // placeholder until the player updates with their full info


    }

    else {
      socket.emit('atMaxPlayers');
    }


    socket.on('clientStart', function(player){
        // needed?

    });


    socket.on('clientPosition', function(player){
      // find player in players obj and update
      // receive snake object and pass to other player
        oppoSnake = player;                            // set opponent snake object


      io.sockets.emit('allPlayerLocations', players);



            console.log('game.js:  player = ' + JSON.stringify(player));
        //for (item in players) {
            console.log('game.js:  players = ' + players);
        //}

    });


      socket.on('snakeCollideSelf', function(id){
          //   // find player in players obj and update
          //   // players[player.id] = player;
          io.sockets.emit('snakeCollidedSelf', id);

      });

      socket.on('snakeCollideWall', function(id){
          //   // find player in players obj and update
          //   // players[player.id] = player;
          io.sockets.emit('snakeCollidedWall', id);

      });

      socket.on('snakeEatApple', function(id){
          //   // find player in players obj and update
          //   // players[player.id] = player;
          io.sockets.emit('snakeAteApple', id);

      });



      socket.on('playerEaten', function(player){
      // remove player from players object
      console.log('player was eaten', player);
      delete players[player.id];
      io.sockets.emit('allPlayerLocations', players);

    });

    // Delete this player
    socket.on('disconnect', function() {
        console.log('before delete ' + JSON.stringify(players + ' socketid = ' + socket.id));
        delete players[socket.id];

        for (var i = 0; i < players.length; i++) {
          if (socket.id = players[i]) {
            players[i] = '';
            if (i = 0) { p1_set = false; p1='' };
            if (i = 1) { p2_set = false; p2='' };
          }
        }

        console.log('########################################## disconnected #############################');
        console.log('after delete ' + JSON.stringify(players));
    });



  })

}

module.exports = init;
