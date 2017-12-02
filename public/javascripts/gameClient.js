/* Deals with JavaScript events and drawing.
Respond to any messages received from the server via gameSocket.js
Pass any messages to be sent to the server to gameSocket.js */

// Draw canvas
//
// var radius;
// var x = 60;
// var y = 60;

var player = {id: null, x: (Math.random()*400), y : (Math.random()*400) , radius: 20, fillStyle: 'black'}


const up = 38;
const down = 40
const left = 37
const right = 39

var delta = 10;

var opponents = [];
var dots = [];


var canvas = document.getElementById('game-canvas');
var context = canvas.getContext('2d');


window.addEventListener('keydown', keypress);


// Change the player's x or y coords based on arrow key pressed.
// when player is redrawn, they will be at new position.
function keypress(e) {

  if (e.keyCode === up) {
    player.y = Math.max(0, player.y-= delta);
  }

  if (e.keyCode === down) {
       player.y = Math.min(canvas.height, player.y += delta);
  }

  if (e.keyCode === left) {
     player.x = Math.max(0, player.x-= delta);;
  }

  if (e.keyCode === right) {
     player.x = Math.min(canvas.width, player.x += delta);
  }

}

makeDots();
function makeDots() {

  // Suggestion: replace with procedurally generated dots so each client has the same

  // Load of random dots. Add to dots array.
  for (var x = 0 ; x < 100 ; x++) {
    var dot = { x : (Math.random() * canvas.width),  y: (Math.random() * canvas.height), radius: 10, fillStyle: "red"}
    dots.push(dot)
  }

}


// Once game is set up, start the game clock ticking.
// Change the second argument to modify the game speed.
var interval = setInterval(update, 100);


function update() {

  // Clear any old messages
  message();

  // Send player's current position and radius to the server.
  sendPosition(player);


  // Clear the canvas
  context.clearRect(0, 0, canvas.height, canvas.width);

  // draw all the things.

  // Draw opponents, and check for collisions

  for (var opId in opponents) {

    var op = opponents[opId];

    if (!op) {
      continue;  // undefined opponents - probably buggy connect code at the server
    }

    if (opId == player.id) {
      //that's us, ignore
      continue;
    }

    // If this player collides with this opponent...
    if (collide(op, player)) {
      // If the player is larger, they 'eat' the opponent
      if (player.radius > op.radius) {
        ateOpponent(op);
        message('You ate ' + op.id);
      }

      else if (player.radius == op.radius) {
        // equals - do nothing
      }

      else {
        // otherwise, player is smaller, gets eaten
        wasEaten();
        message('You were eaten by ' + op.id);
        clearInterval(interval);  //stop the setInterval method ticking, stop game

      }
    }

    draw(op, 'op');

  }


  // Draw dots. Remove dots that have been eaten.

  for (var d = 0 ; d < dots.length ; d++) {

    var dot = dots[d];

    if (collide(dot, player)) {
      dots[d] = undefined;
      console.log('collision with ', d)
      player.radius ++;
    } else {
      draw(dot);
    }
  }

  dots = dots.filter(function(d) { return d != null ; })  // remove undefined dots


  // Finally, draw this player, so it is on top of everything else.

  draw(player)

}



// Detect if two circles overlap or not.

function collide(a, b) {

  var dx = Math.abs(a.x - b.x);
  var dy = Math.abs(a.y - b.y);

  var rSum = a.radius + b.radius;

  return (dx*dx) + (dy*dy) <= (rSum * rSum);

}


// who parameter is optional, used to modify circle drawn.
// Without who parameter, draw circle of color given in actor.fillStyle and no border.

function draw(actor, who) {

  if (who == "op") {
    context.fillStyle = "blue"
  }

  else {
    context.fillStyle = actor.fillStyle;
  }

  context.beginPath();
  context.arc(actor.x, actor.y, actor.radius, 0, 2 * 6.2);
  context.fill();

}


function message(msg) {

  var span = document.getElementById('message');

  if (msg) {
    span.innerHTML = msg;
  }
  else {
    span.innerHTML = "";
  }
}


function preventStart() {
    clearInterval(interval);  //stop the setInterval method ticking, stop game
}
