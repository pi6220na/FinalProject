// game.js code copied from Clara's Circles game


//var players = {};   // dict of id + player obj
var players = [];   // change to array dict of id + player obj

var p1 = '';
var p2 = '';
var p1_set = false;
var p2_set = false;
var sock;

const MAX_PLAYERS = 2;

io = require( 'socket.io' )( { pingInterval: 60000 } );

function init(io) {

    io.sockets.on('connect', function(socket){

        console.log('someone connected', socket.id);


        socket.emit('allPlayerLocations', players);  // send to everyone.    // was .emit

            console.log('game.js:  players.length = ' + players.length);

            if (players.length <= MAX_PLAYERS) {

                socket.emit('setId', socket.id);   // send only to the thing that connected    // was .emit

                /*

                if (p1 === '') {
                    p1 = socket.id;
                    p1_set = false;
                }
                if (p2 === '' && socket.id !== p1) {
                    p2 = socket.id;
                    p2_set = false;
                }

                console.log('p1 = ' + p1 + ' p2 = ' + p2);

                players[0] = p1;
                players[1] = p2;
                console.log('*******************    on someone connected = ' + players);

                if (!p1_set && socket.id !== p2) {
                    sock = p1;
                    console.log('p1*********** set snake id *************')
                    console.log('p1 = ' + p1);
                    p1_set = true;
                    socket.emit('setId', sock);   // send only to the thing that connected    // was .emit

                }
                if (!p2_set && socket.id !== p1) {
                    sock = p2;
                    console.log('p2*********** set snake id *************')
                    console.log('p2 = ' + p2);
                    p2_set = true;
                    socket.emit('setId', sock);   // send only to the thing that connected    // was .emit

                }

                //     players[socket.id] = null; // placeholder until the player updates with their full info

                */


            } else {
                socket.emit('atMaxPlayers');
            }


            io.sockets.on('clientStart', function(player){
            // needed?

            });


            io.sockets.on('currentPosition', function(model){
            // find player in players obj and update
            // receive snake object and pass to other player

                console.log(' ');
                console.log('game.js: setting oppoSnake = ' + model);
                console.log(' ');

                oppoSnake = model;                            // set opponent snake object


                socket.emit('allPlayerLocations', model);
/*
                console.log('game.js:  player = ' + JSON.stringify(model));
                console.log('game.js:  players = ' + model);

                pi = ''; p2 = '';

                if (p1 === '') {
                    p1 = socket.id;
                    p1_set = false;
                }
                if (p2 === '' && socket.id !== p1) {
                    p2 = socket.id;
                    p2_set = false;
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
*/

            });


            io.sockets.on('snakeCollideSelf', function(id){
            //   // find player in players obj and update
            //   // players[player.id] = player;
                socket.emit('snakeCollidedSelf', id);

            });

            io.sockets.on('snakeCollideWall', function(id){
              //   // find player in players obj and update
              //   // players[player.id] = player;
                socket.emit('snakeCollidedWall', id);

            });

            io.sockets.on('snakeEatApple', function(id){
              //   // find player in players obj and update
              //   // players[player.id] = player;
                socket.emit('snakeAteApple', id);

            });



            io.sockets.on('playerEaten', function(player){
            // remove player from players object
                console.log('player was eaten', player);
                delete players[player.id];                         //todo figure out what to do with this
                socket.emit('allPlayerLocations', players);

            });

            // Delete this player
            io.sockets.on('disconnect', function() {
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
