// game.js code copied from Clara's Circles game


var players = {};   // dict of id + player obj
//var players = [];   // change to array dict of id + player obj

var countPlayers = 0;
var firstTime = true;

const MAX_PLAYERS = 2;

io = require( 'socket.io' );  //( { pingInterval: 60000 } );

var holdId = "";

function init(io) {


    io.on('connect', function(socket){

        console.log('game.js:   someone connected', socket.id);
        holdId = socket.id;  // this is the id of the "owner" or client connecting to sockets
        players[socket.id] = socket.id;


        io.emit('allPlayerLocationsID', players);  // send to everyone.    //


        countPlayers = 0;
        for (item in players) {
            //console.log('at top, someone connected, item = ' + item);
            countPlayers++;
        }
        console.log('game.js:  countPlayers = ' + countPlayers);

        if (countPlayers <= MAX_PLAYERS) {
            socket.emit('setId', socket.id);   // send only to the thing that connected    // was .emit

        } else {
            socket.emit('atMaxPlayers');
        }


        socket.on('clientStart', function(player){
        // needed?

        });


        socket.on('currentPosition', function(model){
        // receive snake object and pass to other player

            snake = model;        // set opponent snake object ... does this do anything worthwhile??? todo

            console.log(' ');
            //console.log('game.js: setting oppoSnake to model = ' + JSON.stringify(oppoSnake));
            console.log('game.js: setting snake to model = ' + JSON.stringify(snake));
            console.log(' ');


            socket.broadcast.emit('allPlayerLocations', model);  //send out to other player
            //socket.emit('allPlayerLocations', model);          // send to sender-client only
            //io.emit('allPlayerLocations', model);           // send to all players

        });


        socket.on('getAndSendOppoSegments', function() {
            socket.emit('SendOppoSegments');  //send out to other player
            //socket.emit('returnOppoSegments', oppoSnakesegments);  //send out to player
        });


        socket.on('oppoSegments', function(oppoSnakesegments) {
            console.log('game server: oppoSnakesegments = ' + oppoSnakesegments);
            socket.emit('returnOppoSegments', oppoSnakesegments);  //send out to other player
        });



        socket.on('getAndSendSnakeSegments', function() {
            socket.emit('SendSnakeSegments');  //send out to other player
            //socket.emit('returnOppoSegments', oppoSnakesegments);  //send out to player
        });


        socket.on('snakeSegments', function(snakeSegments) {
            console.log('game server: snakeSegments = ' + snakeSegments);
            socket.emit('returnSnakeSegments', snakeSegments);  //send out to other player
        });



        socket.on('sendSnakesDiedMessage', function() {
            socket.broadcast.emit('SnakesDied');  //send out to other player
            //socket.emit('returnOppoSegments', oppoSnakesegments);  //send out to player
        });



        socket.on('snakeInPlay', function(snake){
            //
            console.log(' ');
            //console.log('game.js: setting oppoSnake to model = ' + JSON.stringify(oppoSnake));
            console.log('game.js: setting snakeInPlay');
            //for (item in snake) {
            //    console.log('item = ' + item + ' snake[item] = ' +snake[item]);
            //}
            console.log(' ');


            socket.broadcast.emit('snakeInPlay', snake);  //send out to other player
        });


        socket.on('oppoSnakeInPlay', function(oppoSnake){
            // find player in players obj and update
            // receive snake object and pass to other player

            console.log(' ');
            //console.log('game.js: setting oppoSnake to model = ' + JSON.stringify(oppoSnake));
            console.log('game.js: setting oppoSnakeInPlay');
            console.log(' ');


            socket.broadcast.emit('oppoSnakeInPlay', oppoSnake);  //send out to other player
        });


        socket.on('snakeCollideSelf', function(id){
        //   // find player in players obj and update
        //   // players[player.id] = player;
            socket.emit('snakeCollidedSelf', id);

        });


        socket.on('snakeCollideOppo', function(){
            //   // find player in players obj and update
            //   // players[player.id] = player;
            socket.emit('snakeCollidedOppo');

        });



        socket.on('snakeCollideSnake', function(){
            //   // find player in players obj and update
            //   // players[player.id] = player;
            socket.emit('snakeCollidedSnake');

        });



        socket.on('snakeCollideWall', function(id){
          //   // find player in players obj and update
          //   // players[player.id] = player;
            socket.broadcast.emit('snakeCollidedWall', id);

        });

        socket.on('snakeEatApple', function(id){
          //   // find player in players obj and update
          //   // players[player.id] = player;
            socket.emit('snakeAteApple', id);

        });

        socket.on('oppoSnakeCollideSelf', function(id){
            //   // find player in players obj and update
            //   // players[player.id] = player;
            socket.emit('oppoSnakeCollidedSelf', id);

        });

        socket.on('oppoSnakeCollideWall', function(id){
            //   // find player in players obj and update
            //   // players[player.id] = player;
            socket.broadcast.emit('oppoSnakeCollidedWall', id);

        });

        socket.on('oppoSnakeEatApple', function(id){
            //   // find player in players obj and update
            //   // players[player.id] = player;
            socket.emit('oppoSnakeAteApple', id);

        });



        // Clara's coding for sockets-circles
        socket.on('playerEaten', function(player){
        // remove player from players object
            console.log('player was eaten', player);
            delete players[player.id];                         //todo figure out what to do with this
            socket.emit('allPlayerLocations', players);

        });

        //https://stackoverflow.com/questions/33136892/socketio-client-silently-loses-connection-and-creates-new-socket-transport-clos
        socket.on('pong', function(data){
            console.log("Pong received from client");
        });

        // Delete this player
        socket.on('disconnect', function() {

            console.log('############################# disconnected #############################');
            console.log('socket.id = ' + JSON.stringify(socket.id));
            console.log('');


            console.log('before delete ' + JSON.stringify(players) + ' holdId = ' + holdId);
            // delete players[Object.keys(players)[0]]; // didn't work correctly
            delete players[socket.id];
            countPlayers--;

            console.log('############################# disconnected #############################');
            console.log('after delete ' + JSON.stringify(players));
            console.log('holdId = ' + holdId);

        });


/*
        //https://stackoverflow.com/questions/33136892/socketio-client-silently-loses-connection-and-creates-new-socket-transport-clos
        // fixes problem with connecting/reconnecting as new client
        function sendHeartbeat(){
            setTimeout(sendHeartbeat, 8000);
            socket.emit('ping', { beat : 1 });
        }


        Timeout(sendHeartbeat, 8000);
*/

    })

}


module.exports = init;



