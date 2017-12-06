var express = require('express');
var router = express.Router();
var passport = require('passport');
var ObjectID = require('mongodb').ObjectId;

var tasks = require('../routes/gameinfo');
var User = require('../models/gameDB');


// Note in app.js, app.use(passport) creates req.user when a user is logged in.

router.get('/', isLoggedIn, function(req, res, next) {
    //This will probably be the home page for your application
    // JSON code is Clara's passes req.user to index.hbs (from server to client)
    res.render('index', { user : JSON.stringify(req.user) });
});


/* GET signup page */
router.get('/signup', function(req, res, next){
    res.render('signup')
});


/* POST signup - this is called by clicking signup button on form
 *  * Call passport.authenticate with these arguments:
 *    what method to use - in this case, local-signup, defined in /config/passport.js
 *    what to do in event of success
 *    what to do in event of failure
 *    whether to display flash messages to user */
router.post('/signup', passport.authenticate('local-signup', {
    //successRedirect: '/secret',
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash :true
}));



/* GET login page. Any flash messages are automatically added. */
router.get('/login', function(req, res, next){
    res.render('login');
});


/* POST login - this is called when clicking login button
 Very similar to POST to signup, except using local-login method.  */
router.post('/login', passport.authenticate('local-login', {
    //successRedirect: '/secret',
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


/* GET Logout */
router.get('/logout', function(req, res, next) {
    req.logout();         //passport middleware adds these functions to req object.
    res.redirect('/');
});




/* POST update */
router.post('/update', function(req, res, next){


    var _id = req.body._id;

    // use form data to make a new Bird; save to DB
    // var user = User(req.body);

    for (item in req.body) {
        console.log('/update in gameinfo.js body first item = ' + item + ' -> ' + req.body[item]);
    }

        console.log('id = ' + _id);
        console.log('highScore = ' + req.body.highScore);
        console.log('highDate = ' + req.body.highDate);
        console.log('comment = ' + req.body.comment);

        //console.log('req.body.highGame.highDate = ' + req.body.highGame.highDate);
        //console.log('req.body.highgame.comment = ' + req.body.highGame.comment);

        //myHighGame = { highscore: req.body.highScore, highDate: req.body.highDate, comment: req.body.comment }

        //Logic to update the item
        User.update({ _id: ObjectID(_id) }, { $set : { highScore: req.body.highScore, highDate: req.body.highDate, comment: req.body.comment }})
            .then((result) => {

               // for (item in result){

               //     console.log('item = ' + item + " " + result[item]);
               // }


                if (result.ok) {
                    res.render('index');
                } else {
                    // The task was not found. Report 404 error.
                    var notFound = Error('User not found for update');
                    notFound.status = 404;
                    next(notFound);
                }
            })
            .catch((err) => {
                next(err);
            });

});





/* Middleware function. If user is logged in, call next - this calls the next
 middleware (if any) to continue chain of request processing. Typically, this will
 end up with the route handler that uses this middleware being called,
 for example GET /secret.

 If the user is not logged in, call res.redirect to send them back to the home page
 Could also send them to the login or signup pages if you prefer
 res.redirect ends the request handling for this request,
 so the route handler that uses this middleware (in this example, GET /secret) never runs.

 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


module.exports = router;